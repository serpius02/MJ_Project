import os
from typing import List, Literal, Optional

import dspy
import mlflow
import pydantic
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 여기가 mlflow ui에서 실험 이름으로 설정하는 곳
mlflow.set_tracking_uri("file:./mlruns")

mlflow.set_experiment("post_to_json")

mlflow.dspy.autolog()

# --- 1. Pydantic으로 customized JSON 구조(스키마) 정의 ---

# StudentProfile
# ├── demographics: Demographics
# ├── academics: Academics
# │   ├── gpa: GPA
# │   ├── course_count: CourseCount
# │   └── senior_year_course_load: List[str]
# ├── standardized_testing: StandardizedTesting
# │   ├── sat_i: SAT
# │   └── act: int
# ├── extracurriculars: List[str]
# ├── awards_honors: List[str]
# ├── letters_of_recommendation: List[LOR]
# ├── essays: Essay
# ├── decisions: Decisions
# │   ├── acceptances: List[Decision]
# │   ├── waitlists: List[Decision]
# │   └── rejections: List[Decision]
# └── additional_information: str

# --- Pydantic으로 수정된 JSON 구조(스키마) 정의 ---


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


# 모든 것을 포함하는 최상위 Pydantic 모델
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


# --- 2. dspy 시그니처 정의 ---


# Pydantic 모델을 출력 타입으로 지정
# 추가적으로 output이 어떠해야 할 지에 대한 정보를 주고 싶으면 OutputField의 desc에 기입
class ExtractProfile(dspy.Signature):
    """Extract detailed information..."""

    post_text: str = dspy.InputField(desc="The full text of the student's post.")

    # 새로운 원칙 기반의 지시사항으로 수정
    structured_profile: StudentProfile = dspy.OutputField(
        desc="For the 'decision_plan' field, classify based on when the final decision was made, not the initial application type. If a student was deferred or waitlisted and then later accepted, the plan should reflect the timing of that final acceptance (e.g., 'RD'). Moreover, if there is no specific mention of the application type or decision timing, use 'N/A'."
    )


# --- 3. dspy 설정 및 실행 ---

# .env 파일에서 Gemini API 키 가져오기
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# API 키 검증
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
# dspy.configure(lm=dspy.LM('gemini/gemini-2.5-pro-preview-03-25', temperature = 0, max_tokens=8000, api_key=GEMINI_API_KEY))

# 정보 추출기 모듈 생성
extractor = dspy.Predict(ExtractProfile)

# 입력 텍스트
post_text = """
Business Major 🎓\n\nDemographics\n\nAsian\nMale\n0-50k\nPublic School\nAcademics\n\n1540 SAT\n7 AP's\n4.14 W\nExtracurriculars\n\n1. Local entrepreneur club\n\n2. Student government president\n\n3. Business club founder & president\n\n4. Cofounder of an international NGO\n\n5. Business advisor\n\n6. Helping local businesses\n\n7. Predicting future sale & cash flow\n\n8. Intern\n\n9. Volunteer\n\nAwards\n\n1. Academic Distinction\n\n2. National Economic Challenge Individual Distinction\n\n3. Model Entrepreneurship Competition finalist\n\n4. PwC ESG challenge semi finalist\n\n5. Campus basketball champion\n\nAcceptances\n\n1. IU Kelley\n\n2. UMich LSA Organizational studies\n\n3. UC Berkeley\n\n4. UCI\n\n5. UCD\n\n6. UCSB\n\n7. UCLA\n\n8. UCSD
"""

# 모듈 실행을 MLflow run으로 감싸기
print("📍 현재 작업 디렉토리:", os.getcwd())
print("📍 MLflow tracking URI:", mlflow.get_tracking_uri())

# MLflow run 시작
with mlflow.start_run() as run:
    print(f"🚀 MLflow run 시작됨 - Run ID: {run.info.run_id}")

    # 파라미터 로깅
    mlflow.log_param("model", "gemini-2.5-flash")
    mlflow.log_param("temperature", 0)
    mlflow.log_param("max_tokens", 8000)
    print("📝 파라미터 로깅 완료")

    # 모듈 실행
    result = extractor(post_text=post_text)
    print("🤖 AI 처리 완료")

    # 결과 로깅
    output_json = result.structured_profile.model_dump_json(indent=2)
    mlflow.log_text(output_json, "structured_profile.json")
    mlflow.log_metric("output_length", len(output_json))
    print("✅ MLflow 로깅 완료")

print("📂 mlruns 폴더 확인:")
os.system("ls -la mlruns/")

# Pydantic 모델을 JSON 형식으로 출력
print(result.structured_profile.model_dump_json(indent=2))
