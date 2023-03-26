import { TeacherInfo } from "./Teacher";

export interface DefenceInfo {
    /**
     * 答辩组容量
     */
    capacity: number;
    chairman: TeacherInfo;
    committee: TeacherInfo[];
    /**
     * 答辩地点
     */
    defencePlace: string;
    /**
     * 答辩时间，yyyy-MM-dd HH:mm:ss
     */
    defenceTime: string;
    id: string;
    nowcapacity: number;
    secretary: TeacherInfo;
}