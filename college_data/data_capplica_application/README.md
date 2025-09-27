# Data Capplica Application

이 폴더는 Capplica 대학 지원자 데이터를 처리하고 구조화하는 과정에서 생성된 데이터 파일들을 포함합니다.

## 파일 구조

### 원본 데이터 및 변환 도구

- **`convert_csv_json.py`** (80 lines)
  - 원본 Excel/CSV 데이터를 JSON 친화적 형태로 변환하는 스크립트
  - 텍스트 내 줄바꿈을 `\n` 형태로 변환하여 JSON 호환성 확보
  - 변환된 컬럼을 추가하여 새로운 파일 생성

- **`capplica_application_converted.xlsx`** (795KB, 3290 lines)
  - 변환 스크립트로 처리된 원본 데이터
  - JSON 친화적 형태의 텍스트 컬럼 포함

### 학습 및 예시 데이터

- **`capplica_examples.json`** (269KB, 7218 lines)
  - 구조화된 학생 프로필 예시 데이터
  - `post_text`와 `structured_profile` 쌍으로 구성
  - 언어 모델 학습 및 검증용

### 처리 결과 데이터

- **`capplica_application_en_final.json`** (5.2MB)
  - 영어 버전 구조화된 출력 결과
  - 단일 언어로 처리된 최종 데이터

- **`capplica_application_bilingual_final.json`** (8.2MB, 250563 lines)
  - **메인 이중언어 결과 파일**
  - 영어/한국어 병행 구조화된 출력
  - LocalizedText 구조로 각 필드의 영어/한국어 번역 포함

### 테스트 및 검증 데이터

- **`capplica_application_bilingual_final_test.json`** (23KB, 729 lines)
  - 이중언어 처리 테스트용 샘플 데이터
  - 메인 파일과 동일한 구조이지만 작은 크기

### 에러 로그

- **`capplica_application_bilingual_final_errors.json`** (592B, 7 lines)
  - 데이터 처리 과정에서 발생한 에러 기록
  - 검증 실패 및 포맷 오류 등의 상세 정보 포함

## 데이터 구조

### 이중언어 구조 (LocalizedText)
```json
{
  "english": "Political Science",
  "korean": "정치학"
}
```

### 학생 프로필 구조
- **Demographics**: 성별, 인종, 거주지, 소득, 학교 유형, 특별 사항, 전공 계획
- **Academics**: GPA, 수강 과목 수, 고3 수강 과목
- **Standardized Testing**: SAT, ACT 점수
- **Extracurriculars**: 과외 활동 목록
- **Awards & Honors**: 수상 경력
- **Decisions**: 대학 합격/불합격 결과

## 사용 순서

1. `convert_csv_json.py`로 원본 데이터 변환
2. `capplica_examples.json`으로 모델 학습
3. `capplica_application_bilingual_final.json`에서 최종 결과 확인
4. `capplica_application_bilingual_final_errors.json`에서 처리 실패 케이스 분석
5. 일전에 내가 hooks의 데이터 구조를 Optional[List[LocalizedText]]로 지정하지 않았기에 문제가 발생하였었음. 이걸 수정하기 위해 json 파일의 hooks: null 값을 hooks: [] 로 변경하는 `fix_hooks_null_to_empty_list.py`를 만들었음.

## 데이터베이스 마이그레이션

### `migrate_to_supabase.py`
Supabase 데이터베이스로 구조화된 데이터를 마이그레이션하는 스크립트입니다.

#### 주요 기능
- **테스트 모드**: 소량의 데이터로 먼저 테스트
- **배치 처리**: 대용량 데이터를 안전하게 처리
- **None-safe 처리**: 누락된 데이터에 대한 안전한 처리
- **상세한 통계**: 삽입 성공/실패 통계 제공

#### 환경 설정
`.env` 파일에 다음 변수들이 필요합니다:
```env
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Supabase 데이터베이스 구조

#### 1. `profiles` 테이블 (메인 테이블)
학생별 기본 정보를 저장하는 중심 테이블
- `id`: Primary Key (UUID)
- `post_text`: 원본 게시글 텍스트
- **Demographics 필드**:
  - `gender`: 성별
  - `race_ethnicity_english/korean`: 인종/민족 (이중언어)
  - `residence_english/korean`: 거주지 (이중언어)
  - `income_bracket`: 소득 구간
  - `school_type_english/korean`: 학교 유형 (이중언어)
  - `major_english/korean`: 전공 계획 (이중언어)
- **Academics 필드**:
  - `gpa_unweighted/weighted`: 가중/비가중 GPA
  - `course_honors/ap/ib/dual_enrollment`: 각종 수강 과목 수
- **Testing 필드**:
  - `sat_total/reading_writing/math`: SAT 점수
  - `act`: ACT 점수
- **Essays 필드**:
  - `essay_common_app_english/korean`: 공통원서 에세이 (이중언어)
  - `essay_supplements_english/korean`: 보충 에세이 (이중언어)
- **Additional Info 필드**:
  - `additional_info_english/korean`: 추가 정보 (이중언어)

#### 2. `hooks` 테이블
학생별 특별한 배경/사항을 저장
- `profile_id`: Foreign Key → profiles.id
- `hook_english/korean`: 특별 사항 내용 (이중언어)
- `display_order`: 표시 순서

#### 3. `extracurriculars` 테이블
학생별 과외활동을 저장
- `profile_id`: Foreign Key → profiles.id
- `activity_english/korean`: 활동 내용 (이중언어)
- `display_order`: 표시 순서

#### 4. `awards` 테이블
학생별 수상경력을 저장
- `profile_id`: Foreign Key → profiles.id
- `award_english/korean`: 수상 내용 (이중언어)
- `display_order`: 표시 순서

#### 5. `letters_of_recommendation` 테이블
추천서 정보를 저장
- `profile_id`: Foreign Key → profiles.id
- `recommender_english/korean`: 추천인 정보 (이중언어)
- `estimated_rating`: 추정 점수 (Float)

#### 6. `senior_courses` 테이블
고3 수강과목을 저장
- `profile_id`: Foreign Key → profiles.id
- `course_english/korean`: 과목명 (이중언어)
- `display_order`: 표시 순서

#### 7. `university_decisions` 테이블
대학 합격/불합격 결과를 저장
- `profile_id`: Foreign Key → profiles.id
- `decision_type`: 결과 유형 ('acceptance', 'waitlist', 'rejection')
- `university_english/korean`: 대학명 (이중언어)
- `decision_plan`: 지원 유형 ('EA', 'ED', 'RD', 'RA', 'N/A')

### 사용 방법
```bash
cd data_capplica_application
python migrate_to_supabase.py
```
1. 테스트 모드로 먼저 실행하여 연결 확인
2. 성공 시 전체 마이그레이션 진행
3. 상세한 통계와 오류 정보 제공

## 데이터 크기 및 규모

- 총 처리 대상: 약 3,290개 지원자 데이터
- 최종 성공 처리: 약 25만 라인 이상
- 처리 실패: 7건 (에러 파일 참조)
