import asyncio
import json
import os
import time
from datetime import datetime, timedelta, timezone

import feedparser
import openai
import requests  # requests 라이브러리 import
from dateutil import parser as date_parser
from dotenv import load_dotenv
from requests.adapters import HTTPAdapter
from supabase import Client, create_client
from urllib3.util.retry import Retry

# .env 파일 로드
load_dotenv()

# --- 클라이언트 초기화 ---
try:
    SUPABASE_URL = os.environ["SUPABASE_URL"]
    SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    openai_client = openai.AsyncOpenAI(
        api_key=os.environ["OPENAI_API_KEY"], timeout=60.0
    )
except KeyError as e:
    print(f"오류: 환경 변수 {e}가 설정되지 않았습니다.")
    exit()

# --- 설정 ---
RSS_FEEDS = [
    "https://rss.app/feeds/MBYAZYmRL2O5aPji.xml",
    "https://rss.app/feeds/KQdogDhcsq2I7nXM.xml",
    "https://rss.app/feeds/2YBnLkuviM19kHiB.xml",
    "https://rss.app/feeds/Zh5N6av0PKMopfyF.xml",
]
SCRIPT_NAME = "rss_app"

# --- 소스 이름 매핑 ---
SOURCE_MAP = {
    "https://rss.app/feeds/MBYAZYmRL2O5aPji.xml": "The New York Times",
    "https://rss.app/feeds/KQdogDhcsq2I7nXM.xml": "Inside Higher Ed",
    "https://rss.app/feeds/2YBnLkuviM19kHiB.xml": "US News & World Report",
    "https://rss.app/feeds/Zh5N6av0PKMopfyF.xml": "The Chronicle of Higher Education",
}


# --- 네트워크 요청 함수 (개선된 버전) ---
async def fetch_feed_content_async(url: str, max_retries: int = 3):
    """개선된 RSS 피드 가져오기 함수"""
    print(f"  -> 네트워킹 시작: {url}")
    loop = asyncio.get_running_loop()

    def blocking_get_with_retry():
        # 세션 생성 및 재시도 전략 설정
        session = requests.Session()

        # 재시도 전략 설정
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("http://", adapter)
        session.mount("https://", adapter)

        # 더 현실적인 헤더 설정
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/rss+xml, application/xml, text/xml, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
        }

        for attempt in range(max_retries):
            try:
                print(f"    시도 {attempt + 1}/{max_retries}")

                # 타임아웃을 더 길게 설정 (연결: 10초, 읽기: 30초)
                response = session.get(
                    url,
                    headers=headers,
                    timeout=(10, 30),
                    allow_redirects=True,
                    verify=True,
                )
                response.raise_for_status()

                print(
                    f"    ✅ 성공: 상태코드 {response.status_code}, 크기: {len(response.content)} bytes"
                )
                return response.content

            except requests.exceptions.Timeout as e:
                print(f"    ⏰ 타임아웃 오류 (시도 {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 2  # 2초, 4초, 6초 대기
                    print(f"    💤 {wait_time}초 대기 후 재시도...")
                    time.sleep(wait_time)

            except requests.exceptions.ConnectionError as e:
                print(f"    🔌 연결 오류 (시도 {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    time.sleep((attempt + 1) * 3)

            except requests.exceptions.HTTPError as e:
                print(f"    📡 HTTP 오류 (시도 {attempt + 1}): {e}")
                if e.response.status_code in [429, 503]:  # 일시적 오류
                    if attempt < max_retries - 1:
                        time.sleep((attempt + 1) * 5)
                else:
                    break  # 영구적 오류는 재시도하지 않음

            except requests.exceptions.RequestException as e:
                print(f"    ❌ 기타 요청 오류 (시도 {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    time.sleep((attempt + 1) * 2)

        print(f"    💥 모든 시도 실패: {url}")
        return None

    # 별도의 스레드에서 실행
    content = await loop.run_in_executor(None, blocking_get_with_retry)
    print(f"  <- 네트워킹 완료: {url}")
    return content


# --- AI 처리 함수들 (이전과 동일) ---
# ... get_embedding, get_ai_summary_and_translation, process_entry 함수는 그대로 ...
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
Ensure the summaries are objective and reportorial in tone. Your entire output must be a single, valid JSON object.
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
    # ... (DB에서 마지막 실행 시간 가져오는 로직은 그대로) ...
    time_threshold = None
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
            time_threshold = start_time - timedelta(days=5)
            print("최초 실행: 지난 5일간의 데이터를 확인합니다.")
    except Exception:
        time_threshold = start_time - timedelta(days=5)
        print("최초 실행 또는 조회 오류: 지난 5일간의 데이터를 확인합니다.")

    # 2. 새로운 기사를 찾아 처리할 작업 목록을 만듭니다.
    tasks = []
    print("\n[1단계] 각 피드에서 처리할 새로운 기사를 찾습니다...")
    for feed_url in RSS_FEEDS:
        print(f"\n  - 피드 확인: {feed_url}")

        # 수정된 비동기 함수로 피드 내용을 가져옴
        feed_content = await fetch_feed_content_async(feed_url)

        if not feed_content:
            continue  # 피드 가져오기 실패 시 다음으로 넘어감

        feed = feedparser.parse(feed_content)
        clean_source_name = SOURCE_MAP.get(feed_url, feed.feed.get("title", feed_url))

        for entry in feed.entries:
            if "published" not in entry:
                continue

            published_date = date_parser.parse(entry.get("published"))

            if published_date.tzinfo is None:
                published_date = published_date.replace(tzinfo=timezone.utc)

            if published_date > time_threshold:
                tasks.append(process_entry(entry, clean_source_name))

    # ... (이하 배치 처리 및 DB 저장 로직은 이전 답변과 동일) ...
    if not tasks:
        print("\n처리할 새로운 뉴스가 없습니다.")
        return

    articles_to_insert = []
    total_tasks = len(tasks)
    batch_size = 5

    print(
        f"\n[2단계] 총 {total_tasks}개의 기사를 {batch_size}개씩 묶어 AI 작업을 시작합니다..."
    )

    for i in range(0, total_tasks, batch_size):
        batch_tasks = tasks[i : i + batch_size]
        print(
            f"\n  -> 배치 {i//batch_size + 1} 처리 중 ({i+1}~{min(i+batch_size, total_tasks)}번 작업)..."
        )

        for future in asyncio.as_completed(batch_tasks):
            try:
                article = await future
                if article:
                    articles_to_insert.append(article)
                    print(f"    └> AI 처리 완료: {article['title'][:50]}...")
            except Exception as e:
                print(f"    └> AI 처리 중 오류 발생 (항목 건너뜀): {e}")

    print(
        f"\n[3단계] AI 처리 완료. {len(articles_to_insert)}개의 기사를 DB에 저장합니다..."
    )
    try:
        if articles_to_insert:
            supabase.table("news_articles").upsert(
                articles_to_insert, on_conflict="link"
            ).execute()
            print(
                f"\n🎉 처리 완료! {len(articles_to_insert)}개 항목을 Supabase에 저장했습니다."
            )
        else:
            print("처리할 새로운 뉴스가 없거나 모든 항목 처리 중 오류가 발생했습니다.")

        supabase.table("script_metadata").upsert(
            {"script_name": SCRIPT_NAME, "last_successful_run": start_time.isoformat()}
        ).execute()
        print(f"마지막 실행 시간 기록 완료: {start_time.strftime('%Y-%m-%d %H:%M')}")

    except Exception as e:
        print(f"🚨 Supabase 데이터 저장/업데이트 오류: {e}")
        print("오류가 발생하여 마지막 실행 시간을 업데이트하지 않습니다.")


if __name__ == "__main__":
    asyncio.run(main())
