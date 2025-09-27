# 먼저, 내가 긁어 모은 원본 데이터들을 json 파일에 넣기 위해 json 포맷에 맞도록 바꿔줄 필요
# 아래의 코드는 특히 원본의 text를 \n 으로 바꿔줌으로써 training_examples.json 파일의 post_text에 내용을 그대로 붙여넣을 수 있게 됨.
# 나중에, 최적화된 언어 모델을 이용해서 json 형식으로 structured outputs을 출력할 때도, 원본 post는 이 형식으로 유지할 것!

import pandas as pd


def convert_text_for_json(text: str) -> str:
    """실제 줄바꿈을 JSON용 \\n으로 변환"""
    if pd.isna(text):
        return ""

    # 실제 줄바꿈을 \n으로 변환
    text = str(text).replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace("\n", "\\n")

    return text.strip()


def add_converted_column(file_path: str, text_column: str, new_column_name: str = None):
    """Excel/CSV 파일에 변환된 텍스트 칼럼 추가"""

    # 새 칼럼명 설정
    if new_column_name is None:
        new_column_name = f"{text_column}_json_format"

    print(f"📂 파일 읽는 중: {file_path}")

    # Excel 또는 CSV 파일 읽기
    if file_path.endswith(".xlsx") or file_path.endswith(".xls"):
        df = pd.read_excel(file_path)
    else:
        df = pd.read_csv(file_path)

    print(f"📊 총 {len(df)}개의 행")
    print(f"📋 기존 칼럼: {list(df.columns)}")

    if text_column not in df.columns:
        print(f"❌ 칼럼 '{text_column}'을 찾을 수 없습니다.")
        return

    # 텍스트 변환
    print(f"🔄 '{text_column}' 칼럼 변환 중...")
    df[new_column_name] = df[text_column].apply(convert_text_for_json)

    # 결과 저장 (Excel로 저장)
    if file_path.endswith(".xlsx"):
        output_file = file_path.replace(".xlsx", "_converted.xlsx")
        df.to_excel(output_file, index=False)
    elif file_path.endswith(".xls"):
        output_file = file_path.replace(".xls", "_converted.xlsx")
        df.to_excel(output_file, index=False)
    else:
        output_file = file_path.replace(".csv", "_converted.csv")
        df.to_csv(output_file, index=False, encoding="utf-8")

    print(f"✅ 변환 완료!")
    print(f"📄 결과 파일: {output_file}")
    print(f"📋 새 칼럼: '{new_column_name}'")

    # 샘플 출력
    if len(df) > 0:
        print(f"\n🔍 변환 샘플:")
        sample_idx = 0
        original = df[text_column].iloc[sample_idx]
        converted = df[new_column_name].iloc[sample_idx]

        print(f"원본 (처음 100자): {str(original)[:100]}...")
        print(f"변환 (처음 100자): {converted[:100]}...")


# 설정값
csv_file = r"E:\application_dataset\capplica_application.xlsx"
text_column = "original_post"
new_column_name = "json_friendly_post"

if __name__ == "__main__":
    # 실행
    add_converted_column(csv_file, text_column, new_column_name)
