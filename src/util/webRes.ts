import { TeacherInfo } from "../entity/base/Teacher";
import { StudentInfo } from "../entity/base/Student";
import { DefenceInfo } from "~/entity/base/Defence";
import { ProcessDetail } from "~/entity/base/Process";

/**
 * 学生使用的接口
 */

//获得学生信息
export interface StudentInfoRes {
    code: number;
    data: StudentInfo;
    message: string;
}
export interface FlowHistoryRes {
    code: number;
    data: {
        histories: History[];
        id: number;
        status: string;
    };
    message: string;
}

export interface History {
    comment: null | string;
    operateTime: string;
    operation: string;
    operator: string;
    pass: boolean | null;
    score: number | null;
}


export interface UsualRes {
    message?: string
    status?: number
}

/**
 * 教师使用的接口
 */
/**
 * 教师信息
 */
export interface GetTeacherInfoRes {
    code: number;
    message: string;
    data: {
        data: TeacherInfo[];
        page: number;
        size: number;
        success: boolean;
        total: number;
    };
};

/**
 * 获取学生信息
*/
export interface GetStudentInfoRes {
    code: number;
    message: string;
    data: {
        data: StudentInfo[];
        page: number;
        size: number;
        success: boolean;
        total: number;
    };
};

/**
 * 流程详情
 */
export interface GetFlowDetailRes {
    code: number;
    message: string;
    data: {
        data: ProcessDetail[];
        page: number;
        size: number;
        success: boolean;
        total: number;
    };
};


export interface AssignAuditRes {
    code: number;
    data: ProcessDetail[];
    /**
     * 提示信息
     */
    message: string;
}

export interface GetDefenceGroupsRes {
    code: number;
    data: {
        data: DefenceInfo[];
        page: number;
        size: number;
        success: boolean;
        total: number;
    };
    message: string;
}
