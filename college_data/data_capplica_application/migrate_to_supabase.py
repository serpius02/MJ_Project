# migrate_to_supabase.py
import asyncio
import json
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from supabase import Client, create_client

# .env 파일 로드
load_dotenv()

# Supabase 설정 - 환경변수에서 가져오기
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file. "
        "Please add them to your .env file."
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


class SupabaseMigrator:
    def __init__(
        self, json_file_path: str, test_mode: bool = False, test_limit: int = 5
    ):
        self.json_file_path = json_file_path
        self.test_mode = test_mode
        self.test_limit = test_limit
        self.stats = {
            "total_profiles": 0,
            "successful_profiles": 0,
            "failed_profiles": 0,
            "hooks_inserted": 0,
            "extracurriculars_inserted": 0,
            "awards_inserted": 0,
            "lors_inserted": 0,
            "senior_courses_inserted": 0,
            "decisions_inserted": 0,
            "errors": [],
        }

    def extract_localized_text(self, data) -> tuple[Optional[str], Optional[str]]:
        """LocalizedText 객체에서 영어/한국어 추출"""
        if isinstance(data, dict):
            return data.get("english"), data.get("korean")
        elif isinstance(data, str):
            return data, None
        return None, None

    def migrate_profile(self, item: Dict) -> Optional[str]:
        """개별 프로필 마이그레이션 (None-safe)"""
        try:
            post_text = item.get("post_text", "")
            profile = item.get("structured_profile") or {}

            # Demographics 데이터 추출 (None-safe)
            demographics = profile.get("demographics") or {}
            race_en, race_ko = self.extract_localized_text(
                demographics.get("race_ethnicity")
            )
            residence_en, residence_ko = self.extract_localized_text(
                demographics.get("residence")
            )
            school_en, school_ko = self.extract_localized_text(
                demographics.get("type_of_school")
            )
            major_en, major_ko = self.extract_localized_text(
                demographics.get("intended_majors")
            )

            # Academics 데이터 추출 (None-safe)
            academics = profile.get("academics") or {}
            gpa_data = academics.get("gpa") or {}
            course_count = academics.get("course_count") or {}

            # Testing 데이터 추출 (None-safe)
            testing = profile.get("standardized_testing") or {}
            sat_data = testing.get("sat_i") or {}

            # Essays 데이터 추출 (None-safe)
            essays = profile.get("essays") or {}
            common_app_en, common_app_ko = self.extract_localized_text(
                essays.get("common_app")
            )
            supplements_en, supplements_ko = self.extract_localized_text(
                essays.get("supplementals")
            )

            # Additional Info 추출
            additional_en, additional_ko = self.extract_localized_text(
                profile.get("additional_information")
            )

            # 프로필 데이터 구성
            profile_data = {
                "post_text": post_text,
                # Demographics
                "gender": demographics.get("gender"),
                "race_ethnicity_english": race_en,
                "race_ethnicity_korean": race_ko,
                "residence_english": residence_en,
                "residence_korean": residence_ko,
                "income_bracket": demographics.get("income_bracket"),
                "school_type_english": school_en,
                "school_type_korean": school_ko,
                "major_english": major_en,
                "major_korean": major_ko,
                # Academics
                "gpa_unweighted": gpa_data.get("unweighted"),
                "gpa_weighted": gpa_data.get("weighted"),
                "course_honors": course_count.get("honors"),
                "course_ap": course_count.get("ap"),
                "course_ib": course_count.get("ib"),
                "course_dual_enrollment": course_count.get("dual_enrollment"),
                # Testing
                "sat_total": sat_data.get("total"),
                "sat_reading_writing": sat_data.get("reading_writing"),
                "sat_math": sat_data.get("math"),
                "act": testing.get("act"),
                # Essays
                "essay_common_app_english": common_app_en,
                "essay_common_app_korean": common_app_ko,
                "essay_supplements_english": supplements_en,
                "essay_supplements_korean": supplements_ko,
                # Additional Info
                "additional_info_english": additional_en,
                "additional_info_korean": additional_ko,
            }

            # 프로필 삽입
            result = supabase.table("profiles").insert(profile_data).execute()
            if not result.data:
                raise Exception("Failed to insert profile")

            profile_id = result.data[0]["id"]

            # 관련 데이터 삽입 (None-safe)
            self.migrate_hooks(profile_id, demographics.get("hooks") or [])
            self.migrate_extracurriculars(
                profile_id, profile.get("extracurriculars") or []
            )
            self.migrate_awards(profile_id, profile.get("awards_honors") or [])
            self.migrate_lors(
                profile_id, profile.get("letters_of_recommendation") or []
            )
            self.migrate_senior_courses(
                profile_id, academics.get("senior_year_course_load") or []
            )
            self.migrate_decisions(profile_id, profile.get("decisions") or {})

            return profile_id

        except Exception as e:
            self.stats["errors"].append(str(e))
            raise e

    def migrate_hooks(self, profile_id: str, hooks: List):
        """훅 데이터 마이그레이션"""
        if not hooks:
            return

        for idx, hook in enumerate(hooks):
            try:
                en, ko = self.extract_localized_text(hook)
                if en:  # 영어 텍스트가 있을 때만 삽입
                    supabase.table("hooks").insert(
                        {
                            "profile_id": profile_id,
                            "hook_english": en,
                            "hook_korean": ko,
                            "display_order": idx,
                        }
                    ).execute()
                    self.stats["hooks_inserted"] += 1
            except Exception as e:
                self.stats["errors"].append(f"Hook insertion error: {e}")

    def migrate_extracurriculars(self, profile_id: str, extracurriculars: List):
        """과외활동 데이터 마이그레이션"""
        if not extracurriculars:
            return

        for idx, activity in enumerate(extracurriculars):
            try:
                en, ko = self.extract_localized_text(activity)
                if en:
                    supabase.table("extracurriculars").insert(
                        {
                            "profile_id": profile_id,
                            "activity_english": en,
                            "activity_korean": ko,
                            "display_order": idx,
                        }
                    ).execute()
                    self.stats["extracurriculars_inserted"] += 1
            except Exception as e:
                self.stats["errors"].append(f"Extracurricular insertion error: {e}")

    def migrate_awards(self, profile_id: str, awards: List):
        """수상경력 데이터 마이그레이션"""
        if not awards:
            return

        for idx, award in enumerate(awards):
            try:
                en, ko = self.extract_localized_text(award)
                if en:
                    supabase.table("awards").insert(
                        {
                            "profile_id": profile_id,
                            "award_english": en,
                            "award_korean": ko,
                            "display_order": idx,
                        }
                    ).execute()
                    self.stats["awards_inserted"] += 1
            except Exception as e:
                self.stats["errors"].append(f"Award insertion error: {e}")

    def migrate_lors(self, profile_id: str, lors: List):
        """추천서 데이터 마이그레이션"""
        if not lors:
            return

        for lor in lors:
            try:
                en, ko = self.extract_localized_text(lor.get("recommender"))
                supabase.table("letters_of_recommendation").insert(
                    {
                        "profile_id": profile_id,
                        "recommender_english": en,
                        "recommender_korean": ko,
                        "estimated_rating": lor.get("estimated_rating"),
                    }
                ).execute()
                self.stats["lors_inserted"] += 1
            except Exception as e:
                self.stats["errors"].append(f"LOR insertion error: {e}")

    def migrate_senior_courses(self, profile_id: str, courses: List):
        """고3 수강과목 데이터 마이그레이션"""
        if not courses:
            return

        for idx, course in enumerate(courses):
            try:
                en, ko = self.extract_localized_text(course)
                if en:
                    supabase.table("senior_courses").insert(
                        {
                            "profile_id": profile_id,
                            "course_english": en,
                            "course_korean": ko,
                            "display_order": idx,
                        }
                    ).execute()
                    self.stats["senior_courses_inserted"] += 1
            except Exception as e:
                self.stats["errors"].append(f"Senior course insertion error: {e}")

    def migrate_decisions(self, profile_id: str, decisions: Dict):
        """대학 결과 데이터 마이그레이션"""
        decision_types = ["acceptances", "waitlists", "rejections"]
        type_mapping = {
            "acceptances": "acceptance",
            "waitlists": "waitlist",
            "rejections": "rejection",
        }

        for decision_type in decision_types:
            decision_list = decisions.get(decision_type) or []
            if not decision_list:
                continue

            for decision in decision_list:
                try:
                    en, ko = self.extract_localized_text(decision.get("university"))
                    if en:
                        supabase.table("university_decisions").insert(
                            {
                                "profile_id": profile_id,
                                "decision_type": type_mapping[decision_type],
                                "university_english": en,
                                "university_korean": ko,
                                "decision_plan": decision.get("decision_plan", "N/A"),
                            }
                        ).execute()
                        self.stats["decisions_inserted"] += 1
                except Exception as e:
                    self.stats["errors"].append(f"Decision insertion error: {e}")

    async def migrate_all(self, batch_size: int = 50):
        """전체 마이그레이션 실행"""
        mode_text = "🧪 테스트 모드" if self.test_mode else "🚀 전체 마이그레이션"
        print(f"{mode_text}: {self.json_file_path}")
        start_time = datetime.now()

        # JSON 파일 로드
        with open(self.json_file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # 테스트 모드면 제한된 수만 처리
        if self.test_mode:
            data = data[: self.test_limit]
            print(f"🧪 테스트용으로 처음 {len(data)}개 항목만 처리합니다.")

        self.stats["total_profiles"] = len(data)
        print(f"📊 총 {len(data)}개 프로필 처리 시작")

        # 배치 처리
        for i in range(0, len(data), batch_size):
            batch = data[i : i + batch_size]
            batch_start = i + 1
            batch_end = min(i + batch_size, len(data))

            print(f"🔄 배치 {batch_start}-{batch_end} 처리 중...")

            for j, item in enumerate(batch):
                try:
                    profile_id = self.migrate_profile(item)
                    if profile_id:
                        self.stats["successful_profiles"] += 1
                        if self.test_mode:
                            print(f"✅ 프로필 {i + j + 1} 성공: {profile_id}")
                except Exception as e:
                    self.stats["failed_profiles"] += 1
                    print(f"❌ 프로필 {i + j + 1} 실패: {e}")

            # 진행상황 출력
            progress = (batch_end / len(data)) * 100
            print(f"📈 진행률: {progress:.1f}% ({batch_end}/{len(data)})")

        # 최종 결과 출력
        end_time = datetime.now()
        duration = end_time - start_time

        print(f"\n🎉 마이그레이션 완료!")
        print(f"⏱️ 소요 시간: {duration}")
        print(f"📊 결과 통계:")
        print(f"   - 총 프로필: {self.stats['total_profiles']}")
        print(f"   - 성공: {self.stats['successful_profiles']}")
        print(f"   - 실패: {self.stats['failed_profiles']}")

        if self.stats["total_profiles"] > 0:
            success_rate = (
                self.stats["successful_profiles"] / self.stats["total_profiles"] * 100
            )
            print(f"   - 성공률: {success_rate:.1f}%")

        print(f"   - 훅: {self.stats['hooks_inserted']}")
        print(f"   - 과외활동: {self.stats['extracurriculars_inserted']}")
        print(f"   - 수상경력: {self.stats['awards_inserted']}")
        print(f"   - 추천서: {self.stats['lors_inserted']}")
        print(f"   - 고3 과목: {self.stats['senior_courses_inserted']}")
        print(f"   - 대학 결과: {self.stats['decisions_inserted']}")

        if self.stats["errors"]:
            print(f"⚠️ 오류 {len(self.stats['errors'])}건 발생")
            if self.test_mode:
                print("🔍 오류 상세:")
                for i, error in enumerate(self.stats["errors"][:5]):  # 처음 5개만 출력
                    print(f"   {i+1}. {error}")


async def main():
    """메인 실행 함수"""
    json_file = "capplica_application_bilingual_final.json"

    if not os.path.exists(json_file):
        print(f"❌ 파일을 찾을 수 없습니다: {json_file}")
        return

    # 사용자 선택
    print("🚀 Supabase 마이그레이션 도구")
    print("1. 🧪 테스트 모드 (5개 데이터만)")
    print("2. 🚀 전체 마이그레이션")

    while True:
        choice = input("선택하세요 (1 또는 2): ").strip()
        if choice in ["1", "2"]:
            break
        print("❌ 잘못된 선택입니다. 1 또는 2를 입력해주세요.")

    if choice == "1":
        # 테스트 모드
        test_limit = input("테스트할 데이터 개수 (기본값: 5): ").strip()
        test_limit = int(test_limit) if test_limit.isdigit() else 5

        migrator = SupabaseMigrator(json_file, test_mode=True, test_limit=test_limit)
        await migrator.migrate_all(batch_size=test_limit)

        if migrator.stats["successful_profiles"] > 0:
            confirm = input(
                "\n✅ 테스트 성공! 전체 마이그레이션을 진행하시겠습니까? (y/N): "
            )
            if confirm.lower() == "y":
                print("\n🚀 전체 마이그레이션 시작...")
                full_migrator = SupabaseMigrator(json_file, test_mode=False)
                await full_migrator.migrate_all(batch_size=50)

    else:
        # 전체 마이그레이션
        confirm = input("⚠️ 전체 데이터를 마이그레이션합니다. 계속하시겠습니까? (y/N): ")
        if confirm.lower() == "y":
            migrator = SupabaseMigrator(json_file, test_mode=False)
            await migrator.migrate_all(batch_size=50)
        else:
            print("❌ 마이그레이션이 취소되었습니다.")


if __name__ == "__main__":
    asyncio.run(main())
