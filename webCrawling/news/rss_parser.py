import asyncio
import json
import os
from datetime import datetime, timedelta, timezone

import feedparser
import openai
from dateutil import parser as date_parser
from dotenv import load_dotenv
from supabase import Client, create_client

# 이 코드는 웹사이트가 정형화된 rss feed 주소를 제공하는 경우에 사용
# .env 파일 로드
load_dotenv()

# --- 클라이언트 초기화 ---
try:
    SUPABASE_URL = os.environ["SUPABASE_URL"]
    SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    openai_client = openai.AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])
except KeyError as e:
    print(f"오류: 환경 변수 {e}가 설정되지 않았습니다.")
    exit()

# --- 설정 ---
RSS_FEEDS = [
    "https://rss.nytimes.com/services/xml/rss/nyt/Education.xml",
]
SCRIPT_NAME = "rss_parser_script"

# --- 소스 이름 매핑 ---
SOURCE_MAP = {
    "https://rss.nytimes.com/services/xml/rss/nyt/Education.xml": "The New York Times",
    # 다른 피드를 추가할 때 여기에 등록: "피드주소": "표시할 이름"
}

# --- AI 처리 함수들 (이전과 동일) ---


async def get_embedding(text: str) -> list[float]:
    """텍스트의 임베딩 벡터를 생성합니다."""
    try:
        response = await openai_client.embeddings.create(
            input=text, model="text-embedding-3-small"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"임베딩 생성 오류: {e}")
        return []


async def get_ai_summary_and_translation(
    title: str, summary: str, source_name: str
) -> dict:
    """AI를 이용해 뉴스 형식의 요약과 번역을 생성합니다."""
    system_prompt = f"""
You are a professional international news editor. Your task is to process a news brief from "{source_name}" and generate a JSON object with two keys: "en" and "ko".

Each key should contain an object with "title" and "summary" keys.

- For the "en" key:
  - "title": The original English title.
  - "summary": A concise, news-style summary beginning with "{source_name} reports that...".

- For the "ko" key:
  - "title": A high-quality Korean translation of the original title.
  - "summary": A news-style summary in Korean beginning with "{source_name}에 따르면...".

Ensure the summaries are objective and reportorial in tone.
Your entire output must be a single, valid JSON object.
"""
    content_to_process = f"Title: {title}\n\nSummary: {summary}"
    try:
        response = await openai_client.chat.completions.create(
            model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": content_to_process},
            ],
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"번역/요약 생성 오류: {e}")
        return {"en": {"title": title, "summary": summary}}


async def process_entry(entry, clean_source_name):
    """RSS 피드의 개별 항목(entry)을 받아 모든 AI 처리를 수행합니다."""
    title = entry.get("title", "")
    summary = entry.get("summary", "")
    link = entry.get("link")
    published_str = entry.get("published", "")

    if not all([title, link, published_str]):
        return None

    text_to_embed = f"Title: {title}\nSummary: {summary}"
    embedding_task = get_embedding(text_to_embed)
    translation_task = get_ai_summary_and_translation(title, summary, clean_source_name)
    embedding, translations = await asyncio.gather(embedding_task, translation_task)

    if not embedding:
        return None

    return {
        "title": title,
        "link": link,
        "summary": summary,
        "published_date": date_parser.parse(published_str).isoformat(),
        "source": clean_source_name,
        "embedding": embedding,
        "translations": translations,
    }


# --- 메인 실행 로직 ---
async def main():
    print("🚀 AI 기반 RSS 파서 실행 (DB 상태 기억 방식)...")
    start_time = datetime.now(timezone.utc)
    time_threshold = None

    # 1. DB에서 마지막 성공 실행 시간을 가져옵니다.
    try:
        response = (
            supabase.table("script_metadata")
            .select("last_successful_run")
            .eq("script_name", SCRIPT_NAME)
            .single()
            .execute()
        )
        if response.data:
            time_threshold = date_parser.parse(response.data["last_successful_run"])
            print(
                f"마지막 실행 시간: {time_threshold.strftime('%Y-%m-%d %H:%M')} 이후 뉴스만 처리합니다."
            )
        else:
            # 기록이 없으면 최초 실행으로 간주
            time_threshold = start_time - timedelta(days=3)
            print("최초 실행: 지난 3일간의 데이터를 확인합니다.")
    except Exception:
        # 테이블이 비어있거나 오류 발생 시 최초 실행으로 간주
        time_threshold = start_time - timedelta(days=3)
        print("최초 실행 또는 조회 오류: 지난 3일간의 데이터를 확인합니다.")

    # 2. 새로운 기사를 필터링하고 처리합니다.
    tasks = []
    for feed_url in RSS_FEEDS:
        print(f"\n피드 확인 중: {feed_url}")
        feed = feedparser.parse(feed_url)
        # ▼▼▼ [수정] SOURCE_MAP을 사용하도록 변경 ▼▼▼
        clean_source_name = SOURCE_MAP.get(feed_url, feed.feed.get("title", feed_url))

        for entry in feed.entries:
            published_date = date_parser.parse(entry.get("published", ""))
            if published_date > time_threshold:
                # ▼▼▼ [수정] clean_source_name을 인자로 전달 ▼▼▼
                tasks.append(process_entry(entry, clean_source_name))

    if not tasks:
        print("처리할 새로운 뉴스가 없습니다.")
        return

    processed_articles = await asyncio.gather(*tasks)
    articles_to_insert = [article for article in processed_articles if article]

    # 3. 새로운 기사를 DB에 저장하고, 성공하면 마지막 실행 시간을 업데이트합니다.
    try:
        if articles_to_insert:
            supabase.table("news_articles").upsert(
                articles_to_insert, on_conflict="link"
            ).execute()
            print(
                f"\n🎉 처리 완료! {len(articles_to_insert)}개 항목을 Supabase에 저장했습니다."
            )
        else:
            print("처리할 새로운 뉴스가 없습니다.")

        # 성공적으로 실행이 끝났으므로 DB에 마지막 실행 시간 업데이트
        supabase.table("script_metadata").upsert(
            {"script_name": SCRIPT_NAME, "last_successful_run": start_time.isoformat()}
        ).execute()
        print(f"마지막 실행 시간 기록 완료: {start_time.strftime('%Y-%m-%d %H:%M')}")

    except Exception as e:
        print(f"🚨 Supabase 데이터 저장/업데이트 오류: {e}")
        print("오류가 발생하여 마지막 실행 시간을 업데이트하지 않습니다.")


if __name__ == "__main__":
    asyncio.run(main())
