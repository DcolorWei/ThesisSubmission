/**
 * 权限列表
 */
export enum Auth {
    ChangeAuditDistribution = "CHANGE_AUDIT_DISTRIBUTION",
    ChangeOralDefenseDistribution = "CHANGE_ORAL_DEFENSE_DISTRIBUTION",
    CheckAuditOpinion = "CHECK_AUDIT_OPINION",
    CheckOralDefenseOpinion = "CHECK_ORAL_DEFENSE_OPINION",
    DoInnerAudit = "DO_INNER_AUDIT",
    DoOuterAudit = "DO_OUTER_AUDIT",
    DownloadStudentAnonymousThesis = "DOWNLOAD_STUDENT_ANONYMOUS_THESIS",
    DownloadStudentRealNameThesis = "DOWNLOAD_STUDENT_REAL_NAME_THESIS",
    EntryInnerAuditTeam = "ENTRY_INNER_AUDIT_TEAM",
    EntryOralDefenseTeam = "ENTRY_ORAL_DEFENSE_TEAM",
    EntryOuterAuditTeam = "ENTRY_OUTER_AUDIT_TEAM",
    RaiseOralDefenseOpinion = "RAISE_ORAL_DEFENSE_OPINION",
    ReviewRequest = "REVIEW_REQUEST",
    ReviewTAndSInformation = "REVIEW_T_AND_S_INFORMATION",
    TerminateProcess = "TERMINATE_PROCESS",
    UploadPlagiarismReport = "UPLOAD_PLAGIARISM_REPORT",
}