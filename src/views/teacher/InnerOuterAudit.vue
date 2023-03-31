<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <h2 style="color:#606266">内外审分配</h2>
    </div>
    <el-row :gutter="20" style="width: 80vw;">
        <el-col :span="7">
            <div style="height: 70vh; border:1px solid #9f9f9f;border-radius: 8px;">
                <div v-for="teacher, idx in innerTeacherInfos" :key="idx" style="margin: 12px;">
                    <el-card>
                        <el-descriptions class="margin-top" :title="teacher.teacherID + ' ' + teacher.name" :column="3"
                            size="small" border>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="cell-item">
                                        内审
                                    </div>
                                </template>
                                {{ teacher.innerProcessNum }}
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="cell-item">
                                        外审
                                    </div>
                                </template>
                                {{ teacher.outerProcessNum }}
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-checkbox @change="(e) => chooseTeacher(e, teacher.teacherID!, 'i')" />
                    </el-card>
                </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div style="height: 70vh; border:1px solid #9f9f9f;border-radius: 8px;">
                <div v-for="teacher, idx in outerTeacherInfos" :key="idx" style="margin: 12px;">
                    <el-card>
                        <el-descriptions class="margin-top" :title="teacher.teacherID + ' ' + teacher.name" :column="3"
                            size="small" border>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="cell-item">
                                        内审
                                    </div>
                                </template>
                                {{ teacher.innerProcessNum }}
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="cell-item">
                                        外审
                                    </div>
                                </template>
                                {{ teacher.outerProcessNum }}
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-checkbox label="选入" @change="(e) => chooseTeacher(e, teacher.teacherID!, 'o')" />
                    </el-card>
                </div>
            </div>
        </el-col>
        <el-col :span="10">
            <div style="height: 70vh; border:1px solid #9f9f9f;border-radius: 8px;">
                <div v-for="flow, idx in flowInfos" :key="idx" style="margin: 12px;">
                    <el-card>
                        <el-descriptions class="margin-top" :title="'' + flow.studentId" :column="3" size="small" border>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="cell-item">
                                        状态
                                    </div>
                                </template>
                                {{ flow.status }}
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-checkbox label="选入" @change="(e) => chooseStudent(e, flow.id!)" />
                    </el-card>
                </div>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-button type="primary" style="margin: 10px auto; ">预览分配</el-button>
    </el-row>
</template>
  
<script lang="ts" setup>
import { reactive, Ref, ref } from 'vue';
import { ProcessDetail, Status } from '~/entity/base/Process';
import { TeacherInfo } from '~/entity/base/Teacher';
import webApi from '~/util/webApi';
import { GetFlowDetailRes, GetTeacherInfoRes } from '~/util/webRes';

const innerTeacherInfos: Ref<TeacherInfo[]> = ref([]);
webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', {}).then(res => {
    innerTeacherInfos.value = res.data;
});

const outerTeacherInfos: Ref<TeacherInfo[]> = ref([]);
webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', {}).then(res => {
    outerTeacherInfos.value = res.data;
});

const flowInfos: Ref<ProcessDetail[]> = ref([]);
webApi.post<GetFlowDetailRes, { status: Status }>('/getFlowInfo', { status: "TEACHER_CONFIRMED" }).then(res => {
    flowInfos.value = res.data;
});

const submitForm: any = reactive({
    innerTeachers: [],
    outerTeachers: [],
    flows: []
})

const chooseTeacher = (e: any, teacherID: string | number, type: 'i' | 'o') => {
    if (e) {
        if (type === 'i') submitForm.innerTeachers.push(teacherID);
        else submitForm.outerTeachers.push(teacherID);
    } else {
        if (type == 'i')
            submitForm.innerTeachers = submitForm.innerTeachers.filter((id: number | string) => id !== teacherID);
        else
            submitForm.outerTeachers = submitForm.outerTeachers.filter((id: number | string) => id !== teacherID);
    }
}
const chooseStudent = (e: any, studentID: string | number) => {
    if (e) {
        submitForm.flows.push(studentID);
    } else {
        submitForm.flows = submitForm.flows.filter((id: number | string) => id !== studentID);
    }
}

webApi.post('/assignAudit', submitForm);

</script>
<style>
.ep-row {
    display: flex;
    align-items: center;
}

.form {
    display: flex;
    flex-direction: column;
}

.form-item {
    width: 80%;
    margin: 5px auto;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>