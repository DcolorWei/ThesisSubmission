import { TeacherInfo, Title } from "../entity/base/Teacher";
import { CapacityStatus } from "../entity/enum/capacity";
import { StudentInfo } from "../entity/base/Student";
import { Capacity } from "~/entity/base/Capacity";

/**
 * 学生使用的接口
 */

//获得学生信息
export interface StudentInfoRes {
    code: number;
    data: StudentInfo;
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
export interface getTeacherInfoRes {
    /**
     * 学院名称
     */
    departmentName: null | string;
    /**
     * 邮箱地址
     */
    emailAddress: null | string;
    /**
     * 唯一用户id
     */
    id: number;
    /**
     * 内审流程数
     */
    innerProcessNum: number;
    /**
     * 教师姓名
     */
    name: string;
    /**
     * 答辩流程数
     */
    oralDefenceProcessNum: number;
    /**
     * 外审流程数
     */
    outerProcessNum: number;
    /**
     * 联系电话
     */
    phoneNumber: null | string;
    /**
     * 角色列表
     */
    role: string[] | null;
    /**
     * 学校名称
     */
    schoolName: null | string;
    /**
     * 教师工号
     */
    teacherID: null | string;
    /**
     * 职称
     */
    title: Title;
    /**
     * ding用户id
     */
    userId: string;
}

/**
 * 获取学生信息
*/
export interface GetStudentInfoRes {
    /**
     * 学业导师
     */
    academicTutor: null | TeacherInfo;
    emailAddress: null;
    /**
     * 流程
     */
    flow: null | CapacityStatus;
    id: number;
    name: string;
    /**
     * 挂名导师
     */
    nominalTutor: null | TeacherInfo;
    phoneNumber: null;
    role: string[];
    studentId: null;
    userId: string;
}

/**
 * 流程详情
 */
export interface GetCapacityStatusRes {
    /**
     * 答辩组
     */
    defenceGroup: null;
    /**
     * 流程id
     */
    id: number;
    /**
     * 内审教师
     */
    innerAuditor: null | TeacherInfo;
    /**
     * 外审教师
     */
    outerAuditor: null | TeacherInfo;
    /**
     * 流程状态
     */
    status: CapacityStatus;
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
    verifier: null | TeacherInfo;
}

export interface AssignAuditRes {
    flows: Capacity[];
    /**
     * 提示信息
     */
    message: string;
}
