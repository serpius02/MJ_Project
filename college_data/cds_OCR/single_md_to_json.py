import json
import os
from typing import List, Literal, Optional, TypeAlias

import dspy
from pydantic import BaseModel, Field

# =================================================================
# 1. FINALIZED PYDANTIC MODELS
# =================================================================


# Section A Sub-Models
class A1AddressInfo(BaseModel):
    name_of_college: Optional[str] = Field(None, alias="Name of College")
    street_address: Optional[str] = Field(None, alias="Street Address")
    city: Optional[str] = Field(None, alias="City")
    state: Optional[str] = Field(None, alias="State")
    zip_code: Optional[str] = Field(None, alias="Zip")
    country: Optional[str] = Field(None, alias="Country")


class A2InstitutionalControl(BaseModel):
    control: Optional[str] = Field(None, alias="Control")


# Section B Sub-Models
class B1InstitutionalEnrollment(BaseModel):
    undergrad_ft_men_first_year: Optional[int] = Field(
        None,
        alias="Undergraduate Students: Full-time Enrollment (Degree-seeking, first-time, first-year students) Men",
    )
    undergrad_ft_women_first_year: Optional[int] = Field(
        None,
        alias="Undergraduate Students: Full-time Enrollment (Degree-seeking, first-time, first-year students) Women",
    )
    undergrad_ft_another_gender_first_year: Optional[int] = Field(
        None,
        alias="Undergraduate Students: Full-time Enrollment (Degree-seeking, first-time, first-year students) Another Gender",
    )
    undergrad_pt_men_first_year: Optional[int] = Field(
        None,
        alias="Undergraduate Students: Part-time Enrollment (Degree-seeking, first-time, first-year students) Men",
    )
    undergrad_pt_women_first_year: Optional[int] = Field(
        None,
        alias="Undergraduate Students: Part-time Enrollment (Degree-seeking, first-time, first-year students) Women",
    )
    undergrad_pt_another_gender_first_year: Optional[int] = Field(
        None,
        alias="Undergraduate Students: Part-time Enrollment (Degree-seeking, first-time, first-year students) Another Gender",
    )
    grad_ft_men_first_time: Optional[int] = Field(
        None,
        alias="Graduate Students: Full-time (Degree-seeking, first-time students) Men",
    )
    grad_ft_women_first_time: Optional[int] = Field(
        None,
        alias="Graduate Students: Full-time (Degree-seeking, first-time students) Women",
    )
    grad_ft_another_gender_first_time: Optional[int] = Field(
        None,
        alias="Graduate Students: Full-time (Degree-seeking, first-time students) Another Gender",
    )
    grad_pt_men_first_time: Optional[int] = Field(
        None,
        alias="Graduate Students: Part-time (Degree-seeking, first-time students) Men",
    )
    grad_pt_women_first_time: Optional[int] = Field(
        None,
        alias="Graduate Students: Part-time (Degree-seeking, first-time students) Women",
    )
    grad_pt_another_gender_first_time: Optional[int] = Field(
        None,
        alias="Graduate Students: Part-time (Degree-seeking, first-time students) Another Gender",
    )


class B2EnrollmentByRace(BaseModel):
    international_first_year: Optional[int] = Field(
        None,
        alias="International (Nonresidents) (Degree-seeking, first-time, first year)",
    )
    hispanic_latino_first_year: Optional[int] = Field(
        None, alias="Hispanic/Latino (Degree-seeking, first-time, first year)"
    )
    black_non_hispanic_first_year: Optional[int] = Field(
        None,
        alias="Black or African American, non-Hispanic (Degree-seeking, first-time, first year)",
    )
    white_non_hispanic_first_year: Optional[int] = Field(
        None, alias="White, non-Hispanic (Degree-seeking, first-time, first year)"
    )
    american_indian_alaska_native_first_year: Optional[int] = Field(
        None,
        alias="American Indian or Alaska Native, non-Hispanic (Degree-seeking, first-time, first year)",
    )
    asian_non_hispanic_first_year: Optional[int] = Field(
        None, alias="Asian, non-Hispanic (Degree-seeking, first-time, first year)"
    )
    hawaiian_pacific_islander_first_year: Optional[int] = Field(
        None,
        alias="Native Hawaiian or other Pacific Islander, non-Hispanic (Degree-seeking, first-time, first year)",
    )
    two_or_more_races_first_year: Optional[int] = Field(
        None,
        alias="Two or more races, non-Hispanic (Degree-seeking, first-time, first year)",
    )
    unknown_race_first_year: Optional[int] = Field(
        None,
        alias="Race and/or ethnicity unknown (Degree-seeking, first-time, first year)",
    )
    total_first_year: Optional[int] = Field(
        None, alias="Total (Degree-seeking, first-time, first year)"
    )
    international_total_undergrad: Optional[int] = Field(
        None,
        alias="International (nonresidents) Total Undergraduates (both degree-seeking and non-degree-seeking)",
        description="Value from International (nonresidents) row, Total Undergraduates column in B2 table",
    )


class B3Degrees(BaseModel):
    bachelors_degrees: Optional[int] = Field(None, alias="Bachelor's degrees")
    masters_degrees: Optional[int] = Field(None, alias="Master's degrees")
    doctoral_degrees_research: Optional[int] = Field(
        None, alias="Doctoral degrees - research/scholarship"
    )


class B22RetentionRates(BaseModel):
    retention_rate: Optional[str] = Field(None, alias="Retention rate")


# Section C Sub-Models
class C1Applications(BaseModel):
    applied_men: Optional[int] = Field(
        None, alias="Men (Total first-time, first-year students who applied)"
    )
    applied_women: Optional[int] = Field(
        None, alias="Women (Total first-time, first-year students who applied)"
    )
    applied_another_gender: Optional[int] = Field(
        None,
        alias="Another Gender/No response (Total first-time, first-year students who applied)",
    )
    admitted_men: Optional[int] = Field(
        None, alias="Men (Total first-time, first-year students who admitted)"
    )
    admitted_women: Optional[int] = Field(
        None, alias="Women (Total first-time, first-year students who admitted)"
    )
    admitted_another_gender: Optional[int] = Field(
        None,
        alias="Another Gender/No response (Total first-time, first-year students who admitted)",
    )
    enrolled_men: Optional[int] = Field(
        None, alias="Men (Total first-time, first-year students who enrolled)"
    )
    enrolled_women: Optional[int] = Field(
        None, alias="Women (Total first-time, first-year students who enrolled)"
    )
    enrolled_another_gender: Optional[int] = Field(
        None,
        alias="Another Gender/No response (Total first-time, first-year students who enrolled)",
    )
    applied_in_state: Optional[int] = Field(
        None,
        alias="In-State (Total first-time, first-year (degree-seeking) who applied)",
    )
    applied_out_of_state: Optional[int] = Field(
        None,
        alias="Out-of-State (Total first-time, first-year (degree-seeking) who applied)",
    )
    applied_international: Optional[int] = Field(
        None,
        alias="International (Total first-time, first-year (degree-seeking) who applied)",
    )
    applied_total: Optional[int] = Field(
        None, alias="Total (Total first-time, first-year (degree-seeking) who applied)"
    )
    admitted_in_state: Optional[int] = Field(
        None,
        alias="In-State (Total first-time, first-year (degree-seeking) who admitted)",
    )
    admitted_out_of_state: Optional[int] = Field(
        None,
        alias="Out-of-State (Total first-time, first-year (degree-seeking) who admitted)",
    )
    admitted_international: Optional[int] = Field(
        None,
        alias="International (Total first-time, first-year (degree-seeking) who admitted)",
    )
    admitted_total: Optional[int] = Field(
        None, alias="Total (Total first-time, first-year (degree-seeking) who admitted)"
    )
    enrolled_in_state: Optional[int] = Field(
        None,
        alias="In-State (Total first-time, first-year (degree-seeking) who enrolled)",
    )
    enrolled_out_of_state: Optional[int] = Field(
        None,
        alias="Out-of-State (Total first-time, first-year (degree-seeking) who enrolled)",
    )
    enrolled_international: Optional[int] = Field(
        None,
        alias="International (Total first-time, first-year (degree-seeking) who enrolled)",
    )
    enrolled_total: Optional[int] = Field(
        None, alias="Total (Total first-time, first-year (degree-seeking) who enrolled)"
    )


class C2WaitList(BaseModel):
    has_policy: Optional[Literal["Yes", "No"]] = Field(
        None, alias="Do you have a policy of placing students on a waiting list?"
    )
    offered_place: Optional[int] = Field(
        None, alias="Number of qualified applicants offered a place on waiting list"
    )
    accepted_place: Optional[int] = Field(
        None, alias="Number accepting a place on the waiting list"
    )
    admitted_from_list: Optional[int] = Field(
        None, alias="Number of wait-listed students admitted"
    )


ImportanceLevel: TypeAlias = Optional[
    Literal["Very Important", "Important", "Considered", "Not Considered"]
]


class C7BasisForSelection(BaseModel):
    rigor: ImportanceLevel = Field(None, alias="Rigor of secondary school record")
    class_rank: ImportanceLevel = Field(None, alias="Class rank")
    gpa: ImportanceLevel = Field(None, alias="Academic GPA")
    test_scores: ImportanceLevel = Field(None, alias="Standardized test scores")
    essay: ImportanceLevel = Field(None, alias="Application Essay")
    recommendations: ImportanceLevel = Field(None, alias="Recommendation(s)")
    interview: ImportanceLevel = Field(None, alias="Nonacademic - Interview")
    extracurriculars: ImportanceLevel = Field(
        None, alias="Nonacademic - Extracurricular activities"
    )
    talent_ability: ImportanceLevel = Field(None, alias="Nonacademic - Talent/ability")
    character_qualities: ImportanceLevel = Field(
        None, alias="Nonacademic - Character/personal qualities"
    )
    first_generation: ImportanceLevel = Field(
        None, alias="Nonacademic - First generation"
    )
    alumni_relation: ImportanceLevel = Field(
        None, alias="Nonacademic - Alumni/ae relation"
    )
    geographical_residence: ImportanceLevel = Field(
        None, alias="Nonacademic - Geographical residence"
    )
    state_residency: ImportanceLevel = Field(
        None, alias="Nonacademic - State residency"
    )
    religious_affiliation: ImportanceLevel = Field(
        None, alias="Nonacademic - Religious Affiliation/commitment"
    )
    volunteer_work: ImportanceLevel = Field(None, alias="Nonacademic - Volunteer work")
    work_experience: ImportanceLevel = Field(
        None, alias="Nonacademic - Work experience"
    )
    applicant_interest: ImportanceLevel = Field(
        None, alias="Nonacademic - Level of applicant's interest"
    )


class C8SatActPolicies(BaseModel):
    use_scores: Optional[Literal["Yes", "No"]] = Field(
        None,
        alias="Does your institution make use of SAT or ACT scores in admissions decisions for first-time, first-year, degree-seeking applicants?",
    )


class C9TestProfile(BaseModel):
    # 기본 정보
    submitting_sat_percent: Optional[str] = Field(
        None, alias="Submitting SAT scores (percent)"
    )
    submitting_sat_number: Optional[int] = Field(
        None, alias="Submitting SAT scores (number)"
    )
    submitting_act_percent: Optional[str] = Field(
        None, alias="Submitting ACT scores (percent)"
    )
    submitting_act_number: Optional[int] = Field(
        None, alias="Submitting ACT scores (number)"
    )

    # 백분위 점수 (테이블 순서대로)
    sat_composite_25th: Optional[int] = Field(
        None, alias="SAT Composite (400-1600) - 25th percentile score"
    )
    sat_composite_50th: Optional[int] = Field(
        None, alias="SAT Composite (400-1600) - 50th percentile score"
    )
    sat_composite_75th: Optional[int] = Field(
        None, alias="SAT Composite (400-1600) - 75th percentile score"
    )
    sat_ebrw_25th: Optional[int] = Field(
        None,
        alias="SAT Evidence-Based Reading and Writing (200-800) - 25th percentile score",
    )
    sat_ebrw_50th: Optional[int] = Field(
        None,
        alias="SAT Evidence-Based Reading and Writing (200-800) - 50th percentile score",
    )
    sat_ebrw_75th: Optional[int] = Field(
        None,
        alias="SAT Evidence-Based Reading and Writing (200-800) - 75th percentile score",
    )
    sat_math_25th: Optional[int] = Field(
        None, alias="SAT Math (200-800) - 25th percentile score"
    )
    sat_math_50th: Optional[int] = Field(
        None, alias="SAT Math (200-800) - 50th percentile score"
    )
    sat_math_75th: Optional[int] = Field(
        None, alias="SAT Math (200-800) - 75th percentile score"
    )
    act_composite_25th: Optional[int] = Field(
        None, alias="ACT Composite (0-36) - 25th percentile score"
    )
    act_composite_50th: Optional[int] = Field(
        None, alias="ACT Composite (0-36) - 50th percentile score"
    )
    act_composite_75th: Optional[int] = Field(
        None, alias="ACT Composite (0-36) - 75th percentile score"
    )

    # 점수 범위별 비율 (테이블 행 순서대로!)
    sat_ebrw_700_800: Optional[str] = Field(
        None, alias="SAT Evidence-Based Reading and Writing (700-800)"
    )
    sat_math_700_800: Optional[str] = Field(None, alias="SAT Math (700-800)")
    sat_ebrw_600_699: Optional[str] = Field(
        None, alias="SAT Evidence-Based Reading and Writing (600-699)"
    )
    sat_math_600_699: Optional[str] = Field(None, alias="SAT Math (600-699)")
    sat_ebrw_500_599: Optional[str] = Field(
        None, alias="SAT Evidence-Based Reading and Writing (500-599)"
    )
    sat_math_500_599: Optional[str] = Field(None, alias="SAT Math (500-599)")
    sat_ebrw_400_499: Optional[str] = Field(
        None, alias="SAT Evidence-Based Reading and Writing (400-499)"
    )
    sat_math_400_499: Optional[str] = Field(None, alias="SAT Math (400-499)")
    sat_ebrw_300_399: Optional[str] = Field(
        None, alias="SAT Evidence-Based Reading and Writing (300-399)"
    )
    sat_math_300_399: Optional[str] = Field(None, alias="SAT Math (300-399)")
    sat_ebrw_200_299: Optional[str] = Field(
        None, alias="SAT Evidence-Based Reading and Writing (200-299)"
    )
    sat_math_200_299: Optional[str] = Field(None, alias="SAT Math (200-299)")

    # SAT Composite 점수 범위
    sat_composite_1400_1600: Optional[str] = Field(
        None, alias="SAT Composite (1400-1600)"
    )
    sat_composite_1200_1399: Optional[str] = Field(
        None, alias="SAT Composite (1200-1399)"
    )
    sat_composite_1000_1199: Optional[str] = Field(
        None, alias="SAT Composite (1000-1199)"
    )
    sat_composite_800_999: Optional[str] = Field(None, alias="SAT Composite (800-999)")
    sat_composite_600_799: Optional[str] = Field(None, alias="SAT Composite (600-799)")
    sat_composite_400_599: Optional[str] = Field(None, alias="SAT Composite (400-599)")

    # ACT Composite 점수 범위
    act_composite_30_36: Optional[str] = Field(None, alias="ACT Composite (30-36)")
    act_composite_24_29: Optional[str] = Field(None, alias="ACT Composite (24-29)")
    act_composite_18_23: Optional[str] = Field(None, alias="ACT Composite (18-23)")
    act_composite_12_17: Optional[str] = Field(None, alias="ACT Composite (12-17)")
    act_composite_6_11: Optional[str] = Field(None, alias="ACT Composite (6-11)")
    act_composite_below_6: Optional[str] = Field(None, alias="ACT Composite (below 6)")


class C11GpaRanges(BaseModel):
    gpa_4_0: Optional[str] = Field(
        None, alias="Percent who had GPA of 4.0 (percent of all enrolled students)"
    )
    gpa_3_75_3_99: Optional[str] = Field(
        None,
        alias="Percent who had GPA between 3.75 and 3.99 (percent of all enrolled students)",
    )
    gpa_3_50_3_74: Optional[str] = Field(
        None,
        alias="Percent who had GPA between 3.50 and 3.74 (percent of all enrolled students)",
    )
    gpa_3_25_3_49: Optional[str] = Field(
        None,
        alias="Percent who had GPA between 3.25 and 3.49 (percent of all enrolled students)",
    )
    gpa_3_00_3_24: Optional[str] = Field(
        None,
        alias="Percent who had GPA between 3.00 and 3.24 (percent of all enrolled students)",
    )
    gpa_2_50_2_99: Optional[str] = Field(
        None,
        alias="Percent who had GPA between 2.50 and 2.99 (percent of all enrolled students)",
    )
    gpa_2_00_2_49: Optional[str] = Field(
        None,
        alias="Percent who had GPA between 2.00 and 2.49 (percent of all enrolled students)",
    )
    gpa_1_00_1_99: Optional[str] = Field(
        None,
        alias="Percent who had GPA between 1.00 and 1.99 (percent of all enrolled students)",
    )
    gpa_below_1_0: Optional[str] = Field(
        None, alias="Percent who had GPA below 1.0 (percent of all enrolled students)"
    )


class C12AverageGpa(BaseModel):
    average_gpa: Optional[float] = Field(
        None,
        alias="Average high school GPA of all degree-seeking, first-time, first-year students who submitted GPA",
    )


class C14ClosingDate(BaseModel):
    has_closing_date: Optional[Literal["Yes", "No"]] = Field(
        None, alias="Does your institution have an application closing date?"
    )
    closing_date_fall: Optional[str] = Field(
        None, alias="application closing date (fall)"
    )
    priority_date: Optional[str] = Field(None, alias="priority date")


class C16Notifications(BaseModel):
    is_rolling: Optional[Literal["Yes", "No"]] = Field(
        None,
        alias="Are notifications to applicants of admission decision sent on a rolling basis?",
    )
    rolling_begin_date: Optional[str] = Field(
        None, alias="What date do rolling notifications begin?"
    )
    specific_date: Optional[str] = Field(
        None,
        alias="If notifications of admission decision are sent by specific date, please enter date",
    )


class C19EarlyAdmissions(BaseModel):
    allows_early_admissions: Optional[Literal["Yes", "No"]] = Field(
        None,
        alias="Does your institution allow high school students to enroll as full-time, first-time, first-year students one year or more before high school graduation?",
    )


class C21EarlyDecision(BaseModel):
    offers_ed: Optional[Literal["Yes", "No"]] = Field(
        None,
        alias="Does your institution offer an early decision plan for first-time, first-year applicants for fall enrollment?",
    )
    closing_date: Optional[str] = Field(
        None, alias="First or only early decision plan closing date"
    )
    notification_date: Optional[str] = Field(
        None, alias="First or only early decision plan notification date"
    )
    other_closing_date: Optional[str] = Field(
        None, alias="Other early decision plan closing date"
    )
    other_notification_date: Optional[str] = Field(
        None, alias="Other early decision plan notification date"
    )
    applications_received: Optional[int] = Field(
        None, alias="Number of early decision applications received by your institution"
    )
    admitted: Optional[int] = Field(
        None, alias="Number of applicants admitted under early decision plan"
    )
    enrolled: Optional[int] = Field(
        None, alias="Number of early decision applicants enrolled"
    )


class C22EarlyAction(BaseModel):
    offers_ea: Optional[Literal["Yes", "No"]] = Field(
        None, alias="Do you have a nonbinding early action plan"
    )
    closing_date: Optional[str] = Field(None, alias="Early action closing date")
    notification_date: Optional[str] = Field(
        None, alias="Early action notification date"
    )
    is_restrictive: Optional[Literal["Yes", "No"]] = Field(
        None,
        alias='Is your early action plan a "restrictive" plan under which you limit students from applying to other early plans?',
    )
    applications_received: Optional[int] = Field(
        None, alias="Number of early action applications received by your institution"
    )
    admitted: Optional[int] = Field(
        None, alias="Number of applicants admitted under early action plan"
    )
    enrolled: Optional[int] = Field(
        None, alias="Number of applicants enrolled under early action plan"
    )


# Section D Sub-Models
class D1TransferEnrollment(BaseModel):
    enrolls_transfers: Optional[Literal["Yes", "No"]] = Field(
        None, alias="Does your institution enroll transfer students?"
    )


class D2TransferCounts(BaseModel):
    applicants_men: Optional[int] = Field(None, alias="Men (applicants)")
    admitted_men: Optional[int] = Field(None, alias="Men (admitted applicants)")
    enrolled_men: Optional[int] = Field(None, alias="Men (enrolled applicants)")
    applicants_women: Optional[int] = Field(None, alias="Women (applicants)")
    admitted_women: Optional[int] = Field(None, alias="Women (admitted applicants)")
    enrolled_women: Optional[int] = Field(None, alias="Women (enrolled applicants)")
    applicants_another_gender: Optional[int] = Field(
        None, alias="Another gender (applicants)"
    )
    admitted_another_gender: Optional[int] = Field(
        None, alias="Another gender (admitted applicants)"
    )
    enrolled_another_gender: Optional[int] = Field(
        None, alias="Another gender (enrolled applicants)"
    )
    applicants_total: Optional[int] = Field(None, alias="Total (applicants)")
    admitted_total: Optional[int] = Field(None, alias="Total (admitted applicants)")
    enrolled_total: Optional[int] = Field(None, alias="Total (enrolled applicants)")


# Section G Sub-Models
class G1Expenses(BaseModel):
    # 기본 등록금 (Private/In-state)
    tuition: Optional[int] = Field(
        None,
        alias="Tuition",
        description="Basic tuition amount from PRIVATE INSTITUTION or In-state section",
    )

    # International/Non-resident 등록금
    tuition_international: Optional[int] = Field(
        None,
        alias="Tuition: International (non-resident)",
        description="International or non-resident tuition if separately listed",
    )

    # 기타 비용들
    required_fees: Optional[int] = Field(None, alias="Required Fees")
    food_and_housing: Optional[int] = Field(None, alias="Food and Housing (on-campus)")


# Section H Sub-Models
PolicyType = Literal[
    "Institutional need-based scholarship or grant aid is available",
    "Institutional non-need-based scholarship or grant aid is available",
    "Institutional scholarship and grant aid is not available",
]


class H6AidToNonresidents(BaseModel):
    available_aid_policies: Optional[List[PolicyType]] = Field(
        None,
        alias="Indicate your institution's policy regarding institutional scholarship and grant aid for undergraduate degree-seeking nonresidents",
    )
    num_awarded: Optional[int] = Field(
        None,
        alias="The number of undergraduate degree-seeking nonresidents who were awarded need-based or non-need-based aid",
    )
    average_amount: Optional[int] = Field(
        None,
        alias="Average dollar amount awarded to undergraduate degree-seeking nonresidents",
    )
    total_amount: Optional[int] = Field(
        None,
        alias="Total dollar amount of institutional financial aid awarded to undergraduate degree-seeking nonresidents",
    )


# Section J Sub-Models
class JDisciplinaryAreaItem(BaseModel):
    category_name: Optional[str] = Field(None, alias="Category Name")
    bachelors: Optional[str] = Field(None, alias="Bachelor's")
    cip_2020_categories: Optional[str] = Field(
        None, alias="CIP 2020 Categories to Include"
    )


# Main StructuredCDS Model
class StructuredCDS(BaseModel):
    """The root model for a university's Common Data Set."""

    a1_address_info: Optional[A1AddressInfo] = Field(
        None, alias="A1 - Address Information"
    )
    a2_institutional_control: Optional[A2InstitutionalControl] = Field(
        None, alias="A2 - Source of Institutional Control"
    )
    b1_institutional_enrollment: Optional[B1InstitutionalEnrollment] = Field(
        None, alias="B1 - Institutional Enrollment"
    )
    b2_enrollment_by_race: Optional[B2EnrollmentByRace] = Field(
        None, alias="B2 - Enrollment by Racial/Ethnic Category"
    )
    b3_degrees: Optional[B3Degrees] = Field(None, alias="B3 - Persistence / Degrees")
    b22_retention_rates: Optional[B22RetentionRates] = Field(
        None, alias="B22 - Retention Rates"
    )
    c1_applications: Optional[C1Applications] = Field(
        None, alias="C1 - Applications: First-time, first-year students"
    )
    c2_wait_list: Optional[C2WaitList] = Field(
        None, alias="C2 - Applications: First-time, first-year wait-listed students"
    )
    c7_basis_for_selection: Optional[C7BasisForSelection] = Field(
        None,
        alias="C7 - Basis for selection: Relative importance of factors in admission decisions (Very Important / Important / Considered / Not Considered)",
    )
    c8_sat_act_policies: Optional[C8SatActPolicies] = Field(
        None, alias="C8 - SAT and ACT policies"
    )
    c9_test_profile: Optional[C9TestProfile] = Field(
        None,
        alias="C9 - First-time, first-year profile: National standardized test scores (SAT/ACT)",
    )
    c11_gpa_ranges: Optional[C11GpaRanges] = Field(
        None, alias="C11 - High school grade point ranges"
    )
    c12_average_gpa: Optional[C12AverageGpa] = Field(
        None, alias="C12 - Average high school GPA"
    )
    c14_closing_date: Optional[C14ClosingDate] = Field(
        None, alias="C14 - Application closing date"
    )
    c16_notifications: Optional[C16Notifications] = Field(
        None, alias="C16 - Admissions notifications to applicants"
    )
    c19_early_admissions: Optional[C19EarlyAdmissions] = Field(
        None, alias="C19 - Early Admissions"
    )
    c21_early_decision: Optional[C21EarlyDecision] = Field(
        None, alias="C21- Early Decision"
    )
    c22_early_action: Optional[C22EarlyAction] = Field(None, alias="C22 - Early Action")
    d1_transfer_enrollment: Optional[D1TransferEnrollment] = Field(
        None, alias="D1 - Fall applicants: transfer student enrollment"
    )
    d2_transfer_counts: Optional[D2TransferCounts] = Field(
        None, alias="D2 - Fall applicants: Students counts"
    )
    g1_expenses: Optional[G1Expenses] = Field(
        None,
        alias="G1 - Undergraduate, full-time tuition, required fees, food and housing",
    )
    h6_aid_to_nonresidents: Optional[H6AidToNonresidents] = Field(
        None, alias="H6 - Aid to Undergraduate Degree-Seeking Nonresidents"
    )
    j_disciplinary_areas: Optional[List[JDisciplinaryAreaItem]] = Field(
        None, alias="J - Disciplinary Areas of Degrees Conferred"
    )


# =================================================================
# 2. DSPY EXTRACTION INSTRUCTIONS
# =================================================================


class ExtractCDS(dspy.Signature):
    """Extract Common Data Set information following exact Pydantic model structure.

    CRITICAL EXTRACTION RULES:
    1. Extract only data explicitly present - never infer, assume, or calculate
    2. If a field/value is not clearly stated, use null
    3. Match field aliases to actual table content/headers exactly
    4. Follow the table structure exactly as presented
    5. Preserve data integrity over interpretation

    GENERAL TABLE PARSING PRINCIPLES:

    For score range tables (C9):
    - Identify the row headers (score ranges like "700-800", "600-699")
    - Identify the column headers (test types like "SAT Math", "SAT EBRW")
    - Extract values at row-column intersections
    - If a cell is empty or shows "-", record as null

    For admission criteria tables (C7):
    - Look for X marks, checkmarks, or direct text values
    - Map to importance levels: "Very Important", "Important", "Considered", "Not Considered"
    - Handle both X-mark format and direct text format

    For enrollment tables (B1, B2, C1):
    - Follow column headers exactly (Men, Women, Another Gender, etc.)
    - Extract values from appropriate rows
    - Handle both filled and empty cells appropriately

    For financial aid tables (G1, H6):
    - Look for specific fee types and amounts
    - Handle different institutional types (Private vs Public)
    - Use fallback logic when specific categories are empty
    """

    markdown_content: str = dspy.InputField(
        description="The markdown content of Common Data Set file"
    )
    structured_cds: StructuredCDS = dspy.OutputField(
        description="Extracted structured data following the exact Pydantic model"
    )


# =================================================================
# 3. MAIN SCRIPT EXECUTION
# =================================================================


def calculate_additional_fields(structured_cds: StructuredCDS) -> dict:
    """원본 CDS 데이터에서 추가 계산 필드들을 생성"""
    result = structured_cds.model_dump()

    # B1 Enrollment 계산 (기존 코드 유지)
    if structured_cds.b1_institutional_enrollment:
        b1 = structured_cds.b1_institutional_enrollment

        undergrad_total_first_year = sum(
            filter(
                None,
                [
                    b1.undergrad_ft_men_first_year,
                    b1.undergrad_ft_women_first_year,
                    b1.undergrad_ft_another_gender_first_year,
                    b1.undergrad_pt_men_first_year,
                    b1.undergrad_pt_women_first_year,
                    b1.undergrad_pt_another_gender_first_year,
                ],
            )
        )

        grad_total_first_time = sum(
            filter(
                None,
                [
                    b1.grad_ft_men_first_time,
                    b1.grad_ft_women_first_time,
                    b1.grad_ft_another_gender_first_time,
                    b1.grad_pt_men_first_time,
                    b1.grad_pt_women_first_time,
                    b1.grad_pt_another_gender_first_time,
                ],
            )
        )

        if "b1_institutional_enrollment" not in result:
            result["b1_institutional_enrollment"] = {}

        result["b1_institutional_enrollment"][
            "undergrad_total_first_year"
        ] = undergrad_total_first_year
        result["b1_institutional_enrollment"][
            "grad_total_first_time"
        ] = grad_total_first_time

    # C1 Applications 관련 계산 (기존 코드 유지)
    if structured_cds.c1_applications:
        c1 = structured_cds.c1_applications
        total_applied = sum(
            filter(None, [c1.applied_men, c1.applied_women, c1.applied_another_gender])
        )
        total_admitted = sum(
            filter(
                None, [c1.admitted_men, c1.admitted_women, c1.admitted_another_gender]
            )
        )
        total_enrolled = sum(
            filter(
                None, [c1.enrolled_men, c1.enrolled_women, c1.enrolled_another_gender]
            )
        )

        if "c1_applications" not in result:
            result["c1_applications"] = {}

        result["c1_applications"]["total_applied_calculated"] = total_applied
        result["c1_applications"]["total_admitted_calculated"] = total_admitted
        result["c1_applications"]["total_enrolled_calculated"] = total_enrolled

        if total_applied > 0:
            result["c1_applications"]["admission_rate"] = round(
                total_admitted / total_applied * 100, 2
            )
        if total_admitted > 0:
            result["c1_applications"]["yield_rate"] = round(
                total_enrolled / total_admitted * 100, 2
            )

    # G1 Tuition 후처리 (새로 추가!)
    if structured_cds.g1_expenses:
        g1 = structured_cds.g1_expenses

        if "g1_expenses" not in result:
            result["g1_expenses"] = {}

        # 실제 국제학생 등록금 결정 로직
        if g1.tuition_international and g1.tuition_international > 0:
            # International tuition이 명시되어 있는 경우
            result["g1_expenses"][
                "effective_international_tuition"
            ] = g1.tuition_international
            result["g1_expenses"]["tuition_source"] = "international_specific"
            result["g1_expenses"][
                "tuition_note"
            ] = "Uses specific international tuition rate"
        elif g1.tuition and g1.tuition > 0:
            # International tuition이 없으면 일반 tuition 사용 (Private college의 경우)
            result["g1_expenses"]["effective_international_tuition"] = g1.tuition
            result["g1_expenses"]["tuition_source"] = "general_tuition_fallback"
            result["g1_expenses"][
                "tuition_note"
            ] = "Uses general tuition rate (likely private institution)"
        else:
            # 둘 다 없는 경우
            result["g1_expenses"]["effective_international_tuition"] = None
            result["g1_expenses"]["tuition_source"] = "not_available"
            result["g1_expenses"]["tuition_note"] = "No tuition information available"

        # 추가 유용한 계산들
        if g1.tuition and g1.tuition_international:
            # 둘 다 있는 경우 차이 계산
            if g1.tuition > 0 and g1.tuition_international > 0:
                tuition_difference = g1.tuition_international - g1.tuition
                result["g1_expenses"]["international_premium"] = tuition_difference
                result["g1_expenses"]["international_premium_percentage"] = (
                    round((tuition_difference / g1.tuition) * 100, 2)
                    if g1.tuition > 0
                    else None
                )

    # H6 Aid to Nonresidents 계산 (기존 코드 유지)
    if structured_cds.h6_aid_to_nonresidents and structured_cds.b2_enrollment_by_race:
        h6 = structured_cds.h6_aid_to_nonresidents
        b2 = structured_cds.b2_enrollment_by_race

        num_awarded = h6.num_awarded
        international_total = b2.international_total_undergrad

        if "h6_aid_to_nonresidents" not in result:
            result["h6_aid_to_nonresidents"] = {}

        if international_total and international_total > 0 and num_awarded is not None:
            aid_percentage = round((num_awarded / international_total) * 100, 2)
            result["h6_aid_to_nonresidents"]["aid_coverage_percentage"] = aid_percentage
            result["h6_aid_to_nonresidents"][
                "calculation_note"
            ] = f"{num_awarded}/{international_total} students"
        else:
            result["h6_aid_to_nonresidents"]["aid_coverage_percentage"] = None
            result["h6_aid_to_nonresidents"][
                "calculation_note"
            ] = "Cannot calculate - missing or invalid data"

        if num_awarded and num_awarded > 0:
            if h6.total_amount and h6.total_amount > 0:
                calculated_average = round(h6.total_amount / num_awarded, 2)
                result["h6_aid_to_nonresidents"][
                    "calculated_average_amount"
                ] = calculated_average

    return result


# main 함수에서 사용
def main(file_path: str):
    """
    Main function to configure DSPy, run the extraction, and print the results.
    """
    # --- LLM Configuration ---
    # Make sure you have your OPENAI_API_KEY set in your environment variables.
    # We use gpt-4o as it's powerful enough for this complex extraction task.
    try:
        api_key = os.environ["OPENAI_API_KEY"]
    except KeyError:
        print("ERROR: Please set your OPENAI_API_KEY environment variable.")
        return

    llm = dspy.LM("openai/gpt-4o-2024-08-06", api_key=api_key, max_tokens=8192)
    dspy.configure(lm=llm)

    # --- Read Input File ---
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            markdown_content = f.read()
        print(f"✅ Successfully read markdown file: {file_path}")
    except FileNotFoundError:
        print(f"❌ ERROR: File not found at path: {file_path}")
        return

    # --- Initialize and Run the Predictor ---
    extractor = dspy.Predict(ExtractCDS)

    print("\n🚀 Starting data extraction with DSPy... This may take a moment.")

    try:
        prediction = extractor(markdown_content=markdown_content)
        structured_output = prediction.structured_cds

        # 추가 계산 필드 생성
        enhanced_data = calculate_additional_fields(structured_output)

        print("\n✅ Extraction Complete!")
        print("--- Enhanced JSON Output ---")
        print(json.dumps(enhanced_data, indent=2))

        # 파일 저장
        output_filename = (
            os.path.splitext(os.path.basename(file_path))[0] + "_enhanced.json"
        )
        # 고정된 출력 디렉토리로 변경
        output_dir = r"E:\CommonDataSet\23-24_final"
        os.makedirs(output_dir, exist_ok=True)  # 디렉토리가 없으면 생성
        output_path = os.path.join(output_dir, output_filename)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(enhanced_data, f, indent=2, ensure_ascii=False)
        print(f"\n💾 Enhanced JSON saved to: {output_path}")

    except Exception as e:
        print(f"\n❌ Error: {e}")


if __name__ == "__main__":
    # --- How to Run ---
    # 1. Make sure you have the required libraries: pip install dspy-ai pydantic openai
    # 2. Set your OpenAI API key: export OPENAI_API_KEY='your_key_here'
    # 3. Place your markdown file in the same directory as this script.
    # 4. Update the file_path variable below if needed.
    # 5. Run the script: python your_script_name.py

    # UPDATE THIS PATH to your markdown file
    markdown_file_path = r"E:\CommonDataSet\23-24_cleaned\2023-24 Washington University in St. Louis_cleaned.md"

    main(markdown_file_path)
