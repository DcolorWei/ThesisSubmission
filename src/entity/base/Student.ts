import { Role } from "../enum/Role";
import { ProcessDetail } from "./Process";
import { TeacherInfo } from "./Teacher";

/**
 * 学生信息
 */
export interface StudentInfo {
        academicTutor: null | TeacherInfo;
        emailAddress: string;
        /**
         * 流程
         */
        id: number;
        name: string;
        /**
         * 挂名导师
         */
        nominalTutor: null | TeacherInfo;
        phoneNumber: string;
        role: Role[];
        studentId: string;
        userId: string;
    }
    
