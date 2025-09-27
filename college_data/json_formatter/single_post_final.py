import os
from typing import List, Literal, Optional

import dspy
import mlflow
import pydantic
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# --- 0. 데이터 정의 ---

# # 영어 대학 이름 리스트
# english_universities = [
#     "Agnes Scott College",
#     "Albion College",
#     "Alfred University",
#     "Allegheny College",
#     "American University",
#     "Amherst College",
#     "Antioch College",
#     "Appalachian State University",
#     "Arizona State University",
#     "Auburn University",
#     "Austin College",
#     "Babson College",
#     "Bard College",
#     "Barnard College",
#     "Bates College",
#     "Baylor University",
#     "Belmont University",
#     "Beloit College",
#     "Bennington College",
#     "Bentley University",
#     "Berea College",
#     "Boston College",
#     "Boston University",
#     "Bowdoin College",
#     "Bradley University",
#     "Brandeis University",
#     "Brown University",
#     "Bryant University",
#     "Bryn Mawr College",
#     "Bucknell University",
#     "Butler University",
#     "California Institute of Technology",
#     "California Polytechnic State University-San Luis Obispo",
#     "California State Polytechnic University-Pomona",
#     "California State University-Fresno",
#     "California State University-Fullerton",
#     "California State University-Long Beach",
#     "California State University-Los Angeles",
#     "Carleton College",
#     "Carnegie Mellon University",
#     "Case Western Reserve University",
#     "Centre College",
#     "Chapman University",
#     "Claremont McKenna College",
#     "Clark University",
#     "Clarkson University",
#     "Clemson University",
#     "Coastal Carolina University",
#     "Colby College",
#     "Colgate University",
#     "College of Charleston",
#     "College of the Holy Cross",
#     "Colorado College",
#     "Colorado School of Mines",
#     "Colorado State University-Fort Collins",
#     "Columbia University in the City of New York",
#     "Connecticut College",
#     "Cornell University",
#     "Creighton University",
#     "CUNY Bernard M Baruch College",
#     "CUNY Hunter College",
#     "Dartmouth College",
#     "Davidson College",
#     "Denison University",
#     "DePaul University",
#     "DePauw University",
#     "Dickinson College",
#     "Drew University",
#     "Drexel University",
#     "Duke University",
#     "Duquesne University",
#     "Earlham College",
#     "East Carolina University",
#     "Eckerd College",
#     "Elon University",
#     "Emory University",
#     "Fairfield University",
#     "Florida Atlantic University",
#     "Florida Gulf Coast University",
#     "Florida Institute of Technology",
#     "Florida International University",
#     "Florida State University",
#     "Fordham University",
#     "Franklin & Marshall College",
#     "Franklin W Olin College of Engineering",
#     "Furman University",
#     "George Mason University",
#     "George Washington University",
#     "Georgetown University",
#     "Georgia College & State University",
#     "Georgia Institute of Technology",
#     "Georgia State University",
#     "Gettysburg College",
#     "Gonzaga University",
#     "Gordon College",
#     "Goucher College",
#     "Grinnell College",
#     "Gustavus Adolphus College",
#     "Hamilton College",
#     "Harvard University",
#     "Harvey Mudd College",
#     "Haverford College",
#     "Hendrix College",
#     "Hobart William Smith Colleges",
#     "Hofstra University",
#     "Howard University",
#     "Illinois Institute of Technology",
#     "Illinois Wesleyan University",
#     "Indiana University-Bloomington",
#     "Indiana University-Indianapolis",
#     "Iowa State University",
#     "Ithaca College",
#     "James Madison University",
#     "Johns Hopkins University",
#     "Juniata College",
#     "Kalamazoo College",
#     "Kansas State University",
#     "Kenyon College",
#     "Lafayette College",
#     "Lake Forest College",
#     "Lawrence University",
#     "Lehigh University",
#     "Lewis & Clark College",
#     "Louisiana State University and Agricultural & Mechanical College",
#     "Loyola Marymount University",
#     "Loyola University Chicago",
#     "Loyola University Maryland",
#     "Loyola University New Orleans",
#     "Macalester College",
#     "Marist College",
#     "Marquette University",
#     "Massachusetts Institute of Technology",
#     "Miami University-Oxford",
#     "Michigan State University",
#     "Michigan Technological University",
#     "Middlebury College",
#     "Milwaukee School of Engineering",
#     "Mississippi State University",
#     "Missouri University of Science and Technology",
#     "Morehouse College",
#     "Mount Holyoke College",
#     "Muhlenberg College",
#     "New College of Florida",
#     "New Jersey Institute of Technology",
#     "New York University",
#     "North Carolina State University at Raleigh",
#     "Northeastern University",
#     "Northern Arizona University",
#     "Northwestern University",
#     "Oberlin College",
#     "Occidental College",
#     "Ohio State University-Main Campus",
#     "Ohio University-Main Campus",
#     "Ohio Wesleyan University",
#     "Oklahoma State University-Main Campus",
#     "Oregon State University",
#     "Pennsylvania State University-Main Campus",
#     "Pepperdine University",
#     "Pitzer College",
#     "Pomona College",
#     "Portland State University",
#     "Princeton University",
#     "Providence College",
#     "Purdue University-Main Campus",
#     "Queens University of Charlotte",
#     "Quinnipiac University",
#     "Ramapo College of New Jersey",
#     "Reed College",
#     "Rensselaer Polytechnic Institute",
#     "Rhodes College",
#     "Rice University",
#     "Rochester Institute of Technology",
#     "Rollins College",
#     "Rose-Hulman Institute of Technology",
#     "Rutgers University-New Brunswick",
#     "Saint Louis University",
#     "Saint Mary's College of California",
#     "San Diego State University",
#     "San Francisco State University",
#     "San Jose State University",
#     "Santa Clara University",
#     "Sarah Lawrence College",
#     "Scripps College",
#     "Seattle University",
#     "Skidmore College",
#     "Smith College",
#     "Soka University of America",
#     "Southern Methodist University",
#     "Southwestern University",
#     "Spelman College",
#     "St. John's College, MD",
#     "St. John's College, NM",
#     "St. Lawrence University",
#     "St. Mary's College of Maryland",
#     "St. Olaf College",
#     "Stanford University",
#     "Stetson University",
#     "Stevens Institute of Technology",
#     "Stonehill College",
#     "SUNY at Purchase College",
#     "SUNY Binghamton University",
#     "SUNY College at Geneseo",
#     "SUNY Oneonta",
#     "SUNY Stony Brook University",
#     "SUNY University at Albany",
#     "SUNY University at Buffalo",
#     "Susquehanna University",
#     "Swarthmore College",
#     "Syracuse University",
#     "Temple University",
#     "Texas A & M University-College Station",
#     "Texas Christian University",
#     "Texas Tech University",
#     "The College of New Jersey",
#     "The College of Wooster",
#     "The University of Tennessee-Knoxville",
#     "The University of Texas at Austin",
#     "The University of Texas at Dallas",
#     "Trinity College",
#     "Trinity University",
#     "Truman State University",
#     "Tufts University",
#     "Tulane University of Louisiana",
#     "Union College",
#     "University of Alabama",
#     "University of Alabama at Birmingham",
#     "University of Arizona",
#     "University of Arkansas",
#     "University of California-Berkeley",
#     "University of California-Davis",
#     "University of California-Irvine",
#     "University of California-Los Angeles",
#     "University of California-Merced",
#     "University of California-Riverside",
#     "University of California-San Diego",
#     "University of California-Santa Barbara",
#     "University of California-Santa Cruz",
#     "University of Central Florida",
#     "University of Chicago",
#     "University of Cincinnati-Main Campus",
#     "University of Colorado Boulder",
#     "University of Connecticut",
#     "University of Dayton",
#     "University of Delaware",
#     "University of Denver",
#     "University of Florida",
#     "University of Georgia",
#     "University of Houston",
#     "University of Illinois Chicago",
#     "University of Illinois Urbana-Champaign",
#     "University of Iowa",
#     "University of Kansas",
#     "University of Kentucky",
#     "University of Louisville",
#     "University of Maine",
#     "University of Mary Washington",
#     "University of Maryland-Baltimore County",
#     "University of Maryland-College Park",
#     "University of Massachusetts-Amherst",
#     "University of Massachusetts-Boston",
#     "University of Miami",
#     "University of Michigan-Ann Arbor",
#     "University of Minnesota-Twin Cities",
#     "University of Mississippi",
#     "University of Missouri-Columbia",
#     "University of Nebraska-Lincoln",
#     "University of Nevada-Las Vegas",
#     "University of Nevada-Reno",
#     "University of New Hampshire-Main Campus",
#     "University of New Mexico-Main Campus",
#     "University of North Carolina Asheville",
#     "University of North Carolina at Chapel Hill",
#     "University of North Carolina at Charlotte",
#     "University of North Carolina Wilmington",
#     "University of Notre Dame",
#     "University of Oklahoma-Norman Campus",
#     "University of Oregon",
#     "University of Pennsylvania",
#     "University of Pittsburgh-Pittsburgh Campus",
#     "University of Portland",
#     "University of Puget Sound",
#     "University of Redlands",
#     "University of Rhode Island",
#     "University of Richmond",
#     "University of Rochester",
#     "University of San Diego",
#     "University of San Francisco",
#     "University of South Carolina-Columbia",
#     "University of South Florida",
#     "University of Southern California",
#     "University of Utah",
#     "University of Vermont",
#     "University of Virginia-Main Campus",
#     "University of Washington-Seattle Campus",
#     "University of Wisconsin-Madison",
#     "Ursinus College",
#     "Vanderbilt University",
#     "Vassar College",
#     "Villanova University",
#     "Virginia Commonwealth University",
#     "Virginia Polytechnic Institute and State University",
#     "Wake Forest University",
#     "Washington & Lee University",
#     "Wellesley College",
#     "Wesleyan University",
#     "Wheaton College, IL",
#     "Wheaton College, MA",
#     "Whitman College",
#     "Willamette University",
#     "William & Mary",
#     "Williams College",
#     "Worcester Polytechnic Institute",
#     "Yale University",
#     "Yeshiva University",
# ]

# # 한국어 대학 이름 리스트
# korean_universities = [
#     "아그네스 스콧 칼리지",
#     "앨비언 칼리지",
#     "앨프레드 대학교",
#     "앨러게니 칼리지",
#     "아메리칸 대학교",
#     "애머스트 칼리지",
#     "앤티오크 칼리지",
#     "애팔래치안 주립대학교",
#     "애리조나 주립대학교",
#     "오번 대학교",
#     "오스틴 칼리지",
#     "밥슨 칼리지",
#     "바드 칼리지",
#     "바너드 칼리지",
#     "베이츠 칼리지",
#     "베일러 대학교",
#     "벨몬트 대학교",
#     "벨로잇 칼리지",
#     "베닝턴 칼리지",
#     "벤틀리 대학교",
#     "베리아 칼리지",
#     "보스턴 칼리지",
#     "보스턴 대학교",
#     "보든 칼리지",
#     "브래들리 대학교",
#     "브랜다이스 대학교",
#     "브라운 대학교",
#     "브라이언트 대학교",
#     "브린마 칼리지",
#     "버크넬 대학교",
#     "버틀러 대학교",
#     "캘리포니아 공과대학교 (칼텍)",
#     "캘리포니아 폴리테크닉 주립대학교-샌루이스오비스포 (칼 폴리)",
#     "캘리포니아 주립 폴리테크닉 대학교-포모나",
#     "캘리포니아 주립대학교-프레즈노",
#     "캘리포니아 주립대학교-풀러턴",
#     "캘리포니아 주립대학교-롱비치",
#     "캘리포니아 주립대학교-로스앤젤레스",
#     "칼턴 칼리지",
#     "카네기 멜런 대학교",
#     "케이스 웨스턴 리저브 대학교",
#     "센터 칼리지",
#     "채프먼 대학교",
#     "클레어몬트 맥케나 칼리지",
#     "클라크 대학교",
#     "클락슨 대학교",
#     "클렘슨 대학교",
#     "코스털 캐롤라이나 대학교",
#     "콜비 칼리지",
#     "콜게이트 대학교",
#     "칼리지 오브 찰스턴",
#     "칼리지 오브 더 홀리 크로스",
#     "콜로라도 칼리지",
#     "콜로라도 광산대학교",
#     "콜로라도 주립대학교-포트콜린스",
#     "컬럼비아 대학교",
#     "코네티컷 칼리지",
#     "코넬 대학교",
#     "크레이튼 대학교",
#     "뉴욕 시립대학교 버룩 칼리지",
#     "뉴욕 시립대학교 헌터 칼리지",
#     "다트머스 칼리지",
#     "데이비드슨 칼리지",
#     "데니슨 대학교",
#     "드폴 대학교",
#     "드포 대학교",
#     "디킨슨 칼리지",
#     "드루 대학교",
#     "드렉셀 대학교",
#     "듀크 대학교",
#     "듀케인 대학교",
#     "얼햄 칼리지",
#     "이스트 캐롤라이나 대학교",
#     "에커드 칼리지",
#     "일론 대학교",
#     "에모리 대학교",
#     "페어필드 대학교",
#     "플로리다 애틀랜틱 대학교",
#     "플로리다 걸프 코스트 대학교",
#     "플로리다 공과대학교",
#     "플로리다 국제대학교",
#     "플로리다 주립대학교",
#     "포덤 대학교",
#     "프랭클린 앤드 마셜 칼리지",
#     "프랭클린 W. 올린 공과대학교",
#     "퍼먼 대학교",
#     "조지 메이슨 대학교",
#     "조지 워싱턴 대학교",
#     "조지타운 대학교",
#     "조지아 칼리지 앤드 주립대학교",
#     "조지아 공과대학교 (조지아텍)",
#     "조지아 주립대학교",
#     "게티즈버그 칼리지",
#     "곤자가 대학교",
#     "고든 칼리지",
#     "가우처 칼리지",
#     "그리넬 칼리지",
#     "구스타부스 아돌퍼스 칼리지",
#     "해밀턴 칼리지",
#     "하버드 대학교",
#     "하비 머드 칼리지",
#     "해버퍼드 칼리지",
#     "헨드릭스 칼리지",
#     "호바트 앤드 윌리엄 스미스 칼리지",
#     "호프스트라 대학교",
#     "하워드 대학교",
#     "일리노이 공과대학교",
#     "일리노이 웨슬리언 대학교",
#     "인디애나 대학교-블루밍턴",
#     "인디애나 대학교-인디애나폴리스",
#     "아이오와 주립대학교",
#     "이타카 칼리지",
#     "제임스 매디슨 대학교",
#     "존스 홉킨스 대학교",
#     "주니아타 칼리지",
#     "캘러머주 칼리지",
#     "캔자스 주립대학교",
#     "케니언 칼리지",
#     "라파예트 칼리지",
#     "레이크 포레스트 칼리지",
#     "로렌스 대학교",
#     "리하이 대학교",
#     "루이스 앤드 클라크 칼리지",
#     "루이지애나 주립대학교",
#     "로욜라 메리마운트 대학교",
#     "로욜라 대학교 시카고",
#     "로욜라 대학교 메릴랜드",
#     "로욜라 대학교 뉴올리언스",
#     "매칼리스터 칼리지",
#     "마리스트 칼리지",
#     "마켓 대학교",
#     "매사추세츠 공과대학교 (MIT)",
#     "마이애미 대학교-옥스퍼드",
#     "미시간 주립대학교",
#     "미시간 공과대학교",
#     "미들버리 칼리지",
#     "밀워키 공과대학교",
#     "미시시피 주립대학교",
#     "미주리 과학기술대학교",
#     "모어하우스 칼리지",
#     "마운트 홀리요크 칼리지",
#     "뮬런버그 칼리지",
#     "뉴 칼리지 오브 플로리다",
#     "뉴저지 공과대학교",
#     "뉴욕 대학교 (NYU)",
#     "노스캐롤라이나 주립대학교-롤리",
#     "노스이스턴 대학교",
#     "노던 애리조나 대학교",
#     "노스웨스턴 대학교",
#     "오벌린 칼리지",
#     "옥시덴탈 칼리지",
#     "오하이오 주립대학교-메인 캠퍼스",
#     "오하이오 대학교-메인 캠퍼스",
#     "오하이오 웨슬리언 대학교",
#     "오클라호마 주립대학교-메인 캠퍼스",
#     "오리건 주립대학교",
#     "펜실베이니아 주립대학교-메인 캠퍼스 (펜스테이트)",
#     "페퍼다인 대학교",
#     "피처 칼리지",
#     "포모나 칼리지",
#     "포틀랜드 주립대학교",
#     "프린스턴 대학교",
#     "프로비던스 칼리지",
#     "퍼듀 대학교-메인 캠퍼스",
#     "퀸스 대학교 샬럿",
#     "퀴니피악 대학교",
#     "라마포 칼리지 오브 뉴저지",
#     "리드 칼리지",
#     "렌슬리어 폴리테크닉 인스티튜트 (RPI)",
#     "로즈 칼리지",
#     "라이스 대학교",
#     "로체스터 공과대학교 (RIT)",
#     "롤린스 칼리지",
#     "로즈-헐먼 공과대학교",
#     "럿거스 대학교-뉴브런즈윅",
#     "세인트루이스 대학교",
#     "세인트 메리스 칼리지 오브 캘리포니아",
#     "샌디에이고 주립대학교",
#     "샌프란시스코 주립대학교",
#     "산호세 주립대학교",
#     "샌타클래라 대학교",
#     "세라 로렌스 칼리지",
#     "스크립스 칼리지",
#     "시애틀 대학교",
#     "스키드모어 칼리지",
#     "스미스 칼리지",
#     "소카 대학교 오브 아메리카",
#     "서던 메소디스트 대학교",
#     "사우스웨스턴 대학교",
#     "스펠만 칼리지",
#     "세인트 존스 칼리지 (메릴랜드)",
#     "세인트 존스 칼리지 (뉴멕시코)",
#     "세인트 로렌스 대학교",
#     "세인트 메리스 칼리지 오브 메릴랜드",
#     "세인트 올라프 칼리지",
#     "스탠퍼드 대학교",
#     "스텟슨 대학교",
#     "스티븐스 공과대학교",
#     "스톤힐 칼리지",
#     "뉴욕 주립대학교-퍼처스",
#     "뉴욕 주립대학교-빙엄턴 (빙엄턴 대학교)",
#     "뉴욕 주립대학교-제네시오",
#     "뉴욕 주립대학교-오니온타",
#     "뉴욕 주립대학교-스토니브룩 (스토니브룩 대학교)",
#     "뉴욕 주립대학교-올버니",
#     "뉴욕 주립대학교-버펄로",
#     "서스쿼해나 대학교",
#     "스와스모어 칼리지",
#     "시러큐스 대학교",
#     "템플 대학교",
#     "텍사스 A&M 대학교-칼리지 스테이션",
#     "텍사스 크리스천 대학교",
#     "텍사스 공과대학교",
#     "더 칼리지 오브 뉴저지",
#     "우스터 칼리지",
#     "테네시 대학교-녹스빌",
#     "텍사스 대학교-오스틴",
#     "텍사스 대학교-댈러스",
#     "트리니티 칼리지",
#     "트리니티 대학교",
#     "트루먼 주립대학교",
#     "터프츠 대학교",
#     "튤레인 대학교",
#     "유니언 칼리지",
#     "앨라배마 대학교",
#     "앨라배마 대학교-버밍엄",
#     "애리조나 대학교",
#     "아칸소 대학교",
#     "캘리포니아 대학교-버클리 (UC 버클리)",
#     "캘리포니아 대학교-데이비스 (UC 데이비스)",
#     "캘리포니아 대학교-어바인 (UC 어바인)",
#     "캘리포니아 대학교-로스앤젤레스 (UCLA)",
#     "캘리포니아 대학교-머세드 (UC 머세드)",
#     "캘리포니아 대학교-리버사이드 (UC 리버사이드)",
#     "캘리포니아 대학교-샌디에이고 (UC 샌디에이고)",
#     "캘리포니아 대학교-샌타바버라 (UC 샌타바버라)",
#     "캘리포니아 대학교-샌타크루즈 (UC 샌타크루즈)",
#     "센트럴 플로리다 대학교",
#     "시카고 대학교",
#     "신시내티 대학교-메인 캠퍼스",
#     "콜로라도 대학교-볼더",
#     "코네티컷 대학교",
#     "데이턴 대학교",
#     "델라웨어 대학교",
#     "덴버 대학교",
#     "플로리다 대학교",
#     "조지아 대학교",
#     "휴스턴 대학교",
#     "일리노이 대학교-시카고",
#     "일리노이 대학교-어배너-섐페인 (UIUC)",
#     "아이오와 대학교",
#     "캔자스 대학교",
#     "켄터키 대학교",
#     "루이빌 대학교",
#     "메인 대학교",
#     "메리 워싱턴 대학교",
#     "메릴랜드 대학교-볼티모어 카운티 (UMBC)",
#     "메릴랜드 대학교-칼리지 파크",
#     "매사추세츠 대학교-애머스트 (유매스 애머스트)",
#     "매사추세츠 대학교-보스턴",
#     "마이애미 대학교",
#     "미시간 대학교-앤아버",
#     "미네소타 대학교-트윈 시티",
#     "미시시피 대학교",
#     "미주리 대학교-컬럼비아",
#     "네브래스카 대학교-링컨",
#     "네바다 대학교-라스베이거스",
#     "네바다 대학교-리노",
#     "뉴햄프셔 대학교-메인 캠퍼스",
#     "뉴멕시코 대학교-메인 캠퍼스",
#     "노스캐롤라이나 대학교-애슈빌",
#     "노스캐롤라이나 대학교-채플힐 (UNC)",
#     "노스캐롤라이나 대학교-샬럿",
#     "노스캐롤라이나 대학교-윌밍턴",
#     "노터데임 대학교",
#     "오클라호마 대학교-노먼 캠퍼스",
#     "오리건 대학교",
#     "펜실베이니아 대학교 (유펜)",
#     "피츠버그 대학교-피츠버그 캠퍼스",
#     "포틀랜드 대학교",
#     "퓨젯 사운드 대학교",
#     "레드랜즈 대학교",
#     "로드아일랜드 대학교",
#     "리치먼드 대학교",
#     "로체스터 대학교",
#     "샌디에이고 대학교",
#     "샌프란시스코 대학교",
#     "사우스캐롤라이나 대학교-컬럼비아",
#     "사우스 플로리다 대학교",
#     "서던 캘리포니아 대학교 (USC)",
#     "유타 대학교",
#     "버몬트 대학교",
#     "버지니아 대학교-메인 캠퍼스",
#     "워싱턴 대학교-시애틀 캠퍼스",
#     "위스콘신 대학교-매디슨",
#     "어사이너스 칼리지",
#     "밴더빌트 대학교",
#     "바서 칼리지",
#     "빌라노바 대학교",
#     "버지니아 커먼웰스 대학교",
#     "버지니아 공과대학교 (버지니아 텍)",
#     "웨이크 포레스트 대학교",
#     "워싱턴 앤드 리 대학교",
#     "웰즐리 칼리지",
#     "웨슬리언 대학교",
#     "휘튼 칼리지 (일리노이)",
#     "휘튼 칼리지 (매사추세츠)",
#     "휘트먼 칼리지",
#     "윌라멧 대학교",
#     "윌리엄 앤드 메리 대학교",
#     "윌리엄스 칼리지",
#     "우스터 폴리테크닉 인스티튜트 (WPI)",
#     "예일 대학교",
#     "예시바 대학교",
# ]

# 영어-한국어 매핑 딕셔너리 생성
eng_to_kor_map = dict(zip(english_universities, korean_universities))


# MLflow 설정
mlflow.set_tracking_uri("file:./mlruns")
mlflow.set_experiment("post_to_json_v2_bilingual")  # 새 버전으로 실험 이름 변경
mlflow.dspy.autolog()

# --- 1. Pydantic으로 Bilingual JSON 구조(스키마) 정의 ---


class LocalizedText(pydantic.BaseModel):
    """Represents a piece of text in both English and Korean."""

    english: Optional[str] = None
    korean: Optional[str] = None


class Demographics(pydantic.BaseModel):
    gender: Optional[str] = None
    race_ethnicity: Optional[LocalizedText] = None
    residence: Optional[LocalizedText] = None
    income_bracket: Optional[str] = None
    type_of_school: Optional[LocalizedText] = None
    hooks: Optional[List[LocalizedText]] = None
    intended_majors: Optional[LocalizedText] = None


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
    senior_year_course_load: Optional[List[LocalizedText]] = None


class SAT(pydantic.BaseModel):
    total: Optional[int] = None
    reading_writing: Optional[int] = None
    math: Optional[int] = None


class StandardizedTesting(pydantic.BaseModel):
    sat_i: Optional[SAT] = None
    act: Optional[int] = None


class LOR(pydantic.BaseModel):
    recommender: Optional[LocalizedText] = None
    estimated_rating: Optional[float] = None


class Essay(pydantic.BaseModel):
    common_app: Optional[LocalizedText] = None
    supplementals: Optional[LocalizedText] = None


class Decision(pydantic.BaseModel):
    university: LocalizedText
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
    extracurriculars: Optional[List[LocalizedText]] = None
    awards_honors: Optional[List[LocalizedText]] = None
    letters_of_recommendation: Optional[List[LOR]] = None

    essays: Optional[Essay] = None
    decisions: Optional[Decisions] = None
    additional_information: Optional[LocalizedText] = None

    class Config:
        json_schema_extra = {
            "description": "A structured representation of a student's college application profile."
        }


# --- 2. dspy 시그니처 정의 ---


class ExtractProfile(dspy.Signature):
    """
    You are an expert in parsing and structuring student college application data.
    Extract detailed information from the student's post into the given JSON schema.

    Key Instructions:
    1.  **LocalizedText Fields - Translation Rules**:
        - **English-only fields** (set korean: null): race_ethnicity, residence, type_of_school, university
        - **Translate to Korean**: hooks, intended_majors, senior_year_course_load, recommender, common_app, supplementals
        - For English-only fields: {"english": "extracted_text", "korean": null}
        - For translated fields: {"english": "extracted_text", "korean": "korean_translation"}

    2.  **Non-LocalizedText Fields**: gender, income_bracket remain as simple strings/values (not LocalizedText objects)

    3.  **Decision Plan**: For the 'decision_plan' field, classify based on when the final decision was made, not the initial application type. If a student was deferred or waitlisted and then later accepted, the plan should reflect the timing of that final acceptance (e.g., 'RD'). If there's no mention of the application type, use 'N/A'.

    4.  **Completeness**: Fill in all possible fields. If information for a field is not available, leave it as null.
    """

    post_text: str = dspy.InputField(desc="The full text of the student's post.")
    structured_profile: StudentProfile = dspy.OutputField(
        desc="The structured student profile in JSON format."
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

# dspy.configure(lm=dspy.OpenAI(model='gpt-4-turbo-preview', max_tokens=4096))
dspy.configure(
    lm=dspy.LM(
        "gemini/gemini-2.5-flash",
        temperature=0,
        max_tokens=8000,
        api_key=GEMINI_API_KEY,
    )
)

# 정보 추출기 모듈 생성
extractor = dspy.Predict(ExtractProfile)

# 입력 텍스트
post_text = """
Neuroscience Major 🎓\\n\\nDemographics\\n\\nAsian\\nFemale\\n0-50k\\nPublic School\\nAcademics\\n\\n29 ACT\\n12 AP's\\n3.76 UW\\n4.11 W\\nExtracurriculars\\n\\n1. iyna summer program dual enrollment\\n\\n2. wrote a grant proposal\\n\\n3. own research: systematic review\\n\\n4. period poverty initiative co-founder/director of outreach\\n\\n5. national beta chapter president\\n\\n6. unicef chapter president\\n\\n7. volunteering at a suicide prevention hotline\\n\\n8. volunteer at a hospice\\n\\n9. ylc at make-a-wish\\n\\n10. marketing internship\\n\\n11. badminton classes\\n\\nAwards\\n\\n1. DECA: 2nd in region\\n\\n2. 10th in state\\n\\n3. TEDx Speaker\\n\\n4. AP Scholar with Honors\\n\\n5. academic awards by school\\n\\n6. certifications\\n\\nAcceptances\\n\\n1. Augusta\\n\\n2. Mercer\\n\\n3. Wayne State\\n\\n4. Dominican University\\n\\n5. USFCA\\n\\n6. GSU Honors\\n\\n7. Stony Brook\\n\\n8. Rutgers\\n\\n9. OXFORD COLLEGE @ EMORY ED1
"""

# 대학 리스트는 후처리에서 사용 (프롬프트에서 제거)

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

    # 모듈 실행 (대학 리스트 없이)
    result = extractor(post_text=post_text)
    print("🤖 AI 처리 완료")

    # 결과 로깅 (후처리 없이 직접 사용)
    output_json = result.structured_profile.model_dump_json(indent=2)
    mlflow.log_text(output_json, "structured_profile.json")
    mlflow.log_metric("output_length", len(output_json))
    print("✅ MLflow 로깅 완료")

print("📂 mlruns 폴더 확인:")
# os.system("ls -la mlruns/") # 주석 처리 또는 필요 시 활성화

# Pydantic 모델을 JSON 형식으로 최종 출력
print("\n--- 최종 결과 (JSON) - 후처리 없음 ---")
print(output_json)
