import { TeacherInfo } from "./Teacher";

/**
 * 答辩组信息
 */
export interface Capacity {
    capacity: number;
    chairman: TeacherInfo;
    committee: TeacherInfo[];
    defencePlace: string;
    defenceTime: string;
    id: string;
    nowcapacity: number;
    secretary: TeacherInfo;
}