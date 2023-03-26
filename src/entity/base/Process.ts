import { TeacherInfo } from "./Teacher";

/**
 * 流程详情
 */
export interface ProcessDetail {
    /**
     * 答辩组
     */
    defenceGroup?: null;
    /**
     * 流程id
     */
    id?: number;
    /**
     * 内审教师
     */
    innerAuditor?: null | TeacherInfo;
    /**
     * 外审教师
     */
    outerAuditor?: null | TeacherInfo;
    /**
     * 流程状态
     */
    status: Status;
    /**
     * 归属学生id
     */
    studentId: number;
    /**
     * 归属学生姓名
     */
    studentName: string;
    /**
     * 确认老师
     */
    verifier?: null | TeacherInfo;
}

/**
 * 流程状态
 */
export type Status = "FLOW_START" | "TEACHER_CONFIRMED" | "WAIT_AUDIT_SUMMIT" | "THESIS_AUDIT" | "AUDIT_PASSED" | "AUDIT_FAILED" | "WAIT_STUDENT_CONFIRM_ORAL_DEFENSE" | "WAIT_DISTRIBUTE_ORAL_DEFENSE" | "WAIT_ORAL_DEFENSE" | "ORAL_DEFENSE_PASSED" | "THESIS_WAIT_FOR_DUPLICATE_CHECK" | "DUPLICATE_CHECKING" | "DUPLICATE_CHECK_PASSED" | "THESIS_PASSED" | "PROCESS_END";