/**
 * 流程状态
 */
export enum FlowStatus {
    FLOW_START = "FLOW_START",
    TEACHER_CONFIRMED = "TEACHER_CONFIRMED",
    WAIT_AUDIT_SUMMIT = "WAIT_AUDIT_SUMMIT",
    THESIS_AUDIT = "THESIS_AUDIT",
    AUDIT_PASSED = "AUDIT_PASSED",
    AUDIT_FAILED = "AUDIT_FAILED",
    WAIT_STUDENT_CONFIRM_ORAL_DEFENSE = "WAIT_STUDENT_CONFIRM_ORAL_DEFENSE",
    WAIT_DISTRIBUTE_ORAL_DEFENSE = "WAIT_DISTRIBUTE_ORAL_DEFENSE",
    WAIT_ORAL_DEFENSE = "WAIT_ORAL_DEFENSE",
    ORAL_DEFENSE_PASSED = "ORAL_DEFENSE_PASSED",
    THESIS_WAIT_FOR_DUPLICATE_CHECK = "THESIS_WAIT_FOR_DUPLICATE_CHECK",
    DUPLICATE_CHECKING = "DUPLICATE_CHECKING",
    DUPLICATE_CHECK_PASSED = "DUPLICATE_CHECK_PASSED",
    THESIS_PASSED = "THESIS_PASSED",
    PROCESS_END = "PROCESS_END"
}