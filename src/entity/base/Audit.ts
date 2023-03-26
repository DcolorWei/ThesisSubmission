/**
 * 审核信息
 */
export interface AuditInfo {
    auditType: string;
    comment: string;
    flowID: string;
    pass: boolean;
    score: number;
}
