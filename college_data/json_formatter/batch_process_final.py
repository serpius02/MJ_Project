## 주어진 capplica data 셋을 통째로 언어 모델에 넣어서 bilingual structured outputs 뽑아내는 코드

import json
import os
from typing import List, Literal, Optional

import dspy
import mlflow
import pandas as pd
import pydantic
from dotenv import load_dotenv
from tqdm import tqdm

# .env 파일 로드
load_dotenv()

# MLflow 설정
mlflow.set_tracking_uri("file:./mlruns")
mlflow.set_experiment("batch_processing_bilingual")
mlflow.dspy.autolog()

# --- 1. Pydantic 모델 정의 (single_post_final.py에서 복사) ---


class LocalizedText(pydantic.BaseModel):
    """Represents a piece of text in both English and Korean."""

    english: Optional[str] = None
    korean: Optional[str] = None


class Demographics(pydantic.BaseModel):
    gender: Optional[str] = None
    race_ethnicity: Optional[LocalizedText] = None
    residence: Optional[LocalizedText] = None
    income_bracket: Optional[str] = None
    type_of_school: Optional[LocalizedText] = None
    hooks: Optional[List[LocalizedText]] = None
    intended_majors: Optional[LocalizedText] = None


class GPA(pydantic.BaseModel):
    unweighted: Optional[float] = None
    weighted: Optional[float] = None


class CourseCount(pydantic.BaseModel):
    honors: Optional[int] = None
    ap: Optional[int] = None
    ib: Optional[int] = None
    dual_enrollment: Optional[int] = None


class Academics(pydantic.BaseModel):
    gpa: Optional[GPA] = None
    course_count: Optional[CourseCount] = None
    senior_year_course_load: Optional[List[LocalizedText]] = None


class SAT(pydantic.BaseModel):
    total: Optional[int] = None
    reading_writing: Optional[int] = None
    math: Optional[int] = None


class StandardizedTesting(pydantic.BaseModel):
    sat_i: Optional[SAT] = None
    act: Optional[int] = None


class LOR(pydantic.BaseModel):
    recommender: Optional[LocalizedText] = None
    estimated_rating: Optional[float] = None


class Essay(pydantic.BaseModel):
    common_app: Optional[LocalizedText] = None
    supplementals: Optional[LocalizedText] = None


class Decision(pydantic.BaseModel):
    university: LocalizedText
    decision_plan: Literal["EA", "ED", "RD", "RA", "N/A"]


class Decisions(pydantic.BaseModel):
    acceptances: Optional[List[Decision]] = None
    waitlists: Optional[List[Decision]] = None
    rejections: Optional[List[Decision]] = None


# 모든 것을 포함하는 최상위 Pydantic 모델
class StudentProfile(pydantic.BaseModel):
    demographics: Optional[Demographics] = None
    academics: Optional[Academics] = None
    standardized_testing: Optional[StandardizedTesting] = None
    extracurriculars: Optional[List[LocalizedText]] = None
    awards_honors: Optional[List[LocalizedText]] = None
    letters_of_recommendation: Optional[List[LOR]] = None

    essays: Optional[Essay] = None
    decisions: Optional[Decisions] = None
    additional_information: Optional[LocalizedText] = None

    class Config:
        json_schema_extra = {
            "description": "A structured representation of a student's college application profile."
        }


# --- 2. DSPy Signature 정의 ---


class ExtractProfile(dspy.Signature):
    """
    You are an expert in parsing and structuring student college application data.
    Extract detailed information from the student's post into the given JSON schema.

    Key Instructions:
    1.  **LocalizedText Fields - Translation Rules**:
        - **English-only fields** (set korean: null): race_ethnicity, residence, type_of_school, university
        - **Translate to Korean**: hooks, intended_majors, senior_year_course_load, recommender, common_app, supplementals, extracurriculars, awards_honors, additional_information
        - For English-only fields: {"english": "extracted_text", "korean": null}
        - For translated fields: {"english": "extracted_text", "korean": "korean_translation"}

    2.  **Non-LocalizedText Fields**: gender, income_bracket remain as simple strings/values (not LocalizedText objects)

    3.  **Decision Plan**: For the 'decision_plan' field, classify based on when the final decision was made, not the initial application type. If a student was deferred or waitlisted and then later accepted, the plan should reflect the timing of that final acceptance (e.g., 'RD'). If there's no mention of the application type, use 'N/A'.

    4.  **Completeness**: Fill in all possible fields. If information for a field is not available, leave it as null.
    """

    post_text: str = dspy.InputField(desc="The full text of the student's post.")
    structured_profile: StudentProfile = dspy.OutputField(
        desc="The structured student profile in bilingual JSON format."
    )


# --- 3. DSPy 설정 ---


def setup_dspy():
    """DSPy 설정"""
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    if not GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY가 설정되지 않았습니다. "
            ".env 파일에 GEMINI_API_KEY=your_api_key_here 를 추가해주세요."
        )

    dspy.configure(
        lm=dspy.LM(
            "gemini/gemini-2.5-flash",
            temperature=0,
            max_tokens=8000,
            api_key=GEMINI_API_KEY,
        )
    )


# --- 4. 배치 처리 함수 ---


def load_excel_data(excel_path):
    """Excel 파일에서 데이터 로드"""
    print(f"📁 Excel 파일 로딩: {excel_path}")

    df = pd.read_excel(excel_path)
    print(f"📊 데이터 크기: {df.shape}")
    print(f"📋 컬럼: {list(df.columns)}")

    if "json_friendly_post" not in df.columns:
        raise ValueError("'json_friendly_post' 컬럼을 찾을 수 없습니다.")

    # 빈 값이 아닌 행만 필터링
    df = df.dropna(subset=["json_friendly_post"])
    print(f"📊 빈 값 제거 후 데이터 크기: {df.shape}")

    return df


def batch_process_posts(
    df, output_path="capplica_application_bilingual_final.json", batch_size=50
):
    """배치로 게시물 처리 (Bilingual)"""
    print(f"🚀 배치 처리 시작 - 총 {len(df)}개 게시물 (Bilingual)")
    print(f"📦 배치 크기: {batch_size}")

    # DSPy 모듈 생성
    extractor = dspy.Predict(ExtractProfile)

    results = []
    errors = []

    # MLflow 실행
    with mlflow.start_run(run_name="batch_processing_bilingual_full"):
        mlflow.log_param("total_posts", len(df))
        mlflow.log_param("batch_size", batch_size)
        mlflow.log_param("model", "gemini-2.5-flash")
        mlflow.log_param("processing_type", "bilingual")

        # 진행 상황 표시를 위한 tqdm 사용
        for idx, row in tqdm(
            df.iterrows(), total=len(df), desc="Processing posts (Bilingual)"
        ):
            try:
                post_text = row["json_friendly_post"]

                # DSPy로 구조화된 프로필 추출
                result = extractor(post_text=post_text)

                # 결과를 딕셔너리 형태로 변환
                structured_data = {
                    "post_text": post_text,
                    "structured_profile": result.structured_profile.model_dump(),
                }

                results.append(structured_data)

                # 배치마다 중간 저장
                if len(results) % batch_size == 0:
                    print(f"✅ {len(results)}개 처리 완료 (Bilingual)")

            except Exception as e:
                error_info = {
                    "index": idx,
                    "error": str(e),
                    "post_preview": (
                        str(row["json_friendly_post"])[:100] + "..."
                        if pd.notna(row["json_friendly_post"])
                        else "N/A"
                    ),
                }
                errors.append(error_info)
                print(f"❌ 인덱스 {idx} 처리 실패: {e}")

                # 에러가 너무 많으면 중단
                if len(errors) > len(df) * 0.1:  # 10% 이상 에러
                    print(f"⚠️ 에러율이 너무 높습니다. 처리 중단.")
                    break

        # 최종 결과 저장
        print(f"💾 결과 저장 중: {output_path}")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        # 에러 로그 저장 (있다면)
        if errors:
            error_path = output_path.replace(".json", "_errors.json")
            with open(error_path, "w", encoding="utf-8") as f:
                json.dump(errors, f, indent=2, ensure_ascii=False)
            print(f"⚠️ 에러 로그 저장: {error_path}")

        # 통계 로깅
        mlflow.log_metric("successful_extractions", len(results))
        mlflow.log_metric("failed_extractions", len(errors))
        mlflow.log_metric("success_rate", len(results) / len(df) * 100)

        print(f"✅ 배치 처리 완료! (Bilingual)")
        print(f"📊 성공: {len(results)}개")
        print(f"❌ 실패: {len(errors)}개")
        print(f"📈 성공률: {len(results) / len(df) * 100:.1f}%")

        return results, errors


# --- 5. 메인 실행 함수 ---


def main():
    """메인 처리 함수"""
    print("🎯 Bilingual 배치 처리 시작!")

    # 경로 설정
    excel_path = "../data_capplica_application/capplica_application_converted.xlsx"
    output_path = (
        "../data_capplica_application/capplica_application_bilingual_final.json"
    )

    try:
        # DSPy 설정
        setup_dspy()
        print("✅ DSPy 설정 완료")

        # 데이터 로드
        df = load_excel_data(excel_path)

        # 테스트 모드 (작은 샘플로 먼저 테스트)
        if len(df) > 100:
            print("🧪 테스트 모드: 처음 5개 샘플로 테스트 (Bilingual)")
            test_df = df.head(5)
            test_results, test_errors = batch_process_posts(
                test_df, output_path.replace(".json", "_test.json"), batch_size=3
            )

            if len(test_errors) / len(test_df) > 0.3:  # 30% 이상 에러
                print("⚠️ 테스트에서 에러율이 높습니다. 전체 처리를 중단합니다.")
                return

            # 결과 미리보기
            if test_results:
                print("\n📋 첫 번째 테스트 결과 미리보기:")
                first_result = test_results[0]["structured_profile"]

                # Demographics 미리보기
                if first_result.get("demographics"):
                    demo = first_result["demographics"]
                    print("  Demographics:")
                    for key, value in demo.items():
                        if isinstance(value, dict) and "english" in value:
                            print(
                                f"    {key}: '{value['english']}' -> '{value['korean']}'"
                            )
                        elif value is not None:
                            print(f"    {key}: {value}")

                # Extracurriculars 미리보기
                if (
                    first_result.get("extracurriculars")
                    and len(first_result["extracurriculars"]) > 0
                ):
                    print("  First extracurricular:")
                    first_ec = first_result["extracurriculars"][0]
                    print(f"    '{first_ec['english']}' -> '{first_ec['korean']}'")

            # 사용자 확인
            user_input = input("\n테스트 성공! 전체 데이터를 처리하시겠습니까? (y/n): ")
            if user_input.lower() != "y":
                print("처리를 취소합니다.")
                return

        # 전체 배치 처리
        results, errors = batch_process_posts(df, output_path, batch_size=30)

        print(f"🎉 모든 처리 완료! (Bilingual)")
        print(f"📁 결과 파일: {output_path}")

        # 최종 비용 정보
        lm = dspy.settings.lm
        if hasattr(lm, "history"):
            total_cost = sum(
                [x.get("cost", 0) for x in lm.history if x.get("cost") is not None]
            )
            print(f"💰 총 예상 비용: ${total_cost:.4f} USD")

    except Exception as e:
        print(f"❌ 처리 중 오류 발생: {e}")
        raise


if __name__ == "__main__":
    main()
