# fix_hooks_null_to_empty_list.py
import json
import os
from datetime import datetime


def fix_hooks_null_values(input_file, output_file=None, backup=True):
    """
    JSON 파일에서 hooks가 null인 값들을 빈 리스트로 변경

    Args:
        input_file: 입력 JSON 파일 경로
        output_file: 출력 파일 경로 (None이면 원본 파일 덮어쓰기)
        backup: 백업 파일 생성 여부
    """

    print(f"🔧 hooks null 값 수정 시작: {input_file}")

    # 백업 파일 생성
    if backup:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = f"{input_file}.backup_{timestamp}"
        print(f"💾 백업 파일 생성: {backup_file}")

        # 원본 파일을 백업으로 복사
        import shutil

        shutil.copy2(input_file, backup_file)

    # JSON 파일 로드
    print("📂 JSON 파일 로딩 중...")
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"📊 총 {len(data)}개 항목 로드 완료")

    # hooks null 값 수정
    fixed_count = 0

    for i, item in enumerate(data):
        try:
            structured_profile = item.get("structured_profile", {})
            demographics = structured_profile.get("demographics", {})

            # hooks가 null인 경우 빈 리스트로 변경
            if demographics.get("hooks") is None:
                demographics["hooks"] = []
                fixed_count += 1

            # 진행상황 표시 (10000개마다)
            if (i + 1) % 10000 == 0:
                print(
                    f"🔄 처리 중... {i + 1}/{len(data)} ({(i + 1)/len(data)*100:.1f}%)"
                )

        except Exception as e:
            print(f"❌ 항목 {i} 처리 중 오류: {e}")
            continue

    print(f"✅ hooks null 값 수정 완료: {fixed_count}개 항목")

    # 수정된 데이터 저장
    if output_file is None:
        output_file = input_file

    print(f"💾 수정된 데이터 저장 중: {output_file}")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"🎉 수정 완료!")
    print(f"📈 통계:")
    print(f"   - 총 항목 수: {len(data)}")
    print(f"   - 수정된 항목 수: {fixed_count}")
    print(f"   - 수정 비율: {fixed_count/len(data)*100:.1f}%")

    return fixed_count


def validate_fix(file_path, sample_size=100):
    """
    수정이 제대로 되었는지 검증

    Args:
        file_path: 검증할 JSON 파일 경로
        sample_size: 샘플 검증 개수
    """
    print(f"\n🔍 수정 결과 검증 중: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    null_hooks_count = 0
    empty_list_hooks_count = 0

    # 전체 데이터에서 샘플링
    import random

    sample_indices = random.sample(range(len(data)), min(sample_size, len(data)))

    for i in sample_indices:
        item = data[i]
        try:
            hooks = (
                item.get("structured_profile", {}).get("demographics", {}).get("hooks")
            )

            if hooks is None:
                null_hooks_count += 1
            elif hooks == []:
                empty_list_hooks_count += 1

        except Exception as e:
            print(f"❌ 검증 중 오류 (항목 {i}): {e}")

    print(f"📊 검증 결과 (샘플 {len(sample_indices)}개):")
    print(f"   - null hooks: {null_hooks_count}개")
    print(f"   - 빈 리스트 hooks: {empty_list_hooks_count}개")

    if null_hooks_count == 0:
        print("✅ 모든 null hooks가 성공적으로 수정되었습니다!")
    else:
        print(f"⚠️ 여전히 {null_hooks_count}개의 null hooks가 남아있습니다.")

    return null_hooks_count == 0


if __name__ == "__main__":
    # 파일 경로 설정 (현재 디렉토리 기준으로 수정)
    input_file = "capplica_application_bilingual_final.json"  # 경로 수정

    # 파일 존재 확인
    if not os.path.exists(input_file):
        print(f"❌ 파일을 찾을 수 없습니다: {input_file}")
        exit(1)

    try:
        # hooks null 값 수정
        fixed_count = fix_hooks_null_values(input_file)

        # 수정 결과 검증
        is_valid = validate_fix(input_file)

        if is_valid:
            print("\n🎉 hooks null 값 수정이 성공적으로 완료되었습니다!")
        else:
            print(
                "\n⚠️ 일부 null 값이 여전히 남아있을 수 있습니다. 로그를 확인해주세요."
            )

    except Exception as e:
        print(f"❌ 처리 중 오류 발생: {e}")
        raise
