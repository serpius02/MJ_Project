import json
import os
import time

import praw
from dotenv import load_dotenv

# .env 파일에서 환경 변수 불러오기
load_dotenv()

############################################
# 1. Connect to the Reddit API (PRAW) - 환경 변수 사용
############################################
reddit = praw.Reddit(
    # os.getenv()를 사용해 .env 파일에서 키를 안전하게 불러옵니다.
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent="MJ_scraper by /u/Comprehensive-Bank58",
)
print("Reddit API에 성공적으로 연결되었습니다.")

############################################
# 2. 설정
############################################
subreddit_name = "chanceme"
subreddit = reddit.subreddit(subreddit_name)
posts_to_scrape = 1000

base_dir = r"E:\ChanceMe"
os.makedirs(base_dir, exist_ok=True)  # exist_ok=True로 더 간결하게

CURSOR_FILE = os.path.join(base_dir, "last_fullname.txt")
JSON_FILE = os.path.join(base_dir, "scraped_posts.json")

# 마지막 처리 지점 불러오기
last_fullname = None
if os.path.exists(CURSOR_FILE):
    with open(CURSOR_FILE, "r") as f:
        last_fullname = f.read().strip() or None

############################################
# 3. 게시물 가져오기 - 수정된 'after' 파라미터 사용
############################################
print(
    f"'{subreddit_name}' 서브레딧에서 게시물 수집을 시작합니다. 시작 지점: {last_fullname or '처음부터'}"
)
# 'params' 대신 'after' 인자를 직접 사용합니다.
posts = subreddit.top(limit=posts_to_scrape, after=last_fullname)

############################################
# 4. 데이터 처리 및 실시간 저장
############################################
all_posts_data = []  # 메모리에 임시 저장할 리스트
new_last_fullname = None

# 기존 파일이 있다면 데이터를 불러와서 이어붙이기 준비
if os.path.exists(JSON_FILE):
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        try:
            all_posts_data = json.load(f)
        except json.JSONDecodeError:
            all_posts_data = []  # 파일이 비어있거나 손상된 경우

print(f"총 {posts_to_scrape}개의 게시물을 처리합니다...")
for i, submission in enumerate(posts):
    try:
        # 진행 상황 출력
        print(f"({i+1}/{posts_to_scrape}) 처리 중: {submission.id}")

        # 마지막 게시물 ID 기록 (페이지네이션 커서)
        new_last_fullname = submission.fullname

        # "more comments" 객체 처리
        submission.comments.replace_more(limit=0)

        post_data = {
            "post_id": submission.id,
            "title": submission.title,
            "score": submission.score,
            "url": submission.url,
            "num_comments": submission.num_comments,
            "created_utc": submission.created_utc,
            "selftext": submission.selftext,
            "comments": [
                {
                    "comment_id": comment.id,
                    "comment_body": comment.body,
                    "comment_score": comment.score,
                    "comment_created": comment.created_utc,
                }
                for comment in submission.comments.list()
            ],
        }

        all_posts_data.append(post_data)

    except Exception as e:
        # 오류 발생 시 로그를 남기고 계속 진행
        print(f"오류 발생: 게시물 {submission.id} 처리 중 문제 발생 - {e}")
        continue

############################################
# 5. 최종 데이터 및 커서 저장
############################################
# 수집된 모든 데이터를 JSON 파일에 저장
with open(JSON_FILE, "w", encoding="utf-8") as f:
    json.dump(all_posts_data, f, indent=4, ensure_ascii=False)

# 다음 실행을 위해 마지막 게시물 ID 저장
if new_last_fullname:
    with open(CURSOR_FILE, "w") as f:
        f.write(new_last_fullname)

print(
    f"데이터 저장이 완료되었습니다. 총 {len(all_posts_data)}개의 게시물이 저장되었습니다."
)
print(f"다음 시작 지점 커서: {new_last_fullname}")
