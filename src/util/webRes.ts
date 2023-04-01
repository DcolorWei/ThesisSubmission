import { TeacherInfo, Title } from "../entity/base/Teacher";
import { CapacityStatus } from "../entity/enum/Flow";
import { StudentInfo } from "../entity/base/Student";
import { Capacity } from "~/entity/base/Capacity";
import { DefenceInfo } from "~/entity/base/Defence";
import { ProcessDetail, Status } from "~/entity/base/Process";

/**
 * 学生使用的接口
 */

//获得学生信息
export interface StudentInfoRes {
    code: number;
    data: StudentInfo[];
    message: string;
}

//获得论文状态
export interface ProcessStatusRes {
    /**
     * 评审ID
     */
    evaluteNo: number;
    /**
     * 当前论文状态
     */
    processCurrent: number;
    /**
     * 状态列表
     */
    processList: ProcessList[];
    /**
     * 论文名称
     */
    thesisName: string;
    /**
     * 论文ID
     */
    thesisNo: number;
}

export interface Response {
    /**
     * 状态列表
     */
    history: History;
    /**
     * flow id
     */
    id: number;
    /**
     * FlowStatus，流程状态
     */
    status: string;
}

/**
 * 状态列表
 */
export interface History {
    /**
     * 评论
     */
    comment: string;
    /**
     * 操作日期，yyyy-MM-dd HH:mm:ss
     */
    operateTime: string;
    /**
     * 操作名称
     */
    operation: string;
    /**
     * 操作人
     */
    operator: string;
    /**
     * 是否通过
     */
    pass: boolean;
    /**
     * 得分
     */
    score: number;
}

export interface ProcessList {
    /**
     * 处理操作表述
     */
    describe?: string;
    /**
     * 处理人
     */
    handler?: string;
    /**
     * 状态ID
     */
    statusId: number;
    /**
     * 状态名称
     */
    statusName: string;
    updateTime: string;
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
