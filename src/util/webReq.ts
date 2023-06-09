import { Title } from "~/entity/base/Teacher";

//通过...获取老师信息
export interface GetTeacherInfoReq {
    academicTutorId: null | string;
    current: number;
    flowId: null | string;
    flowStatus: null | string;
    name: string;
    nominalTutorId: null | string;
    pageSize: number;
    /**
     * 学号
     */
    studentId: null | string;
}

//通过...获取学生信息
export interface GetStudentInfoReq {
    current: number;
    departmentName: null | string;
    /**
     * 姓名
     */
    name: string;
    pageSize: number;
    /**
     * 角色
     */
    role: null | string;
    schoolName: null | string;
    /**
     * 学工号
     */
    teacherId: null | string;
    /**
     * 职称
     */
    title: null | string;
}


//获得流程信息
export interface GetFlowStatusReq {
    current: number;
    id: null | string;
    innerAuditorId: null | string;
    outerAuditorId: null | string;
    pageSize: number;
    status: null | string;
    studentId: null | string;
}


//分配流程池
export interface AssignAuditReq {
    assignType: number;
    /**
     * 流程池
     */
    flows: string[];
    /**
     * 教师池
     */
    innerTeachers: string[];
    OuterTeachers: string[];
}

//更新教师信息
export interface UpdateTeacherReq {
    /**
     * 学院名称
     */
    departmentName: string;
    /**
     * 邮箱地址
     */
    emailAddress: string;
    /**
     * 唯一用户id
     */
    id: number;
    /**
     * 教师姓名
     */
    name: string;
    /**
     * 联系电话
     */
    phoneNumber: string;
    /**
     * 角色列表
     */
    role: string[] | null;
    /**
     * 学校名称
     */
    schoolName: string;
    /**
     * 教师工号
     */
    teacherId: string;
    /**
     * 职称
     */
    title: Title;
    /**
     * ding用户id
     */
    userId: string;
}


//更新学生信息
export interface UpdateStudentReq {
    /**
     * 学业导师用户id
     */
    academicTutorId: string;
    emailAddress: null;
    id: number;
    name: string;
    /**
     * 挂名导师用户id
     */
    nominalTutorId: string;
    phoneNumber: null;
    role: string[];
    studentId: null;
    userId: string;
}
