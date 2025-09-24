// import React, { useState } from "react";

// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { CDSData } from "./columns";
// import { Tabs } from "./UniversityTabs";
// import UniversityTableView from "./UniversityTableView";
// import UniversityCardView from "./UniversityCardView";

// import Image from "next/image";

// const mockUniversityData: CDSData[] = [
//   {
//     // --- 1. 기본 정보 ---
//     institutionName: "University of California, Los Angeles",
//     unitId: 110635,
//     control: "Public",
//     logoUrl: "https://picsum.photos/64/64?random=1",

//     // --- 2. 신입생 등록 현황 (성별) ---
//     ugFFMen: 15420,
//     ugFFWomen: 18650,
//     ugFFAnotherGender: 45,
//     ugFFTotal: 34115,
//     gradFFMen: 6890,
//     gradFFWomen: 8230,
//     gradFFAnotherGender: 28,
//     gradFFTotal: 15148,

//     // --- 3. 신입생 인종/민족 구성 ---
//     enrollFFNonresident: 5240,
//     enrollFFHispanicLatino: 5120,
//     enrollFFBlack: 1280,
//     enrollFFWhite: 8950,
//     enrollFFAmericanIndian: 85,
//     enrollFFAsian: 12450,
//     enrollFFHawaiianPacific: 120,
//     enrollFFTwoOrMoreRaces: 2890,
//     enrollFFRaceUnknown: 890,
//     enrollFFRaceTotal: 37025,
//     ugFFInternational: 3240,

//     // --- 4. 학위 수여 및 유지율 ---
//     degreesBachelors: 8420,
//     degreesMasters: 3890,
//     degreesDoctoral: 890,
//     retentionRate: 97.2,

//     // --- 5. 신입생 입학 통계 (지원/합격/등록) ---
//     ffMenAppliedTotal: 58240,
//     ffWomenAppliedTotal: 81450,
//     ffAnotherGenderAppliedTotal: 285,
//     ffAppliedTotal: 139975,
//     ffMenAdmittedTotal: 6420,
//     ffWomenAdmittedTotal: 8950,
//     ffAnotherGenderAdmittedTotal: 28,
//     ffAdmittedTotal: 15398,
//     ffMenEnrolledTotal: 2890,
//     ffWomenEnrolledTotal: 3450,
//     ffAnotherGenderEnrolledTotal: 12,
//     ffEnrolledTotal: 6352,
//     acceptanceRate: 11.0,

//     ffInstateAppliedTotal: 98240,
//     ffOutofStateAppliedTotal: 32890,
//     ffInternationalAppliedTotal: 8845,
//     ffUnknownAppliedTotal: 0,
//     ffInstateAdmittedTotal: 11240,
//     ffOutofStateAdmittedTotal: 3120,
//     ffInternationalAdmittedTotal: 1038,
//     ffUnknownAdmittedTotal: 0,
//     ffInstateEnrolledTotal: 4890,
//     ffOutofStateEnrolledTotal: 1120,
//     ffInternationalEnrolledTotal: 342,
//     ffUnknownEnrolledTotal: 0,

//     // --- 6. 대기자 명단 정책 ---
//     waitlistPolicy: true,
//     waitlistOffered: 8420,
//     waitlistAccepted: 5890,
//     waitlistAdmitted: 1240,

//     // --- 7. 입학 사정 요소 중요도 ---
//     criteriaRigor: "Very Important",
//     criteriaRank: "Important",
//     criteriaGpa: "Very Important",
//     criteriaTestScores: "Important",
//     criteriaEssay: "Very Important",
//     criteriaRecommendations: "Important",
//     criteriaInterview: "Not Considered",
//     criteriaExtracurricular: "Important",
//     criteriaTalent: "Important",
//     criteriaCharacter: "Very Important",
//     criteriaFirstGeneration: "Considered",
//     criteriaAthletic: "Considered",
//     criteriaGeographicalResidence: "Not Considered",
//     criteriaStateResidence: "Very Important",
//     criteriaReligion: "Not Considered",
//     criteriaVolunteer: "Considered",
//     criteriaWorkExperience: "Considered",
//     criteriaInterest: "Considered",

//     // --- 8. 입시 주요 일정 ---
//     satActDeadline: "2024-01-31",
//     applicationDeadline: "2024-11-30",
//     applicationDeadlinePriority: "2024-11-30",
//     isRollingAdmission: false,
//     rollingNotificationDate: "",
//     rollingNotificationDeadline: "",

//     // --- 9. 수시 전형 (얼리 디시전/액션) ---
//     hasEarlyDecision: false,
//     fEdDeadline: 0,
//     fEdNotificationDate: "",
//     oEdDeadline: 0,
//     oEdNotificationDate: "",
//     numberOfEdApplications: 0,
//     numberOfEdAdmissions: 0,
//     numberOfEdEnrollments: 0,

//     hasEarlyAction: false,
//     ea1Deadline: 0,
//     ea1NotificationDate: "",
//     ea2Deadline: 0,
//     ea2NotificationDate: "",
//     isEaRestrictive: false,
//     numberOfEaApplications: 0,
//     numberOfEaAdmissions: 0,
//     numberOfEaEnrollments: 0,

//     // --- 10. 학비 및 재정 지원 (유학생 기준) ---
//     tuitionNonResident: 46326,
//     requiredFees: 2847,
//     roomAndBoard: 16763,
//     totalCost: 65936,
//     aidForNonresidents: true,
//     aidInternationalCount: 890,
//     aidInternationalPercent: 27.5,
//     aidAverageAmountNonresident: 18420,
//     aidTotalAmountNonresident: 16393800,
//   },
//   {
//     institutionName: "Harvard University",
//     unitId: 166027,
//     control: "Private",
//     logoUrl: "https://picsum.photos/64/64?random=1",
//     acceptanceRate: 3.4,
//     ugFFMen: 15420,
//     ugFFWomen: 18650,
//     ugFFAnotherGender: 45,
//     ugFFTotal: 34115,
//     gradFFMen: 6890,
//     gradFFWomen: 8230,
//     gradFFAnotherGender: 28,
//     gradFFTotal: 15148,
//     enrollFFNonresident: 5240,
//     enrollFFHispanicLatino: 5120,
//     enrollFFBlack: 1280,
//     enrollFFWhite: 8950,
//     enrollFFAmericanIndian: 85,
//     enrollFFAsian: 12450,
//     enrollFFHawaiianPacific: 120,
//     enrollFFTwoOrMoreRaces: 2890,
//     enrollFFRaceUnknown: 890,
//     enrollFFRaceTotal: 37025,
//     ugFFInternational: 3240,
//     degreesBachelors: 8420,
//     degreesMasters: 3890,
//     degreesDoctoral: 890,
//     retentionRate: 97.2,
//     ffMenAppliedTotal: 58240,
//     ffWomenAppliedTotal: 81450,
//     ffAnotherGenderAppliedTotal: 285,
//     ffAppliedTotal: 139975,
//     ffMenAdmittedTotal: 6420,
//     ffWomenAdmittedTotal: 8950,
//     ffAnotherGenderAdmittedTotal: 28,
//     ffAdmittedTotal: 15398,
//     ffMenEnrolledTotal: 2890,
//     ffWomenEnrolledTotal: 3450,
//     ffAnotherGenderEnrolledTotal: 12,
//     ffEnrolledTotal: 6352,
//     ffInstateAppliedTotal: 98240,
//     ffOutofStateAppliedTotal: 32890,
//     ffInternationalAppliedTotal: 8845,
//     ffUnknownAppliedTotal: 0,
//     ffInstateAdmittedTotal: 11240,
//     ffOutofStateAdmittedTotal: 3120,
//     ffInternationalAdmittedTotal: 1038,
//     ffUnknownAdmittedTotal: 0,
//     ffInstateEnrolledTotal: 4890,
//     ffOutofStateEnrolledTotal: 1120,
//     ffInternationalEnrolledTotal: 342,
//     ffUnknownEnrolledTotal: 0,
//     waitlistPolicy: true,
//     waitlistOffered: 8420,
//     waitlistAccepted: 5890,
//     waitlistAdmitted: 1240,
//     criteriaRigor: "Very Important",
//     criteriaRank: "Important",
//     criteriaGpa: "Very Important",
//     criteriaTestScores: "Important",
//     criteriaEssay: "Very Important",
//     criteriaRecommendations: "Important",
//     criteriaInterview: "Not Considered",
//     criteriaExtracurricular: "Important",
//     criteriaTalent: "Important",
//     criteriaCharacter: "Very Important",
//     criteriaFirstGeneration: "Considered",
//     criteriaAthletic: "Considered",
//     criteriaGeographicalResidence: "Not Considered",
//     criteriaStateResidence: "Very Important",
//     criteriaReligion: "Not Considered",
//     criteriaVolunteer: "Considered",
//     criteriaWorkExperience: "Considered",
//     criteriaInterest: "Considered",
//     satActDeadline: "2024-01-31",
//     applicationDeadline: "2024-11-30",
//     applicationDeadlinePriority: "2024-11-30",
//     isRollingAdmission: false,
//     rollingNotificationDate: "",
//     rollingNotificationDeadline: "",
//     hasEarlyDecision: false,
//     fEdDeadline: 0,
//     fEdNotificationDate: "",
//     oEdDeadline: 0,
//     oEdNotificationDate: "",
//     numberOfEdApplications: 0,
//     numberOfEdAdmissions: 0,
//     numberOfEdEnrollments: 0,
//     hasEarlyAction: false,
//     ea1Deadline: 0,
//     ea1NotificationDate: "",
//     ea2Deadline: 0,
//     ea2NotificationDate: "",
//     isEaRestrictive: false,
//     numberOfEaApplications: 0,
//     numberOfEaAdmissions: 0,
//     numberOfEaEnrollments: 0,
//     tuitionNonResident: 46326,
//     requiredFees: 2847,
//     roomAndBoard: 16763,
//     totalCost: 65936,
//     aidForNonresidents: true,
//     aidInternationalCount: 890,
//     aidInternationalPercent: 27.5,
//     aidAverageAmountNonresident: 18420,
//     aidTotalAmountNonresident: 16393800,
//   },
//   {
//     institutionName: "Stanford University",
//     unitId: 243744,
//     control: "Private",
//     logoUrl: "https://picsum.photos/64/64?random=2",
//     acceptanceRate: 3.9,
//     ugFFMen: 15420,
//     ugFFWomen: 18650,
//     ugFFAnotherGender: 45,
//     ugFFTotal: 34115,
//     gradFFMen: 6890,
//     gradFFWomen: 8230,
//     gradFFAnotherGender: 28,
//     gradFFTotal: 15148,
//     enrollFFNonresident: 5240,
//     enrollFFHispanicLatino: 5120,
//     enrollFFBlack: 1280,
//     enrollFFWhite: 8950,
//     enrollFFAmericanIndian: 85,
//     enrollFFAsian: 12450,
//     enrollFFHawaiianPacific: 120,
//     enrollFFTwoOrMoreRaces: 2890,
//     enrollFFRaceUnknown: 890,
//     enrollFFRaceTotal: 37025,
//     ugFFInternational: 3240,
//     degreesBachelors: 8420,
//     degreesMasters: 3890,
//     degreesDoctoral: 890,
//     retentionRate: 97.2,
//     ffMenAppliedTotal: 58240,
//     ffWomenAppliedTotal: 81450,
//     ffAnotherGenderAppliedTotal: 285,
//     ffAppliedTotal: 139975,
//     ffMenAdmittedTotal: 6420,
//     ffWomenAdmittedTotal: 8950,
//     ffAnotherGenderAdmittedTotal: 28,
//     ffAdmittedTotal: 15398,
//     ffMenEnrolledTotal: 2890,
//     ffWomenEnrolledTotal: 3450,
//     ffAnotherGenderEnrolledTotal: 12,
//     ffEnrolledTotal: 6352,
//     ffInstateAppliedTotal: 98240,
//     ffOutofStateAppliedTotal: 32890,
//     ffInternationalAppliedTotal: 8845,
//     ffUnknownAppliedTotal: 0,
//     ffInstateAdmittedTotal: 11240,
//     ffOutofStateAdmittedTotal: 3120,
//     ffInternationalAdmittedTotal: 1038,
//     ffUnknownAdmittedTotal: 0,
//     ffInstateEnrolledTotal: 4890,
//     ffOutofStateEnrolledTotal: 1120,
//     ffInternationalEnrolledTotal: 342,
//     ffUnknownEnrolledTotal: 0,
//     waitlistPolicy: true,
//     waitlistOffered: 8420,
//     waitlistAccepted: 5890,
//     waitlistAdmitted: 1240,
//     criteriaRigor: "Very Important",
//     criteriaRank: "Important",
//     criteriaGpa: "Very Important",
//     criteriaTestScores: "Important",
//     criteriaEssay: "Very Important",
//     criteriaRecommendations: "Important",
//     criteriaInterview: "Not Considered",
//     criteriaExtracurricular: "Important",
//     criteriaTalent: "Important",
//     criteriaCharacter: "Very Important",
//     criteriaFirstGeneration: "Considered",
//     criteriaAthletic: "Considered",
//     criteriaGeographicalResidence: "Not Considered",
//     criteriaStateResidence: "Very Important",
//     criteriaReligion: "Not Considered",
//     criteriaVolunteer: "Considered",
//     criteriaWorkExperience: "Considered",
//     criteriaInterest: "Considered",
//     satActDeadline: "2024-01-31",
//     applicationDeadline: "2024-11-30",
//     applicationDeadlinePriority: "2024-11-30",
//     isRollingAdmission: false,
//     rollingNotificationDate: "",
//     rollingNotificationDeadline: "",
//     hasEarlyDecision: false,
//     fEdDeadline: 0,
//     fEdNotificationDate: "",
//     oEdDeadline: 0,
//     oEdNotificationDate: "",
//     numberOfEdApplications: 0,
//     numberOfEdAdmissions: 0,
//     numberOfEdEnrollments: 0,
//     hasEarlyAction: false,
//     ea1Deadline: 0,
//     ea1NotificationDate: "",
//     ea2Deadline: 0,
//     ea2NotificationDate: "",
//     isEaRestrictive: false,
//     numberOfEaApplications: 0,
//     numberOfEaAdmissions: 0,
//     numberOfEaEnrollments: 0,
//     tuitionNonResident: 46326,
//     requiredFees: 2847,
//     roomAndBoard: 16763,
//     totalCost: 65936,
//     aidForNonresidents: true,
//     aidInternationalCount: 890,
//     aidInternationalPercent: 27.5,
//     aidAverageAmountNonresident: 18420,
//     aidTotalAmountNonresident: 16393800,
//   },
//   {
//     institutionName: "MIT",
//     unitId: 166683,
//     control: "Private",
//     acceptanceRate: 6.7,
//     ugFFMen: 15420,
//     ugFFWomen: 18650,
//     ugFFAnotherGender: 45,
//     ugFFTotal: 34115,
//     gradFFMen: 6890,
//     gradFFWomen: 8230,
//     gradFFAnotherGender: 28,
//     gradFFTotal: 15148,
//     enrollFFNonresident: 5240,
//     enrollFFHispanicLatino: 5120,
//     enrollFFBlack: 1280,
//     enrollFFWhite: 8950,
//     enrollFFAmericanIndian: 85,
//     enrollFFAsian: 12450,
//     enrollFFHawaiianPacific: 120,
//     enrollFFTwoOrMoreRaces: 2890,
//     enrollFFRaceUnknown: 890,
//     enrollFFRaceTotal: 37025,
//     ugFFInternational: 3240,
//     degreesBachelors: 8420,
//     degreesMasters: 3890,
//     degreesDoctoral: 890,
//     retentionRate: 97.2,
//     ffMenAppliedTotal: 58240,
//     ffWomenAppliedTotal: 81450,
//     ffAnotherGenderAppliedTotal: 285,
//     ffAppliedTotal: 139975,
//     ffMenAdmittedTotal: 6420,
//     ffWomenAdmittedTotal: 8950,
//     ffAnotherGenderAdmittedTotal: 28,
//     ffAdmittedTotal: 15398,
//     ffMenEnrolledTotal: 2890,
//     ffWomenEnrolledTotal: 3450,
//     ffAnotherGenderEnrolledTotal: 12,
//     ffEnrolledTotal: 6352,
//     ffInstateAppliedTotal: 98240,
//     ffOutofStateAppliedTotal: 32890,
//     ffInternationalAppliedTotal: 8845,
//     ffUnknownAppliedTotal: 0,
//     ffInstateAdmittedTotal: 11240,
//     ffOutofStateAdmittedTotal: 3120,
//     ffInternationalAdmittedTotal: 1038,
//     ffUnknownAdmittedTotal: 0,
//     ffInstateEnrolledTotal: 4890,
//     ffOutofStateEnrolledTotal: 1120,
//     ffInternationalEnrolledTotal: 342,
//     ffUnknownEnrolledTotal: 0,
//     waitlistPolicy: true,
//     waitlistOffered: 8420,
//     waitlistAccepted: 5890,
//     waitlistAdmitted: 1240,
//     criteriaRigor: "Very Important",
//     criteriaRank: "Important",
//     criteriaGpa: "Very Important",
//     criteriaTestScores: "Important",
//     criteriaEssay: "Very Important",
//     criteriaRecommendations: "Important",
//     criteriaInterview: "Not Considered",
//     criteriaExtracurricular: "Important",
//     criteriaTalent: "Important",
//     criteriaCharacter: "Very Important",
//     criteriaFirstGeneration: "Considered",
//     criteriaAthletic: "Considered",
//     criteriaGeographicalResidence: "Not Considered",
//     criteriaStateResidence: "Very Important",
//     criteriaReligion: "Not Considered",
//     criteriaVolunteer: "Considered",
//     criteriaWorkExperience: "Considered",
//     criteriaInterest: "Considered",
//     satActDeadline: "2024-01-31",
//     applicationDeadline: "2024-11-30",
//     applicationDeadlinePriority: "2024-11-30",
//     isRollingAdmission: false,
//     rollingNotificationDate: "",
//     rollingNotificationDeadline: "",
//     hasEarlyDecision: false,
//     fEdDeadline: 0,
//     fEdNotificationDate: "",
//     oEdDeadline: 0,
//     oEdNotificationDate: "",
//     numberOfEdApplications: 0,
//     numberOfEdAdmissions: 0,
//     numberOfEdEnrollments: 0,
//     hasEarlyAction: false,
//     ea1Deadline: 0,
//     ea1NotificationDate: "",
//     ea2Deadline: 0,
//     ea2NotificationDate: "",
//     isEaRestrictive: false,
//     numberOfEaApplications: 0,
//     numberOfEaAdmissions: 0,
//     numberOfEaEnrollments: 0,
//     tuitionNonResident: 46326,
//     requiredFees: 2847,
//     roomAndBoard: 16763,
//     totalCost: 65936,
//     aidForNonresidents: true,
//     aidInternationalCount: 890,
//     aidInternationalPercent: 27.5,
//     aidAverageAmountNonresident: 18420,
//     aidTotalAmountNonresident: 16393800,
//   },
// ];

// const items = [
//   {
//     title: "expand",
//     iconLight: "/icons/Expand/light.svg",
//     iconDark: "/icons/Expand/dark.svg",
//     iconLightHighlight: "/icons/Expand/light_highlight.svg",
//     iconDarkHighlight: "/icons/Expand/dark_highlight.svg",
//     iconOffset: "-translate-y-0.5",
//   },
//   {
//     title: "collapse",
//     iconLight: "/icons/Collapse/light.svg",
//     iconDark: "/icons/Collapse/dark.svg",
//     iconLightHighlight: "/icons/Collapse/light_highlight.svg",
//     iconDarkHighlight: "/icons/Collapse/dark_highlight.svg",
//     iconOffset: "translate-y-0.5",
//   },
// ];

// const tabs = [
//   { id: "cards", label: "카드 보기" },
//   { id: "table", label: "테이블 보기" },
//   { id: "news", label: "뉴스 보기" },
// ];

// interface UniversitySectionProps {
//   selectedUniversity: CDSData | null;
//   isExpanded: boolean;
//   onToggle: () => void;
// }

// const UniversitySection = ({
//   selectedUniversity: _selectedUniversity,
//   isExpanded,
//   onToggle,
// }: UniversitySectionProps) => {
//   const [activeTab, setActiveTab] = useState("cards");

//   return (
//     <div className="bg-card border border-border rounded-lg shadow-lg flex flex-col h-full">
//       {/* 헤더 영역 - padding 적용 */}
//       <div className="px-6 pt-4">
//         <div className="flex items-center justify-between mb-2">
//           <h2 className="font-semibold text-[16px] text-base-primary">
//             <Tabs
//               tabs={tabs}
//               activeTab={activeTab}
//               onTabChange={setActiveTab}
//             />
//           </h2>

//           {/* Light 모드 아이콘 */}
//           <Image
//             src={isExpanded ? items[1].iconLight : items[0].iconLight}
//             alt={isExpanded ? items[1].title : items[0].title}
//             width={20}
//             height={20}
//             className="block dark:hidden w-5 h-5 cursor-pointer
//                        hover:opacity-80 hover:scale-110
//                        active:scale-95
//                        transition-all duration-200 ease-in-out
//                        transform-gpu"
//             onClick={onToggle}
//           />

//           {/* Dark 모드 아이콘 */}
//           <Image
//             src={isExpanded ? items[1].iconDark : items[0].iconDark}
//             alt={isExpanded ? items[1].title : items[0].title}
//             width={20}
//             height={20}
//             className="hidden dark:block w-5 h-5 cursor-pointer
//                        hover:opacity-80 hover:scale-110
//                        active:scale-95
//                        transition-all duration-200 ease-in-out
//                        transform-gpu"
//             onClick={onToggle}
//           />
//         </div>
//       </div>

//       {/* Separator - 전체 너비 차지 */}
//       <Separator />

//       {/* 나머지 콘텐츠 */}
//       <div className="flex-1 h-0 px-6 pb-6 pt-4">
//         <ScrollArea className="h-full">
//           <div className="flex flex-col gap-3 sm:gap-4 p-1">
//             {activeTab === "cards" && (
//               <UniversityCardView data={mockUniversityData} />
//             )}
//             {activeTab === "table" && (
//               <UniversityTableView data={mockUniversityData} />
//             )}
//             {activeTab === "news" && <div>News View Placeholder</div>}
//           </div>
//         </ScrollArea>
//       </div>
//     </div>
//   );
// };

// export default UniversitySection;
