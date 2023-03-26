import { ProcessDetail } from "./Process";
import { TeacherInfo } from "./Teacher";

/**
 * 学生信息
 */
export interface StudentInfo {
    /**
     * 学业导师
     */
    academicTutor?: null | TeacherInfo;
    emailAddress: null | string;
    /**
     * 流程
     */
    flow?: null | ProcessDetail;
    id: number;
    name: string;
    /**
     * 挂名导师
     */
    nominalTutor?: null | ProcessDetail;
    phoneNumber: null | string;
    role: string[];
    studentId: null | string;
    userId: string;
}
