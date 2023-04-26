import { FlowStatus } from "../enum/Flow";
import { DefenceInfo } from "./Defence";
import { TeacherInfo } from "./Teacher";

/**
 * 流程详情
 */
export interface ProcessDetail {
    /**
     * 答辩组
     */
    defenceGroup?: null | DefenceInfo;
    /**
     * 流程id
     */
    id: number;
    /**
     * 内审教师
     */
    innerAuditor?: null | TeacherInfo;
    /**
     * 外审教师
     */
    outerAuditor1: null | TeacherInfo;

    outerAuditor2: null | TeacherInfo;

    /**
     * 流程状态
     */
    status: FlowStatus;
    /**
     * 归属学生id
     */
    studentId: string;
    /**
     * 归属学生姓名
     */
    studentName: string;

    /**
     * 论文名称
     * 
     */
    thesisName: string;

    /**
     * 确认老师
     */
    verifier?: null | TeacherInfo;


    verifyPass: boolean;
    innerPass: boolean;
    outerPass1: boolean;
    outerPass2: boolean;
    oralDefencePass: boolean;
}