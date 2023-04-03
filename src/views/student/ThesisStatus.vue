<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <el-text size="large" tag="b">学生信息</el-text>
    </div>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-table
            :data="[{ id: student.studentId, name: student.name, phone: student.phoneNumber, email: student.emailAddress }]"
            v-if="student.studentId" style="width: 90vw">
            <el-table-column prop="id" label="学号" width="200" />
            <el-table-column prop="name" label="姓名" width="200" />
            <el-table-column prop="phone" label="电话" width="200" />
            <el-table-column prop="email" label="邮箱" />
        </el-table>
        <el-table :data="[{
            nominalTutorId: student.nominalTutor?.id,
            nominalTutorName: student.nominalTutor?.name,
            academicTutorId: student.academicTutor?.id,
            academicTutorName: student.academicTutor?.name,
        }]" v-if="student.studentId" style="width: 90vw">
            <el-table-column prop="nominalTutorId" label="挂名导师工号" width="200" />
            <el-table-column prop="nominalTutorName" label="挂名导师姓名" width="200" />
            <el-table-column prop="academicTutorId" label="学业导师工号" width="200" />
            <el-table-column prop="academicTutorName" label="学业导师姓名" />
        </el-table>
        <el-table v-if="student.studentId" :data="[{}]" style="width: 90vw">
            <el-table-column label="论文流程状态">
                <template #default>
                    <el-tag type="warning" round>{{ student.flow?.status }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <el-text size="large" tag="b">论文流程</el-text>
    </div>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-button @click="() => toPage('submitthesis')"> 发起评审 </el-button>
    </el-card>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-collapse class="collapse" v-model="index" accordion>
            <el-collapse-item name="1">
                <el-timeline class="timeline">
                    <el-timeline-item center v-for="history, index in flowHistories.filter(i => i.pass)" :key="index"
                        :timestamp="history.operateTime">
                        <el-card shadow="always" body-style="padding:10px 20px">
                            <!-- 显示历史记录里的操作，操作人 -->
                            <div style="display: flex; justify-content: space-between;align-items: center;">
                                <div style="width:400px">
                                    <el-text size="large" tag="b">{{ history.operation }}</el-text>
                                    <div>
                                        <el-text size="default" v-if="history.score" tag="b" style="margin-right: 20px;">
                                            评分: {{ history.score }}
                                        </el-text>
                                        <el-text size="default" tag="b"> 操作人：{{ history.operator }}</el-text>
                                    </div>
                                    <div>
                                        <el-text size="default" tag="b"> {{
                                            history.comment ? '评语：' + history.comment : ''
                                        }}</el-text>
                                    </div>
                                </div>
                                <div>
                                    <el-button plain> 查看 </el-button>
                                </div>
                            </div>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-collapse-item>
        </el-collapse>
    </el-card>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <el-text size="large" tag="b">可用操作</el-text>
    </div>
    <el-card body-style="width:85vw" style="margin: 10px 0;">
        <!-- 可用操作按钮 -->
        <el-button type="primary" @click="() => joinDefence()"> 确认参加答辩 </el-button>
        <el-button type="warning" @click="() => showDefenceGroupDialog = true"> 选择答辩组 </el-button>
        <el-button type="warning" @click="() => readyDuplicate()"> 查重准备就绪 </el-button>
    </el-card>

    <!-- 弹窗，用于更换答辩组 -->
    <el-dialog title="选择答辩组" v-model="showDefenceGroupDialog" style="width: 80vw;">
        <el-table :data="defenceGroupInfos" style="width: 90vw">
            <el-table-column prop="chairman.name" label="主席" width="150" />
            <el-table-column prop="secretary.name" label="秘书" width="150" />
            <el-table-column prop="defencePlace" label="答辩地点" width="150" />
            <el-table-column prop="defenceTime" label="答辩时间" width="150" />
            <el-table-column width="150">
                <template #default="{ row }">
                    {{ row.nowCapacity }}/{{ row.capacity }}
                </template>
            </el-table-column>
            <el-table-column width="80">
                <template #default="{ row }">
                    <el-button type="warning" plain round size="small"
                        @click="() => chooseDefenceGroup(row.id)">指定</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, Ref, ref } from 'vue'
import { DefenceInfo } from '~/entity/base/Defence';
import { StudentInfo } from '~/entity/base/Student';
import webApi from '~/util/webApi';
import { FlowHistoryRes, GetDefenceGroupsRes, History, StudentInfoRes } from '~/util/webRes';
import { router } from "../../route"

const index = ref(['1'])

const toPage = (path: string = 'home') => {
    router.push(path)
}


const student: StudentInfo = reactive(
    //初始空白数据
    {
        id: 0,
        userId: '',
        studentId: '',
        name: "",
        phoneNumber: "",
        emailAddress: "",
        flow: null,
        academicTutor: null,
        nominalTutor: null,
        role: [],
    }
)
webApi.get<StudentInfoRes>('/student/getStudentInfo', {}).then(res => {
    const data = res.data
    console.log(data)
    student.id = data.id
    student.userId = data.userId
    student.studentId = data.studentId
    student.name = data.name
    student.phoneNumber = data.phoneNumber
    student.emailAddress = data.emailAddress
    student.flow = data.flow
    student.academicTutor = data.academicTutor
    student.nominalTutor = data.nominalTutor
    student.role = data.role
})

const flowHistories: History[] = reactive([])
webApi.get<FlowHistoryRes>('/student/getFlowHistory', {}).then(res => {
    flowHistories.push(...res.data.histories)
    console.log(flowHistories)
})

const joinDefence = () => {
    webApi.get('/student/readyForDefence', {})
}

const showDefenceGroupDialog = ref(false);
const defenceGroupInfos: Ref<DefenceInfo[]> = ref([]);
webApi.post<GetDefenceGroupsRes>('/getDefenceGroupInfo', {}).then(res => {
    defenceGroupInfos.value = res.data.data;
});
const chooseDefenceGroup = (defenceGroupId: number) => {
    webApi.post(`/student/chooseDefenceGroup?defenceGroupId=${defenceGroupId}`, {})
    showDefenceGroupDialog.value = false
}

const readyDuplicate = () => {
    webApi.get('/student/readyForDuplicate', {})
}


</script>
<style>
.thesis {
    width: 80vw;
}

.collapse {
    min-width: 80vw;
    text-align: left;
}

.timeline {
    padding-left: 0;
    padding-top: 5px;
}
</style>