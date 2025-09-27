import glob
import json
import os
import random
from typing import List, Literal, Optional

import dspy
import mlflow
import pydantic
from dotenv import load_dotenv
from sklearn.model_selection import train_test_split

# .env 파일 로드
load_dotenv()

# MLflow 설정
mlflow.dspy.autolog()
mlflow.set_tracking_uri("file:./mlruns")
mlflow.set_experiment("dspy_optimization")

# --- 1. Pydantic 모델 정의 (single_post.py에서 복사) ---


class Demographics(pydantic.BaseModel):
    gender: Optional[str] = None
    race_ethnicity: Optional[str] = None
    residence: Optional[str] = None
    income_bracket: Optional[str] = None
    type_of_school: Optional[str] = None
    hooks: Optional[List[str]] = None
    intended_majors: Optional[str] = None


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
    senior_year_course_load: Optional[List[str]] = None


class SAT(pydantic.BaseModel):
    total: Optional[int] = None
    reading_writing: Optional[int] = None
    math: Optional[int] = None


class StandardizedTesting(pydantic.BaseModel):
    sat_i: Optional[SAT] = None
    act: Optional[int] = None


class LOR(pydantic.BaseModel):
    recommender: Optional[str] = None
    estimated_rating: Optional[float] = None


class Essay(pydantic.BaseModel):
    common_app: Optional[str] = None
    supplementals: Optional[str] = None


class Decision(pydantic.BaseModel):
    university: str
    decision_plan: Literal["EA", "ED", "RD", "RA", "N/A"]


class Decisions(pydantic.BaseModel):
    acceptances: Optional[List[Decision]] = None
    waitlists: Optional[List[Decision]] = None
    rejections: Optional[List[Decision]] = None


class StudentProfile(pydantic.BaseModel):
    demographics: Optional[Demographics] = None
    academics: Optional[Academics] = None
    standardized_testing: Optional[StandardizedTesting] = None
    extracurriculars: Optional[List[str]] = None
    awards_honors: Optional[List[str]] = None
    letters_of_recommendation: Optional[List[LOR]] = None
    essays: Optional[Essay] = None
    decisions: Optional[Decisions] = None
    additional_information: Optional[str] = None

    class Config:
        json_schema_extra = {
            "description": "A structured representation of a student's college application profile."
        }


# --- 2. DSPy Signature 정의 ---


class ExtractProfile(dspy.Signature):
    """Extract detailed information from a student's college application post into a structured JSON format."""

    post_text: str = dspy.InputField(desc="The full text of the student's post.")
    structured_profile: StudentProfile = dspy.OutputField(
        desc="For the 'decision_plan' field, classify based on when the final decision was made, not the initial application type. If a student was deferred or waitlisted and then later accepted, the plan should reflect the timing of that final acceptance (e.g., 'RD'). Moreover, if there is no specific mention of the application type or decision timing, use 'N/A'."
    )


# --- 3. 데이터 로드 및 분할 ---


def load_and_split_data(json_file_path, test_size=0.2, val_size=0.15, random_state=42):
    """데이터를 로드하고 train/validation/test로 분할"""

    with open(json_file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"총 데이터 개수: {len(data)}개")

    # post_text와 structured_profile 분리
    texts = [item["post_text"] for item in data]
    profiles = [item["structured_profile"] for item in data]

    # 먼저 train과 temp로 분할
    texts_train, texts_temp, profiles_train, profiles_temp = train_test_split(
        texts, profiles, test_size=(test_size + val_size), random_state=random_state
    )

    # temp를 validation과 test로 분할
    val_ratio = val_size / (test_size + val_size)
    texts_val, texts_test, profiles_val, profiles_test = train_test_split(
        texts_temp, profiles_temp, test_size=(1 - val_ratio), random_state=random_state
    )

    # DSPy Example 객체로 변환
    train_examples = [
        dspy.Example(post_text=text, structured_profile=profile).with_inputs(
            "post_text"
        )
        for text, profile in zip(texts_train, profiles_train)
    ]

    val_examples = [
        dspy.Example(post_text=text, structured_profile=profile).with_inputs(
            "post_text"
        )
        for text, profile in zip(texts_val, profiles_val)
    ]

    test_examples = [
        dspy.Example(post_text=text, structured_profile=profile).with_inputs(
            "post_text"
        )
        for text, profile in zip(texts_test, profiles_test)
    ]

    print(
        f"Train: {len(train_examples)}개, Validation: {len(val_examples)}개, Test: {len(test_examples)}개"
    )

    return train_examples, val_examples, test_examples


# --- 4. 하이브리드 평가 메트릭 (Exact Match + Semantic F1) ---

from dspy.evaluate import SemanticF1

# SemanticF1 metric 인스턴스
semantic_f1 = SemanticF1(decompositional=True)


def get_nested_value(data, path):
    """중첩된 딕셔너리에서 값 가져오기 (예: 'academics.gpa.unweighted')"""
    try:
        value = data
        for key in path.split("."):
            if isinstance(value, dict):
                value = value.get(key)
            else:
                value = getattr(value, key, None)
        return value
    except:
        return None


def semantic_compare(pred_text, exp_text):
    """두 텍스트의 의미적 유사도 계산"""
    if pred_text is None and exp_text is None:
        return 1.0
    if pred_text is None or exp_text is None:
        return 0.0

    try:
        # 임시 Example 객체 생성
        temp_example = type("TempExample", (), {"response": str(exp_text)})()
        temp_prediction = type("TempPrediction", (), {"response": str(pred_text)})()

        return semantic_f1(temp_example, temp_prediction)
    except:
        return 0.0


def semantic_compare_list(pred_list, exp_list):
    """리스트 요소들의 의미적 유사도 계산"""
    if not pred_list and not exp_list:
        return 1.0
    if not pred_list or not exp_list:
        return 0.0

    try:
        # 리스트를 문자열로 변환
        pred_str = " | ".join(str(item) for item in pred_list if item is not None)
        exp_str = " | ".join(str(item) for item in exp_list if item is not None)

        return semantic_compare(pred_str, exp_str)
    except:
        return 0.0


def evaluate_decisions_hybrid(pred_decisions, exp_decisions):
    """대학 결정 정보 하이브리드 평가 (university: semantic, decision_plan: exact)"""
    try:
        total_score = 0.0
        total_categories = 0

        for category in ["acceptances", "waitlists", "rejections"]:
            pred_list = pred_decisions.get(category, []) if pred_decisions else []
            exp_list = exp_decisions.get(category, []) if exp_decisions else []

            if pred_list or exp_list:
                category_score = evaluate_decision_category(pred_list, exp_list)
                total_score += category_score
                total_categories += 1

        return total_score / total_categories if total_categories > 0 else 0.0
    except:
        return 0.0


def evaluate_decision_category(pred_list, exp_list):
    """단일 결정 카테고리 평가"""
    if not pred_list and not exp_list:
        return 1.0
    if not pred_list or not exp_list:
        return 0.0

    try:
        # 예상 대학과 실제 대학의 매칭 점수 계산
        total_matches = 0

        for exp_decision in exp_list:
            if not isinstance(exp_decision, dict):
                continue

            exp_uni = exp_decision.get("university", "")
            exp_plan = exp_decision.get("decision_plan", "")

            best_match = 0.0
            for pred_decision in pred_list:
                if not isinstance(pred_decision, dict):
                    continue

                pred_uni = pred_decision.get("university", "")
                pred_plan = pred_decision.get("decision_plan", "")

                # University: semantic similarity
                uni_score = semantic_compare(pred_uni, exp_uni)

                # Decision plan: exact match
                plan_score = 1.0 if pred_plan == exp_plan else 0.0

                # 전체 점수 (두 필드 평균)
                decision_score = (uni_score + plan_score) / 2.0
                best_match = max(best_match, decision_score)

            total_matches += best_match

        return total_matches / len(exp_list) if exp_list else 0.0
    except:
        return 0.0


def hybrid_student_profile_metric(example, prediction, trace=None):
    """StudentProfile을 위한 하이브리드 평가 메트릭"""
    try:
        predicted = (
            prediction.structured_profile.model_dump()
            if hasattr(prediction.structured_profile, "model_dump")
            else prediction.structured_profile
        )
        expected = example.structured_profile

        scores = []
        field_count = 0

        # Demographics 평가
        demo_fields_exact = ["gender", "race_ethnicity", "type_of_school"]
        demo_fields_semantic = [
            "residence",
            "income_bracket",
            "hooks",
            "intended_majors",
        ]

        pred_demo = predicted.get("demographics", {})
        exp_demo = expected.get("demographics", {})

        # Exact match fields in demographics
        for field in demo_fields_exact:
            pred_val = pred_demo.get(field) if pred_demo else None
            exp_val = exp_demo.get(field) if exp_demo else None
            scores.append(1.0 if pred_val == exp_val else 0.0)
            field_count += 1

        # Semantic fields in demographics
        for field in demo_fields_semantic:
            pred_val = pred_demo.get(field) if pred_demo else None
            exp_val = exp_demo.get(field) if exp_demo else None
            if field == "hooks":
                # hooks는 리스트일 수 있음
                if isinstance(pred_val, list) or isinstance(exp_val, list):
                    scores.append(semantic_compare_list(pred_val or [], exp_val or []))
                else:
                    scores.append(semantic_compare(pred_val, exp_val))
            else:
                scores.append(semantic_compare(pred_val, exp_val))
            field_count += 1

        # Academics 평가 (exact match)
        academic_exact_fields = [
            "academics.gpa.unweighted",
            "academics.gpa.weighted",
            "academics.course_count.honors",
            "academics.course_count.ap",
            "academics.course_count.ib",
            "academics.course_count.dual_enrollment",
        ]

        for field_path in academic_exact_fields:
            pred_val = get_nested_value(predicted, field_path)
            exp_val = get_nested_value(expected, field_path)
            scores.append(1.0 if pred_val == exp_val else 0.0)
            field_count += 1

        # Senior year course load (semantic)
        pred_courses = get_nested_value(predicted, "academics.senior_year_course_load")
        exp_courses = get_nested_value(expected, "academics.senior_year_course_load")
        scores.append(semantic_compare_list(pred_courses or [], exp_courses or []))
        field_count += 1

        # Standardized testing (exact match)
        testing_exact_fields = [
            "standardized_testing.sat_i.total",
            "standardized_testing.sat_i.reading_writing",
            "standardized_testing.sat_i.math",
            "standardized_testing.act",
        ]

        for field_path in testing_exact_fields:
            pred_val = get_nested_value(predicted, field_path)
            exp_val = get_nested_value(expected, field_path)
            scores.append(1.0 if pred_val == exp_val else 0.0)
            field_count += 1

        # Extracurriculars (semantic)
        pred_extra = predicted.get("extracurriculars", [])
        exp_extra = expected.get("extracurriculars", [])
        scores.append(semantic_compare_list(pred_extra, exp_extra))
        field_count += 1

        # Awards honors (semantic)
        pred_awards = predicted.get("awards_honors", [])
        exp_awards = expected.get("awards_honors", [])
        scores.append(semantic_compare_list(pred_awards, exp_awards))
        field_count += 1

        # Letters of recommendation (semantic)
        pred_lor = predicted.get("letters_of_recommendation")
        exp_lor = expected.get("letters_of_recommendation")
        scores.append(semantic_compare(str(pred_lor), str(exp_lor)))
        field_count += 1

        # Essays (semantic)
        pred_essays = predicted.get("essays")
        exp_essays = expected.get("essays")
        scores.append(semantic_compare(str(pred_essays), str(exp_essays)))
        field_count += 1

        # Decisions (hybrid)
        pred_decisions = predicted.get("decisions", {})
        exp_decisions = expected.get("decisions", {})
        scores.append(evaluate_decisions_hybrid(pred_decisions, exp_decisions))
        field_count += 1

        # Additional information (semantic)
        pred_add = predicted.get("additional_information")
        exp_add = expected.get("additional_information")
        scores.append(semantic_compare(pred_add, exp_add))
        field_count += 1

        return sum(scores) / field_count if field_count > 0 else 0.0

    except Exception as e:
        print(f"하이브리드 메트릭 평가 실패: {e}")
        return 0.0


# --- 5. DSPy 설정 ---


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


# --- 6. 최적화 실행 ---


def run_optimization_comparison(train_examples, val_examples, test_examples):
    """하이브리드 메트릭을 사용한 DSPy optimizer 비교"""

    print("📊 사용할 메트릭: Hybrid (Exact Match + Semantic F1)")

    # 하이브리드 메트릭 사용
    evaluate_func = hybrid_student_profile_metric

    results = {}
    optimizers = {}

    # 1. Baseline (unoptimized)
    print("\n🚀 Baseline 모델 평가...")
    with mlflow.start_run(run_name="baseline"):
        baseline = dspy.Predict(ExtractProfile)

        # validation set으로 평가
        val_scores = []
        for example in val_examples[:15]:  # 더 많은 예제로 평가
            try:
                prediction = baseline(post_text=example.post_text)
                score = evaluate_func(example, prediction)
                val_scores.append(score)
            except Exception as e:
                print(f"Baseline 예측 실패: {e}")
                val_scores.append(0.0)

        avg_score = sum(val_scores) / len(val_scores)
        mlflow.log_metric("val_hybrid", avg_score)

        results["baseline"] = avg_score
        optimizers["baseline"] = baseline
        print(f"Baseline 결과: {avg_score:.3f}")

    # 2. BootstrapFewShot 최적화
    print("\n🚀 BootstrapFewShot 최적화...")
    with mlflow.start_run(run_name="bootstrap_fewshot"):
        try:
            bootstrap_optimizer = dspy.BootstrapFewShot(
                metric=evaluate_func,
                max_bootstrapped_demos=8,  # 더 많은 데모 예제 사용
                max_labeled_demos=12,  # 더 많은 레이블 예제 사용
                max_rounds=2,  # 여러 라운드 부트스트래핑
            )

            optimized_bootstrap = bootstrap_optimizer.compile(
                dspy.Predict(ExtractProfile),
                trainset=train_examples[:30],  # 더 많은 훈련 데이터 사용
            )

            # validation set으로 평가
            val_scores = []
            for example in val_examples[:15]:
                try:
                    prediction = optimized_bootstrap(post_text=example.post_text)
                    score = evaluate_func(example, prediction)
                    val_scores.append(score)
                except Exception as e:
                    print(f"BootstrapFewShot 예측 실패: {e}")
                    val_scores.append(0.0)

            avg_score = sum(val_scores) / len(val_scores)
            mlflow.log_metric("val_hybrid", avg_score)

            results["bootstrap_fewshot"] = avg_score
            optimizers["bootstrap_fewshot"] = optimized_bootstrap
            print(f"BootstrapFewShot 결과: {avg_score:.3f}")

        except Exception as e:
            print(f"BootstrapFewShot 최적화 실패: {e}")
            results["bootstrap_fewshot"] = None
            optimizers["bootstrap_fewshot"] = None

    # 3. MIPRO 최적화 (시간이 오래 걸릴 수 있음)
    print("\n🚀 MIPRO 최적화...")
    with mlflow.start_run(run_name="mipro"):
        try:
            mipro_optimizer = dspy.MIPROv2(
                metric=evaluate_func,
                auto="light",  # 가벼운 버전 사용
            )

            optimized_mipro = mipro_optimizer.compile(
                dspy.Predict(ExtractProfile),
                trainset=train_examples[:25],  # 더 많은 훈련 데이터 사용
                valset=val_examples[:8],  # 더 많은 검증 데이터 사용
                requires_permission_to_run=False,  # Windows 호환성을 위해 확인 프롬프트 비활성화
            )

            # validation set으로 평가
            val_scores = []
            for example in val_examples[:15]:
                try:
                    prediction = optimized_mipro(post_text=example.post_text)
                    score = evaluate_func(example, prediction)
                    val_scores.append(score)
                except Exception as e:
                    print(f"MIPRO 예측 실패: {e}")
                    val_scores.append(0.0)

            avg_score = sum(val_scores) / len(val_scores)
            mlflow.log_metric("val_hybrid", avg_score)

            results["mipro"] = avg_score
            optimizers["mipro"] = optimized_mipro
            print(f"MIPRO 결과: {avg_score:.3f}")

        except Exception as e:
            print(f"MIPRO 최적화 실패: {e}")
            results["mipro"] = None
            optimizers["mipro"] = None

    # 결과와 최적화된 함수들을 모두 반환
    results["optimizers"] = optimizers

    # 총 비용 계산
    lm = dspy.settings.lm
    if hasattr(lm, "history"):
        total_cost = sum(
            [x.get("cost", 0) for x in lm.history if x.get("cost") is not None]
        )
        results["total_cost"] = total_cost
        print(f"\n💰 총 예상 비용: ${total_cost:.4f} USD")
    else:
        results["total_cost"] = None
        print("\n💰 비용 정보를 가져올 수 없습니다.")

    return results


# --- 7. 메인 실행 함수 ---


def main():
    """하이브리드 메트릭을 사용한 DSPy 최적화"""
    print("🎯 DSPy Optimization with Hybrid Metric!")
    print("📊 사용 메트릭: Hybrid (Exact Match + Semantic F1)")

    # DSPy 설정
    setup_dspy()

    # 데이터 로드 및 분할
    train_examples, val_examples, test_examples = load_and_split_data(
        "../data_capplica_application/capplica_examples.json"
    )

    # 하이브리드 메트릭으로 최적화 비교 실행
    results = run_optimization_comparison(train_examples, val_examples, test_examples)

    # 결과 요약
    print("\n📊 하이브리드 메트릭 최적화 결과:")
    print("=" * 50)

    for optimizer_name, score in results.items():
        if optimizer_name != "optimizers" and optimizer_name != "total_cost":
            if score is not None:
                print(f"{optimizer_name.upper()}: {score:.3f}")
            else:
                print(f"{optimizer_name.upper()}: 실행 실패")

    # 샘플 출력 비교 (첫 번째 예제로)
    if train_examples:
        print("\n" + "=" * 60)
        print("🔍 샘플 출력 비교 (첫 번째 예제)")
        print("=" * 60)

        sample_example = train_examples[0]
        print(f"\n📝 입력 텍스트:")
        print(
            sample_example.post_text[:200] + "..."
            if len(sample_example.post_text) > 200
            else sample_example.post_text
        )

        print(f"\n🎯 정답 (Expected):")
        expected_json = json.dumps(
            sample_example.structured_profile, indent=2, ensure_ascii=False
        )
        print(
            expected_json[:500] + "..." if len(expected_json) > 500 else expected_json
        )

        for optimizer_name, optimizer_func in results.get("optimizers", {}).items():
            if optimizer_func is not None:
                try:
                    print(f"\n🤖 {optimizer_name.upper()} 출력:")
                    prediction = optimizer_func(post_text=sample_example.post_text)
                    predicted_json = json.dumps(
                        prediction.structured_profile.model_dump(),
                        indent=2,
                        ensure_ascii=False,
                    )
                    print(
                        predicted_json[:500] + "..."
                        if len(predicted_json) > 500
                        else predicted_json
                    )

                    # 개별 점수도 표시
                    score = hybrid_student_profile_metric(sample_example, prediction)
                    print(f"📊 이 예제 점수: {score:.3f}")
                except Exception as e:
                    print(f"❌ 출력 생성 실패: {e}")

        print("\n" + "=" * 60)

    # 최고 성능 optimizer 찾기
    best_optimizer = None
    best_score = 0

    for optimizer_name, score in results.items():
        if optimizer_name != "optimizers" and optimizer_name != "total_cost":
            if (
                score is not None
                and isinstance(score, (int, float))
                and score > best_score
            ):
                best_score = score
                best_optimizer = optimizer_name

    if best_optimizer:
        print(
            f"\n🏆 최고 성능: {best_optimizer.upper()} (하이브리드: {best_score:.3f})"
        )

        # 최고 성능 모델 저장
        best_optimizer_func = results["optimizers"].get(best_optimizer)
        if best_optimizer_func is not None:
            save_filename = f"best_optimizer_{best_optimizer}.json"
            try:
                best_optimizer_func.save(save_filename)
                print(f"💾 최고 성능 모델 저장됨: {save_filename}")
            except Exception as e:
                print(f"❌ 모델 저장 실패: {e}")

    # 비용 정보 표시
    if results.get("total_cost") is not None:
        print(f"💰 총 예상 비용: ${results['total_cost']:.4f} USD")

    print("\n✅ 하이브리드 메트릭 최적화 완료!")

    return results


def load_and_test_optimizer(model_path, test_text=None):
    """저장된 최적화 모델을 로드하고 테스트"""
    print(f"📁 모델 로딩: {model_path}")

    try:
        # 새로운 모듈 인스턴스 생성 후 로드
        loaded_model = dspy.Predict(ExtractProfile)
        loaded_model.load(model_path)

        if test_text:
            print("🧪 테스트 실행중...")
            result = loaded_model(post_text=test_text)

            print("🤖 예측 결과:")
            predicted_json = json.dumps(
                result.structured_profile.model_dump(), indent=2, ensure_ascii=False
            )
            print(predicted_json)

        return loaded_model

    except Exception as e:
        print(f"❌ 모델 로딩 실패: {e}")
        return None


def demo_saved_model():
    """저장된 모델 데모"""
    # 샘플 텍스트
    demo_text = """
    Business Major 🎓

    Demographics
    Asian
    Male
    0-50k
    Public School
    
    Academics
    1540 SAT
    7 AP's
    4.14 W
    
    Extracurriculars
    1. Student government president
    2. Business club founder
    
    Acceptances
    1. UC Berkeley
    2. UCLA
    """

    import glob

    saved_models = glob.glob("best_optimizer_*.json")

    if saved_models:
        latest_model = max(saved_models, key=lambda x: os.path.getmtime(x))
        print(f"📁 가장 최근 저장된 모델: {latest_model}")
        return load_and_test_optimizer(latest_model, demo_text)
    else:
        print("❌ 저장된 모델을 찾을 수 없습니다. 먼저 최적화를 실행하세요.")
        return None


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "demo":
        # 저장된 모델 데모 실행
        demo_saved_model()
    else:
        # 기본: 최적화 실행
        print("🚀 DSPy 최적화를 시작합니다...")
        print("💡 저장된 모델을 테스트하려면: python dspy_optimization.py demo")
        main()
