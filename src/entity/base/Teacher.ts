import { Role } from "../enum/Role";
import { Title } from "../enum/Title";

/**
 * 教师信息
 */
export interface TeacherInfo {
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
    role: Role[] | null;
    /**
     * 学校名称
     */
    schoolName: null | string;
    /**
     * 教师工号
     */
    teacherId: null | string;
    /**
     * 职称
     */
    title: Title;
    /**
     * ding用户id
     */
    userId: string;
}

export { Title };
