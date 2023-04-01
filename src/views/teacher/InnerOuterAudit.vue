<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <h2 style="color:#606266">内外审分配</h2>
    </div>
    <el-row :gutter="20" style="width: 80vw;">
        <el-col :span="7">
            <div class="sabar-list-item">
                <div v-for="teacher, idx in innerTeacherInfos" :key="idx" style="margin: 12px;">
                    <el-card>
                        <el-descriptions class="margin-top" :title="teacher.teacherId + ' ' + teacher.name" :column="3"
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
                        <el-checkbox @change="(e) => chooseTeacher(e, teacher.id!, 'i')" />
                    </el-card>
                </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="sabar-list-item">
                <div v-for="teacher, idx in outerTeacherInfos" :key="idx" style="margin: 12px;">
                    <el-card>
                        <el-descriptions class="margin-top" :title="teacher.teacherId + ' ' + teacher.name" :column="3"
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
                        <el-checkbox label="选入" @change="(e) => chooseTeacher(e, teacher.id, 'o')" />
                    </el-card>
                </div>
            </div>
        </el-col>
        <el-col :span="10">
            <div class="sabar-list-item">
                <div v-for="flow, idx in flowInfos" :key="idx" style="margin: 12px;">
                    <el-card>
                        <el-descriptions :column="3" :title="flow.studentId + ' ' + flow.studentName" size="small" border>
                            <el-descriptions-item width="100px">
                                <template #label>
                                    <div class="cell-item">
                                        内审导师
                                    </div>
                                </template>
                                <div v-if="flow.innerAuditor">
                                    {{ flow.innerAuditor?.teacherId + ' ' + flow.innerAuditor?.name }}
                                </div>
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-descriptions :column="3" size="small" border>
                            <el-descriptions-item width="100px">
                                <template #label>
                                    <div class="cell-item">
                                        外审导师1
                                    </div>
                                </template>
                                <div v-if="flow.outerAuditor1">
                                    {{ flow.outerAuditor1?.teacherId + ' ' + flow.outerAuditor1?.name }}
                                </div>
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-descriptions :column="3" size="small" border>
                            <el-descriptions-item width="100px">
                                <template #label>
                                    <div class="cell-item">
                                        外审导师2
                                    </div>
                                </template>
                                <div v-if="flow.outerAuditor2">
                                    {{ flow.outerAuditor2?.teacherId + ' ' + flow.outerAuditor2?.name }}
                                </div>
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-descriptions :column="3" size="small" border>
                            <el-descriptions-item width="100px">
                                <template #label>
                                    <div class="cell-item">
                                        当前状态
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
        <el-button type="warning" style="margin: 10px auto;" @click="() => assignAudit()">预览分配</el-button>
    </el-row>

    <el-row>
        <el-button type="primary" style="margin: 10px auto;" @click="() => savePlan()">保存方案</el-button>
    </el-row>
</template>
  
<script lang="ts" setup>
import { reactive, Ref, ref } from 'vue';
import { ProcessDetail } from '~/entity/base/Process';
import { TeacherInfo } from '~/entity/base/Teacher';
import { FlowStatus } from '~/entity/enum/Flow';
import { Role } from '~/entity/enum/Role';
import webApi from '~/util/webApi';
import { GetFlowDetailRes, GetTeacherInfoRes, AssignAuditRes } from '~/util/webRes';

const innerTeacherInfos: Ref<TeacherInfo[]> = ref([]);
webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', { role: [Role.INNER_AUDITOR] }).then(res => {
    innerTeacherInfos.value = res.data.data;
});

const outerTeacherInfos: Ref<TeacherInfo[]> = ref([]);
webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', { role: [Role.OUTER_AUDITOR] }).then(res => {
    outerTeacherInfos.value = res.data.data;
});

const flowInfos: Ref<ProcessDetail[]> = ref([]);
webApi.post<GetFlowDetailRes, { status: FlowStatus }>('/getFlowInfo', { status: FlowStatus.TEACHER_CONFIRMED }).then(res => {
    console.log(res)
    flowInfos.value = res.data.data;
});

const submitForm: any = reactive({
    assignType: 1,
    innerTeachers: [],
    outerTeachers: [],
    flows: []
})

const chooseTeacher = (e: any, teacherId: string | number, type: 'i' | 'o') => {
    if (e) {
        if (type === 'i') submitForm.innerTeachers.push(teacherId);
        else submitForm.outerTeachers.push(teacherId);
    } else {
        if (type == 'i')
            submitForm.innerTeachers = submitForm.innerTeachers.filter((id: number | string) => id !== teacherId);
        else
            submitForm.outerTeachers = submitForm.outerTeachers.filter((id: number | string) => id !== teacherId);
    }
}
const chooseStudent = (e: any, flowId: string | number) => {
    if (e) {
        submitForm.flows.push(flowId);
    } else {
        submitForm.flows = submitForm.flows.filter((id: number | string) => id !== flowId);
    }
}

const assignAudit = () => {
    if (submitForm.innerTeachers.length === 0) {
        alert('请至少选择一个内审导师');
        return
    }
    if (submitForm.outerTeachers.length === 0) {
        alert('请至少选择一个外审导师');
        return
    }
    if (submitForm.flows.length === 0) {
        alert('请至少选择一个学生');
        return
    }
    webApi.post<AssignAuditRes>('/assignAudit', submitForm).then(res => {
        //删除未被选择的教师项和Flow项
        innerTeacherInfos.value = innerTeacherInfos.value.filter(teacher => submitForm.innerTeachers.includes(teacher.id));
        outerTeacherInfos.value = outerTeacherInfos.value.filter(teacher => submitForm.outerTeachers.includes(teacher.id));
        flowInfos.value = flowInfos.value.filter(flow => submitForm.flows.includes(flow.id));
        //遍历返回结果，补充对应的flow信息
        res.data.forEach((item: any) => {
            const flow = flowInfos.value.find(flow => true);
            if (flow) {
                flow.innerTeacher = item.innerTeacher;
                flow.outerTeacher1 = item.outerTeacher1;
                flow.outerAuditor2 = item.outerAuditor2;
            }
        });
    });
}

const savePlan = () => {
    //保存分配方案，向服务器提交，成功后重新请求学生和教师的数据
    flowInfos.value.forEach(flow => {
        webApi.post('/savePlan', {
            id: flow.id,
            innerTeacherId: flow.innerTeacher?.teacherId,
            outerAuditorId1: flow.outerAuditor1?.teacherId,
            outerAuditorId2: flow.outerAuditor2?.teacherId
        })
    })
    //重新请求学生、教师以及flow数据
    webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', { role: Role.INNER_AUDITOR }).then(res => {
        innerTeacherInfos.value = res.data.data;
    });
    webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', { role: Role.OUTER_AUDITOR }).then(res => {
        outerTeacherInfos.value = res.data.data;
    });
    webApi.post<GetFlowDetailRes, { status: FlowStatus }>('/getFlowInfo', { status: FlowStatus.TEACHER_CONFIRMED }).then(res => {
        flowInfos.value = res.data.data;
    });
}
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

.sabar-list-item {
    height: 70vh;
    border: 1px solid #9f9f9f;
    border-radius: 8px;
    overflow-y: scroll;
}

::-webkit-scrollbar {
    width: 2px;
    height: 16px;
    background-color: #F5F5F5;
}

/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    border-radius: 10px;
    background-color: #F5F5F5;
}

/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, .3);
    background-color: #9d9d9d;
}
</style>