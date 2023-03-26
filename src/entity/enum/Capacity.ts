/**
 * 流程状态
 */
export enum CapacityStatus {
    AuditFailed = "AUDIT_FAILED",
    AuditPassed = "AUDIT_PASSED",
    DuplicateCheckPassed = "DUPLICATE_CHECK_PASSED",
    DuplicateChecking = "DUPLICATE_CHECKING",
    FlowStart = "FLOW_START",
    OralDefensePassed = "ORAL_DEFENSE_PASSED",
    ProcessEnd = "PROCESS_END",
    TeacherConfirmed = "TEACHER_CONFIRMED",
    ThesisAudit = "THESIS_AUDIT",
    ThesisPassed = "THESIS_PASSED",
    ThesisWaitForDuplicateCheck = "THESIS_WAIT_FOR_DUPLICATE_CHECK",
    WaitAuditSummit = "WAIT_AUDIT_SUMMIT",
    WaitDistributeOralDefense = "WAIT_DISTRIBUTE_ORAL_DEFENSE",
    WaitOralDefense = "WAIT_ORAL_DEFENSE",
    WaitStudentConfirmOralDefense = "WAIT_STUDENT_CONFIRM_ORAL_DEFENSE",
}