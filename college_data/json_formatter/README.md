# JSON Formatter

이 폴더는 대학 지원자 데이터를 구조화된 JSON 형태로 변환하는 도구들을 포함합니다.

## 파일 구조

### 메인 처리 파일들

- **`single_post_final.py`** (837 lines)
  - 개별 포스트를 처리하여 이중언어(영어/한국어) 구조화된 JSON으로 변환하는 최종 버전
  - Pydantic 모델을 사용한 데이터 검증
  - MLflow를 통한 실험 추적

- **`batch_process_final.py`** (342 lines)
  - Capplica 데이터셋 전체를 배치 처리하여 이중언어 구조화된 출력을 생성하는 최종 버전
  - 대량의 데이터를 효율적으로 처리
  - Progress tracking with tqdm

### 개발 버전 파일들

- **`single_post.py`** (196 lines)
  - 개별 포스트 처리 초기 버전 (영어만 지원)
  - Final 버전의 기반이 되는 코드

- **`batch_process.py`** (296 lines)
  - 배치 처리 초기 버전 (영어만 지원)
  - Final 버전의 기반이 되는 코드

### 최적화 도구

- **`dspy_optimization.py`** (758 lines)
  - DSPy 프레임워크를 사용한 언어 모델 최적화
  - 성능 향상을 위한 프롬프트 및 모델 튜닝

### 기타

- **`mlruns/`**
  - MLflow 실험 추적 데이터 저장소
  - 모델 성능 및 실험 결과 기록

## 사용법

1. **개별 포스트 처리**: `single_post_final.py` 사용
2. **대량 데이터 처리**: `batch_process_final.py` 사용
3. **모델 최적화**: `dspy_optimization.py` 사용

## 기능

- 대학 지원자 데이터를 구조화된 JSON으로 변환
- 영어/한국어 이중언어 출력 지원
- 인구통계학적 정보, 학업 성취도, 표준화 시험 점수, 과외 활동 등 포괄적 데이터 처리
- MLflow를 통한 실험 관리 및 추적
