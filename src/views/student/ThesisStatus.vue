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
            nominalTutorId: student.nominalTutor?.teacherId,
            nominalTutorName: student.nominalTutor?.name,
            academicTutorId: student.academicTutor?.teacherId,
            academicTutorName: student.academicTutor?.name,
        }]" v-if="student.studentId" style="width: 90vw">
            <el-table-column prop="nominalTutorId" label="挂名导师工号" width="200" />
            <el-table-column prop="nominalTutorName" label="挂名导师姓名" width="200" />
            <el-table-column prop="academicTutorId" label="学业导师工号" width="200" />
            <el-table-column prop="academicTutorName" label="学业导师姓名" />
        </el-table>
        <el-table v-if="student.studentId" :data="[{}]" style="width: 90vw">
            <el-table-column label="流程状态">
                <template #default>
                    <el-tag type="warning">{{ flowStatus }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <!-- 若存在defence信息，则显示 -->
        <!-- <el-table v-if="student.flow?.defenceGroup" :data="[{}]" style="width: 90vw">
            <el-table-column label="答辩组信息">
                <template #default>
                    <el-tag type="warning" round>{{ student.flow?.defenceGroup?.chairman?.name }}</el-tag>
                    <el-tag type="warning" round>{{ student.flow?.defenceGroup?.secretary?.name }}</el-tag>
                    <el-tag type="warning" round>{{ student.flow?.defenceGroup?.defencePlace }}</el-tag>
                    <el-tag type="warning" round>{{ student.flow?.defenceGroup?.defenceTime }}</el-tag>
                </template>
            </el-table-column>
        </el-table> -->
    </el-card>
    <div style="margin-top: 20px;"></div>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-popconfirm width="300" title="发起评审后将会重置流程，确认发起？" @confirm="() => requestAudit()">
            <template #reference>
                <el-button>发起评审</el-button>
            </template>
        </el-popconfirm>
        <el-button v-if="flowHistories.length" @click="() => toPage('uploadthesis')"> 上传论文 </el-button>
    </el-card>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-collapse class="collapse" v-model="index" accordion>
            <el-collapse-item name="1">
                <el-timeline class="timeline">
                    <el-timeline-item center v-for="history, index in flowHistories" :key="index"
                        :timestamp="history.operateTime">
                        <el-card shadow="always" body-style="padding:10px 20px">
                            <!-- 显示历史记录里的操作，操作人 -->
                            <div style="display: flex; justify-content: space-between;align-items: center;">
                                <div style="width:400px">
                                    <el-text size="large" tag="b">{{ history.operation }}</el-text>
                                    <div>
                                        <el-tag type="warning" v-if="history.score && history.score == 59">需修改</el-tag>
                                    </div>
                                    <div>
                                        <el-text size="default" tag="b"> {{
                                            history.comment ? '评语：' + history.comment : ''
                                        }}</el-text>
                                    </div>
                                </div>
                                <div>
                                    <el-button plain disabled> {{ history.pass }} </el-button>
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
        <el-button style="margin:5px 5px" type="primary" @click="() => joinDefence()" disabled> 确认参加答辩 </el-button>
        <el-button style="margin:5px 5px" type="warning" @click="() => showDefenceGroupDialog = true" disabled> 选择答辩组 </el-button>
        <el-button style="margin:5px 5px" type="warning" @click="() => readyDuplicate()" disabled> 查重准备就绪 </el-button>
    </el-card>

    <!-- 弹窗，用于更换答辩组 -->
    <!-- <el-dialog title="选择答辩组" v-model="showDefenceGroupDialog" style="width: 80vw;">
        <el-table :data="defenceGroupInfos" style="width: 90vw">
            <el-table-column prop="chairman.name" label="主席" width="150" />
            <el-table-column prop="secretary.name" label="秘书" width="150" />
            <el-table-column prop="defencePlace" label="答辩地点" width="150" />
            <el-table-column prop="defenceTime" label="答辩时间" />
            <el-table-column width="150" label="容量">
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
    </el-dialog> -->
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue'
import { StudentInfo } from '~/entity/base/Student';
import webApi from '~/util/webApi';
import { FlowHistoryRes, History, StudentInfoRes } from '~/util/webRes';
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
        academicTutor: null,
        nominalTutor: null,
        role: [],
    }
)

const flowHistories: History[] = reactive([])
const flowStatus = ref('')
setTimeout(() => {
    webApi.get<StudentInfoRes>('/student/getStudentInfo', {}).then(res => {
        const data = res.data
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
    webApi.get<FlowHistoryRes>('/student/getFlowHistory', {}).then(res => {
        flowHistories.push(...res.data.histories)
        flowStatus.value = res.data.status
    })
}, 1150)

const requestAudit = () => {
    webApi.post('/student/request', {}).then(() => {
        toPage('uploadthesis')
        ElMessage({
            message: '发起评审成功',
            type: 'success'
        })
    })
}

// const joinDefence = () => {
//     webApi.get('/student/readyForDefence', {})
// }

// const showDefenceGroupDialog = ref(false);
// const defenceGroupInfos: Ref<DefenceInfo[]> = ref([]);
// webApi.post<GetDefenceGroupsRes>('/getDefenceGroupInfo', {}).then(res => {
//     defenceGroupInfos.value = res.data.data;
// });
// const chooseDefenceGroup = (defenceGroupId: number) => {
//     webApi.post(`/student/chooseDefenceGroup?defenceGroupId=${defenceGroupId}`, {})
//     showDefenceGroupDialog.value = false
// }

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