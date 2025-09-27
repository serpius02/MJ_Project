"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This type is used to define the shape of our data.
// 입학 사정 요소의 중요도를 나타내는 타입
type ImportanceLevel =
  | "Very Important"
  | "Important"
  | "Considered"
  | "Not Considered";

export type CDSData = {
  // --- 0. 기본 정보 ---
  logo: string;
  motto: string;
  website: string;
  newsUrl: string;
  twitterUrl: string;

  // --- 1. 기본 정보 ---
  institutionName: string; // 원본: INSTNM
  unitId: number; // 원본: UNITID
  control: "Public" | "Private" | "Proprietary"; // 원본: A2-Source of Institutional Control...
  logoUrl?: string; // 대학교 로고 이미지 URL

  // --- 2. 신입생 등록 현황 (성별) ---
  ugFFMen: number; // 원본: B1-Undergraduate Students... Men
  ugFFWomen: number; // 원본: B1-Undergraduate Students... Women
  ugFFAnotherGender: number; // 원본: B1-Undergraduate Students... Another Gender
  ugFFTotal: number; // 원본: B1-Undergraduate Students... Total
  gradFFMen: number; // 원본: B1-Graduate Students... Men
  gradFFWomen: number; // 원본: B1-Graduate Students... Women
  gradFFAnotherGender: number; // 원본: B1-Graduate Students... Another Gender
  gradFFTotal: number; // 원본: B1-Graduate Students... Total

  // --- 3. 신입생 인종/민족 구성 ---
  enrollFFNonresident: number; // 원본: B2-Enrollment... Nonresidents
  enrollFFHispanicLatino: number; // 원본: B2-Enrollment... Hispanic/Latino
  enrollFFBlack: number; // 원본: B2-Enrollment... Black or African American
  enrollFFWhite: number; // 원본: B2-Enrollment... White
  enrollFFAmericanIndian: number; // 원본: B2-Enrollment... American Indian or Alaska Native
  enrollFFAsian: number; // 원본: B2-Enrollment... Asian
  enrollFFHawaiianPacific: number; // 원본: B2-Enrollment... Native Hawaiian or other Pacific Islander
  enrollFFTwoOrMoreRaces: number; // 원본: B2-Enrollment... Two or more races
  enrollFFRaceUnknown: number; // 원본: B2-Enrollment... Race and/or ethnicity unknown
  enrollFFRaceTotal: number; // 원본: B2-Enrollment... Total
  ugFFInternational: number; // 원본: B2-Degree-seeking international undergraduates

  // --- 4. 학위 수여 및 유지율 ---
  degreesBachelors: number; // 원본: B3-Degrees Conferred (bachelor's)
  degreesMasters: number; // 원본: B3-Degrees Conferred (master's)
  degreesDoctoral: number; // 원본: B3-Degrees Conferred (doctoral's-research/scholarship)
  retentionRate: number; // 원본: B22-Retention Rates...

  // --- 5. 신입생 입학 통계 (지원/합격/등록) ---
  // First-time, first-year student applicants (degree-seeking)
  ffMenAppliedTotal: number; // 원본: C1-Total first-time, first-year men who applied
  ffWomenAppliedTotal: number; // 원본: C1-Total first-time, first-year women who applied
  ffAnotherGenderAppliedTotal: number; // 원본: C1-Total first-time, first-year another gender/no response who applied
  ffAppliedTotal: number; // 원본: C1-Total first-time, first-year who applied total

  // First-time, first-year student admits (degree-seeking)
  ffMenAdmittedTotal: number; // 원본: C1-Total first-time, first-year men who were admitted
  ffWomenAdmittedTotal: number; // 원본: C1-Total first-time, first-year women who were admitted
  ffAnotherGenderAdmittedTotal: number; // 원본: C1-Total first-time, first-year another gender/no response who were admitted
  ffAdmittedTotal: number; // 원본: C1-Total first-time, first-year who were admitted total

  // First-time, first-year student enrollees (degree-seeking)
  ffMenEnrolledTotal: number; // 원본: C1-Total first-time, first-year men who enrolled
  ffWomenEnrolledTotal: number; // 원본: C1-Total first-time, first-year women who enrolled
  ffAnotherGenderEnrolledTotal: number; // 원본: C1-Total first-time, first-year another gender/no response who enrolled
  ffEnrolledTotal: number; // 원본: C1-Total first-time, first-year who enrolled total

  acceptanceRate: number; // 원본: C1-Acceptance Rate for First-Year Students (degree-seeking)

  ffInstateAppliedTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who applied In-state
  ffOutofStateAppliedTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who applied Out-of-state
  ffInternationalAppliedTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who applied International
  ffUnknownAppliedTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who applied Unknown

  ffInstateAdmittedTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who were admitted In-state
  ffOutofStateAdmittedTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who were admitted Out-of-state
  ffInternationalAdmittedTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who were admitted International
  ffUnknownAdmittedTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who were admitted Unknown

  ffInstateEnrolledTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who enrolled In-state
  ffOutofStateEnrolledTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who enrolled Out-of-state
  ffInternationalEnrolledTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who enrolled International
  ffUnknownEnrolledTotal: number; // 원본: C1-Total first-time, first-year, degree-seeking who enrolled Unknown

  // --- 6. 대기자 명단 정책 ---
  waitlistPolicy: boolean; // 원본: C2-Do you have a policy of placing students on a waiting list?
  waitlistOffered: number; // 원본: C2-Number of qualified applicants offered a place on waiting list
  waitlistAccepted: number; // 원본: C2-Number of accepting a place on the waiting list
  waitlistAdmitted: number; // 원본: C2-Number of wait-listed students admitted

  // --- 7. 입학 사정 요소 중요도 ---
  criteriaRigor: ImportanceLevel; // 원본: C7-Rigor of secondary school
  criteriaRank: ImportanceLevel; // 원본: C7-Class rank
  criteriaGpa: ImportanceLevel; // 원본: C7-Academic GPA
  criteriaTestScores: ImportanceLevel; // 원본: C7-Standardized test scores
  criteriaEssay: ImportanceLevel; // 원본: C7-Application essay
  criteriaRecommendations: ImportanceLevel; // 원본: C7-Recommendations
  criteriaInterview: ImportanceLevel; // 원본: C7-Interview
  criteriaExtracurricular: ImportanceLevel; // 원본: C7-Extracurricular activities
  criteriaTalent: ImportanceLevel; // 원본: C7-Talent/ability
  criteriaCharacter: ImportanceLevel; // 원본: C7-Character/personal qualities
  criteriaFirstGeneration: ImportanceLevel; // 원본: C7-First-generation college student
  criteriaAthletic: ImportanceLevel; // 원본: C7-Athletic ability
  criteriaGeographicalResidence: ImportanceLevel; // 원본: C7-Geographical residence
  criteriaStateResidence: ImportanceLevel; // 원본: C7-State residency
  criteriaReligion: ImportanceLevel; // 원본: C7-Religious affiliation
  criteriaVolunteer: ImportanceLevel; // 원본: C7-Volunteer work
  criteriaWorkExperience: ImportanceLevel; // 원본: C7-Work experience
  criteriaInterest: ImportanceLevel; // 원본: C7-Level of applicant's interest

  // --- 8. 입시 주요 일정 ---
  satActDeadline: string; // 원본: C8-E. latest date by which SAT or ACT scores must be received for fall-term submission
  applicationDeadline: string; // 원본: C14-Application closing date application closing date (fall)
  applicationDeadlinePriority: string; // 원본: C14-Application closing date priority date
  isRollingAdmission: boolean; // 원본: C16-Admissions notifications to applicants (rolling basis?)
  rollingNotificationDate: string; // 원본: C16-Admissions notifications to applicants (rolling notifications begin)
  rollingNotificationDeadline: string; // 원본: C16-Admissions notifications to applicants (deadline of admission notification)

  // --- 9. 수시 전형 (얼리 디시전/액션) ---
  hasEarlyDecision: boolean; // 원본: C21-Early decision
  fEdDeadline: number; // 원본: C21-Early decision first or only early decision plan closing date
  fEdNotificationDate: string; // 원본: C21-Early decision first or only early decision plan notification date
  oEdDeadline: number; // 원본: C21-Early decision other early decision plan closing date
  oEdNotificationDate: string; // 원본: C21-Early decision other early decision plan notification date
  numberOfEdApplications: number; // 원본: C21-Early decision number of early decision applications received by your institution
  numberOfEdAdmissions: number; // 원본: C21-Early decision number of applicants admitted under early decision plan
  numberOfEdEnrollments: number; // 원본: C21-Early decision number of early decision applicants enrolled

  hasEarlyAction: boolean; // 원본: C22-Early action
  ea1Deadline: number; // 원본: C22-Early action 1 early action closing date
  ea1NotificationDate: string; // 원본: C22-Early action 1 early action notification date
  ea2Deadline: number; // 원본: C22-Early action 2 early action closing date
  ea2NotificationDate: string; // 원본: C22-Early action 2 early action notification date
  isEaRestrictive: boolean; // 원본: C22-Early action restrictive?
  numberOfEaApplications: number; // 원본: C22-Early action number of early action applications received by your institution
  numberOfEaAdmissions: number; // 원본: C22-Early action number of applicants admitted under early action plan
  numberOfEaEnrollments: number; // 원본: C22-Early action number of early action applicants enrolled

  // --- 10. 학비 및 재정 지원 (유학생 기준) ---
  tuitionNonResident: number; // 원본: G1-Tuitions (non-resident)
  requiredFees: number; // 원본: G1-Required Fees
  roomAndBoard: number; // 원본: G1-Room and board
  totalCost: number; // 원본: G1-Total cost of attendance without aid (tuitionNonResident + requiredFees + roomAndBoard)

  aidForNonresidents: boolean; // 원본: H6-Aid to undergraduate degree-Seeking nonresidents
  aidInternationalCount: number; // 원본: Number of undergraduate degree-seeking international students awarded financial aid/scholarships
  aidInternationalPercent: number; // 원본: Percentage of international students who received aid
  aidAverageAmountNonresident: number; // 원본: Average dollar amount awarded to undergraduate degree-seeking nonresidents
  aidTotalAmountNonresident: number; // 원본: Total dollar amount awarded to undergraduate degree-seeking nonresidents
};

const items = [
  {
    title: "morehorizontal",
    iconLight: "/icons/MoreHorizontal/light.svg",
    iconDark: "/icons/MoreHorizontal/dark.svg",
    iconLightHighlight: "/icons/MoreHorizontal/light_highlight.svg",
    iconDarkHighlight: "/icons/MoreHorizontal/dark_highlight.svg",
    iconOffset: "-translate-y-0.5",
  },
] as const;

// 대학교 정보 테이블 컬럼 정의 (improved styling)
export const columns: ColumnDef<CDSData>[] = [
  {
    accessorKey: "institutionName",
    header: () => (
      <div
        className="text-left font-semibold ml-2"
        style={{ color: "var(--text-primary-light)" }}
      >
        대학교
      </div>
    ),
    cell: ({ row }) => {
      const university = row.original;
      const initials = university.institutionName
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return (
        <div className="flex items-center space-x-4 py-2">
          <Avatar className="h-11 w-11 ring-2 ring-gray-100 dark:ring-gray-700 shadow-sm">
            {university.logoUrl && (
              <AvatarImage
                src={university.logoUrl}
                alt={`${university.institutionName} logo`}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 min-w-0 flex-1">
            <span
              className="font-semibold text-sm leading-tight truncate"
              style={{ color: "var(--text-primary-light)" }}
            >
              {university.institutionName}
            </span>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  university.control === "Public" ? "default" : "secondary"
                }
                className="text-xs px-2 py-0.5 font-medium"
              >
                {university.control}
              </Badge>
              <span
                className="text-xs font-mono"
                style={{ color: "var(--text-secondary-light)" }}
              >
                #{university.unitId}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "acceptanceRate",
    header: () => (
      <div
        className="text-center font-semibold"
        style={{ color: "var(--text-primary-light)" }}
      >
        입학률
      </div>
    ),
    cell: ({ row }) => {
      const rate = row.original.acceptanceRate;
      const getColor = (rate: number) => {
        if (rate < 20)
          return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
        if (rate < 40)
          return "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800";
        if (rate < 60)
          return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
      };

      return (
        <div className="text-center">
          <div
            className={`inline-flex items-center px-3 py-1.5 rounded-full font-semibold text-sm border ${getColor(rate)}`}
          >
            {rate.toFixed(1)}%
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "retentionRate",
    header: () => (
      <div
        className="text-center font-semibold"
        style={{ color: "var(--text-primary-light)" }}
      >
        재학률
      </div>
    ),
    cell: ({ row }) => {
      const rate = row.original.retentionRate;
      return (
        <div className="text-center">
          <div
            className="font-medium text-lg"
            style={{ color: "var(--text-primary-light)" }}
          >
            {rate.toFixed(1)}
          </div>
          <div
            className="text-xs"
            style={{ color: "var(--text-secondary-light)" }}
          >
            %
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalCost",
    header: () => (
      <div
        className="text-center font-semibold"
        style={{ color: "var(--text-primary-light)" }}
      >
        연간 비용
      </div>
    ),
    cell: ({ row }) => {
      const cost = row.original.totalCost;
      return (
        <div className="text-center">
          <div
            className="font-medium text-lg"
            style={{ color: "var(--text-primary-light)" }}
          >
            {cost.toLocaleString()}
          </div>
          <div
            className="text-xs"
            style={{ color: "var(--text-secondary-light)" }}
          >
            USD
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "ugFFTotal",
    header: () => (
      <div
        className="text-center font-semibold"
        style={{ color: "var(--text-primary-light)" }}
      >
        학부생 수
      </div>
    ),
    cell: ({ row }) => {
      const students = row.original.ugFFTotal;
      return (
        <div className="text-center">
          <div
            className="font-medium text-lg"
            style={{ color: "var(--text-primary-light)" }}
          >
            {students.toLocaleString()}
          </div>
          <div
            className="text-xs"
            style={{ color: "var(--text-secondary-light)" }}
          >
            명
          </div>
        </div>
      );
    },
  },
  {
    id: "ranking",
    header: () => (
      <div
        className="text-center font-semibold"
        style={{ color: "var(--text-primary-light)" }}
      >
        종합 점수
      </div>
    ),
    cell: ({ row }) => {
      // 종합 점수 계산 (예시)
      const university = row.original;
      const score = (
        (100 - university.acceptanceRate) * 0.3 +
        university.retentionRate * 0.4 +
        (university.ugFFTotal / 1000) * 0.2 +
        Math.min(university.totalCost / 1000, 50) * 0.1
      ).toFixed(1);

      const scoreNum = parseFloat(score);
      const getScoreColor = (score: number) => {
        if (score >= 85)
          return "text-green-700 bg-green-100 dark:bg-green-900/30";
        if (score >= 70) return "text-blue-700 bg-blue-100 dark:bg-blue-900/30";
        if (score >= 55)
          return "text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30";
        return "text-gray-700 bg-gray-100 dark:bg-gray-900/30";
      };

      return (
        <div className="text-center">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-lg font-bold text-xl ${getScoreColor(scoreNum)}`}
          >
            {score}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const university = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="sr-only">Open menu</span>
              <div className="relative h-5 w-5">
                <Image
                  src={items[0].iconLight}
                  alt={items[0].title}
                  width={20}
                  height={20}
                  className="block dark:hidden opacity-60 hover:opacity-100 transition-opacity"
                />
                <Image
                  src={items[0].iconDark}
                  alt={items[0].title}
                  width={20}
                  height={20}
                  className="hidden dark:block opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-semibold">
              작업
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(String(university.unitId))
              }
              className="cursor-pointer"
            >
              📋 대학교 ID 복사
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              🔍 상세 정보 보기
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              ⚖️ 비교 목록에 추가
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              ⭐ 즐겨찾기 추가
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
