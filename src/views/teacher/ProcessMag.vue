<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <h2 style="color:#606266">流程管理</h2>
    </div>
    <div style="margin: 30px 0;width: 1100px;">
        <el-row :gutter="20">
            <el-col :span="4">
                <el-input v-model="studentId" placeholder="学号"></el-input>
            </el-col>
            <el-col :span="3">
                <el-button @click="() => search(undefined, studentId)">搜索</el-button>
            </el-col>
            <el-col :span="13">
                <!-- 根据流程状态显示筛选 -->
                <el-radio-group v-model="flowStatusFifter">
                    <el-radio v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)" label="全部" border
                        @click="() => search()"></el-radio>
                    <el-radio label="待确认" border @click="() => search(FlowStatus.FLOW_START, null, 'verify')"></el-radio>
                    <el-radio label="待内审" border @click="() => search(FlowStatus.THESIS_AUDIT, null, 'inner')"></el-radio>
                    <el-radio label="待外审" border @click="() => search(FlowStatus.THESIS_AUDIT, null, 'outer')"></el-radio>
                </el-radio-group>
            </el-col>
        </el-row>
    </div>
    <div style="margin: 30px 0;width: 87vw;">

    </div>

    <div v-for="flow in flows"
        style="border: 1px solid #999999;padding:1px 30px 20px 30px;margin-bottom: 10px;border-radius: 15px;">
        <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left">学生信息</h3>
        <el-card v-if="flow.id" body-style="width:85vw">
            <el-table :data="[{ id: flow.studentId, name: flow.studentName }]" style="width: 90vw">
                <el-table-column prop="id" label="学号" width="200" />
                <el-table-column prop="name" label="姓名" width="200" />
                <el-table-column label="流程状态">
                    <template #default>
                        <el-tag type="warning" round>{{ flow.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default>
                        <!-- 审核操作，点击后还将显示出弹窗，选择审核类型、是否通过，并填写score和comment -->
                        <el-button type="primary" plain round size="small"
                            @click="() => (showAuditDialog = true) && (currentFlowId = flow.id!)">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="[{}]" style="width: 90vw">
                <!-- <el-table-column>
                    <template #default>
                        <el-button :icon="Download" @click="() => download(flow.id!, false)">下载论文</el-button>
                    </template>
                </el-table-column> -->
                <el-table-column>
                    <template #default>
                        <el-button :icon="Download" @click="() => download(flow.id!, true)">下载匿名论文</el-button>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default>
                        <el-button :icon="Upload" v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)"
                            @click="() => (showUploadReportDialog = true) && (currentFlowId = flow.id!)">上传查重报告</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 暂无学生与流程的信息 -->
        <el-card body-style="width:85vw" v-else>
            <div style="display: flex;justify-content: center;align-items: center;height: 50px;">
                <h4 style="color:#606266">暂无匹配的学生与流程的信息</h4>
            </div>
        </el-card>

        <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left"
            v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)">关联教师</h3>
        <el-card body-style="width:85vw" v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)">
            <el-table v-if="flow.verifier" style="width: 90vw"
                :data="[flow.verifier, flow.innerAuditor, flow.outerAuditor1, flow.outerAuditor2]">
                <el-table-column prop="teacherId" label="工号" width="150" />
                <el-table-column prop="name" label="教师姓名" width="150" />
                <el-table-column label="身份" width="150">
                    <template #default="{ $index }">
                        {{ $index == 0 ? '确认老师' : $index == 1 ? '内审老师' : '外审老师' }}
                    </template>
                </el-table-column>
                <el-table-column prop="schoolName" label="学校" />
                <el-table-column prop="departmentName" label="学院" />
                <el-table-column prop="phoneNumber" label="电话" width="150" />
                <el-table-column prop="emailAddress" label="邮箱" width="170" />
                <el-table-column>
                    <template #default="{ $index }">
                        <el-button type="warning" plain round size="small" v-if="$index !== 0"
                            @click="() => changeTeacher($index, flow.id!)">更换</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left"
            v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)">答辩信息</h3>
        <el-card body-style="width:85vw" style="margin-bottom: 30px;" v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)">
            <div style="display:flex;justify-content: flex-end;">
                <el-button type="warning" plain @click="() => changeTeacher(4, flow.id!)">更换答辩组</el-button>
            </div>
            <el-table v-if="flow.defenceGroup"
                :data="[flow.defenceGroup?.chairman, flow.defenceGroup?.secretary, ...flow.defenceGroup!.committee]"
                style="width: 90vw">
                <el-table-column prop="name" label="教师姓名" width="150" />
                <el-table-column label="身份" width="150">
                    <template #default="{ $index }">
                        {{ $index == 0 ? '主席' : $index == 1 ? '秘书' : '委员' }}
                    </template>
                </el-table-column>
                <el-table-column prop="schoolName" label="学校" />
                <el-table-column prop="departmentName" label="学院" />
                <el-table-column prop="phoneNumber" label="电话" width="150" />
                <el-table-column prop="emailAddress" label="邮箱" width="170" />
            </el-table>
        </el-card>
    </div>

    <!-- 弹窗，用于更换内审教师 -->
    <el-dialog title="更换内审教师" v-model="showInnerAuditorDialog">
        <el-table :data="innerAuditorInfos" style="width: 90vw">
            <el-table-column prop="teacherId" label="工号" width="110" />
            <el-table-column prop="name" label="教师姓名" width="150" />
            <el-table-column prop="schoolName" label="学校" />
            <el-table-column prop="departmentName" label="学院" />
            <el-table-column width="80">
                <template #default="{ row }">
                    <el-button type="warning" plain round size="small" @click="() => updateFlow('i', row.id)">指定</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>

    <!-- 弹窗，用于更换外审教师1 -->
    <el-dialog title="更换外审老师1" v-model="showOuterAuditorDialog1">
        <el-table :data="outerAuditorInfos" style="width: 90vw">
            <el-table-column prop="teacherId" label="工号" width="110" />
            <el-table-column prop="name" label="教师姓名" width="150" />
            <el-table-column prop="schoolName" label="学校" />
            <el-table-column prop="departmentName" label="学院" />
            <el-table-column width="80">
                <template #default="{ row }">
                    <el-button type="warning" plain round size="small"
                        @click="() => updateFlow('oa', row.id)">指定</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>

    <!-- 弹窗，用于更换外审教师2 -->
    <el-dialog title="更换外审老师2" v-model="showOuterAuditorDialog2">
        <el-table :data="outerAuditorInfos" style="width: 90vw">
            <el-table-column prop="teacherId" label="工号" width="110" />
            <el-table-column prop="name" label="教师姓名" width="150" />
            <el-table-column prop="schoolName" label="学校" />
            <el-table-column prop="departmentName" label="学院" />
            <el-table-column width="80">
                <template #default="{ row }">
                    <el-button type="warning" plain round size="small"
                        @click="() => updateFlow('ob', row.id)">指定</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>

    <!-- 弹窗，用于更换答辩组 -->
    <el-dialog title="更换答辩组" v-model="showDefenceGroupDialog" style="width: 80vw;">
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
                    <el-button type="warning" plain round size="small" @click="() => updateFlow('d', row.id)">指定</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>

    <!-- 弹窗，选择审核类型、是否通过，并填写score和comment -->
    <el-dialog title="审核" v-model="showAuditDialog">
        <el-form :model="verifyForm" label-width="80px">
            <el-form-item label="审核类型">
                <el-select v-model="verifyForm.auditType" placeholder="请选择">
                    <el-option v-if="flows.find(i => i.id == currentFlowId)?.status == FlowStatus.FLOW_START" label="确认"
                        value="TEACHER_VERIFY"></el-option>
                    <el-option v-if="flows.find(i => i.id == currentFlowId)?.status == FlowStatus.THESIS_AUDIT &&
                        flows.find(i => i.id == currentFlowId)?.innerAuditor?.teacherId == useAuthStore().teacherId"
                        label="内审" value="INNER_AUDIT"></el-option>
                    <el-option
                        v-if="flows.find(i => i.id == currentFlowId)?.status == FlowStatus.THESIS_AUDIT &&
                            (flows.find(i => i.id == currentFlowId)?.outerAuditor1?.teacherId == useAuthStore().teacherId ||
                                flows.find(i => i.id == currentFlowId)?.outerAuditor2?.teacherId == useAuthStore().teacherId)"
                        label="外审" value="OUTER_AUDIT"></el-option>
                    <el-option label="答辩"
                        v-if="flows.find(i => i.id == currentFlowId)?.status == FlowStatus.WAIT_STUDENT_CONFIRM_ORAL_DEFENSE"
                        value="ORAL_DEFENCE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核结果">
                <el-radio-group v-model="verifyForm.pass">
                    <el-radio-button :label="true">通过</el-radio-button>
                    <el-radio-button :label="false">不通过</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="审核结果">
                <el-radio-group v-model="verifyForm.score">
                    <el-radio :label="59">需修改</el-radio>
                    <el-radio :label="60">无需修改</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="评语">
                <el-input type="textarea" v-model="verifyForm.comment" />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="() => showAuditDialog = false">取消</el-button>
            <el-button type="primary" @click="() => verify()">确定</el-button>
        </span>
    </el-dialog>

    <!-- 弹窗，用于上传查重报告 -->
    <el-dialog title="上传查重报告" v-model="showUploadReportDialog">
        <el-form label-width="150">
            <el-form-item label="学号">
                <el-input style="width: 60%;" v-model="studentIdInput" placeholder="请确认学号">
                    <template #suffix>
                        <el-icon v-if="studentIdInput !== flows.find(i => i.id == currentFlowId)?.studentId">
                            <WarningFilled />
                        </el-icon>
                        <el-icon v-else>
                            <CircleCheckFilled />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="查重率">
                <el-input-number style="width: 30%;" :precision="2" :min="0" :max="100" v-model="duplicateRate"
                    controls-position="right"></el-input-number>
            </el-form-item>
        </el-form>
        <div style="color:red">*校验学号并输入查重率即可直接上传</div>
        <el-upload v-model="fileList" class="upload-demo"
            :action="`${webApi.axios.defaults.baseURL}/upload/duplicateReport?id=${currentFlowId!}&duplicateRate=${duplicateRate}`"
            :headers="{
                token: useAuthStore().token, 'Content-Type': 'application/json'
            }" :limit="1" multiple :data="{ duplicateRate: duplicateRate }"
            :disabled="!(studentIdInput == (flows.find(i => i.id == currentFlowId)?.studentId) && duplicateRate > 0)">
            <el-button :icon="Upload"
                :disabled="!(studentIdInput == (flows.find(i => i.id == currentFlowId)?.studentId) && duplicateRate > 0)">上传查重报告</el-button>
        </el-upload>
    </el-dialog>
</template>

<script lang="ts" setup>
import { Ref, ref, reactive } from 'vue'
import { DefenceInfo } from '~/entity/base/Defence';
import { ProcessDetail } from '~/entity/base/Process';
import { TeacherInfo } from '~/entity/base/Teacher';
import { FlowStatus } from '~/entity/enum/Flow';
import { Role } from '~/entity/enum/Role';
import webApi from '~/util/webApi';
import { GetDefenceGroupsRes, GetFlowDetailRes, GetTeacherInfoRes } from '~/util/webRes';
import { Download, Upload, WarningFilled, CircleCheckFilled } from '@element-plus/icons-vue';
import { useAuthStore } from '~/store/authStore';
import { ElMessage } from 'element-plus';


const flows: ProcessDetail[] = reactive([])
const flowStatusFifter = ref('全部')
const studentId: Ref<string> = ref('')
const fileList = ref([])
const currentFlowId = ref<string | number>()


//触发search事件，搜索流程信息
const search = (type?: FlowStatus, studentId?: string | null, auditType?: 'inner' | 'outer' | 'verify') => {
    let fifter: any = {};
    if (type) fifter.flowStatus = type;
    if (studentId) fifter.studentId = studentId;

    switch (auditType) {
        case 'inner':
            fifter.innerAuditorId = useAuthStore().teacherId
            break;
        case 'outer':
            fifter.outerAuditorId = useAuthStore().teacherId
            break;
        case 'verify':
            fifter.verifierId = useAuthStore().teacherId
            break;
    }

    webApi.post<GetFlowDetailRes>('/getFlowInfo', fifter).then(res => {
        while (flows.length) flows.pop()
        flows.push(...res.data.data)
    })
}

setTimeout(() => { ElMessage.success('加载完毕'); search() }, 850)


//触发download事件，下载文件
const download = (id: number, anonymous: boolean) => {
    webApi.axios({
        method: "GET",
        url: `/getThesis?id=${id}&anonymous=${anonymous}`,
        responseType: "blob",
        headers: {
            token: useAuthStore().token
        }
    })
        .then(res => {
            let blob = new Blob([res.data], {
                type: "application/pdf" //这里需要根据不同的文件格式写不同的参数
            });
            let eLink = document.createElement("a");

            const thesisName = flows.find(i => i.id == id)?.thesisName!

            eLink.setAttribute("target", "_blank")
            eLink.style.display = "none";
            eLink.download = thesisName;
            eLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eLink);
            eLink.click();
            URL.revokeObjectURL(eLink.href);
            document.body.removeChild(eLink);
        })
}

const changeTeacher = (index: number, flowId: string | number) => {
    currentFlowId.value = flowId;
    switch (index) {
        case 1:
            showInnerAuditorDialog.value = true
            break
        case 2:
            showOuterAuditorDialog1.value = true
            break
        case 3:
            showOuterAuditorDialog2.value = true
            break
        case 4:
            showDefenceGroupDialog.value = true
            break
    }
}

const updateFlow = (type: 'i' | 'oa' | 'ob' | 'd', teacherId: string) => {
    const flow = flows.find(f => String(f.id) == String(currentFlowId.value))!
    const form = {
        id: flow.id,
        innerAuditorId: flow.innerAuditor?.id,
        outerAuditorId1: flow.outerAuditor1?.id,
        outerAuditorId2: flow.outerAuditor2?.id,
        defenceGroupId: flow.defenceGroup?.id,
    }
    switch (type) {
        case 'i':
            form.innerAuditorId = Number(teacherId)
            break
        case 'oa':
            form.outerAuditorId1 = Number(teacherId)
            break
        case 'ob':
            form.outerAuditorId2 = Number(teacherId)
            break;
        case 'd':
            form.defenceGroupId = String(teacherId)
            break;
    }
    webApi.post('/reassignFlow', form).then(res => {
        if (res) {
            ElMessage(JSON.stringify(res))
            webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', { role: [Role.INNER_AUDITOR] }).then(res => {
                innerAuditorInfos.value = res.data.data;
            });
            webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', { role: [Role.OUTER_AUDITOR] }).then(res => {
                outerAuditorInfos.value = res.data.data;
            });
            webApi.post<GetDefenceGroupsRes>('/getDefenceGroupInfo', {}).then(res => {
                defenceGroupInfos.value = res.data.data;
            });
            search()
            showInnerAuditorDialog.value = false
            showOuterAuditorDialog1.value = false
            showOuterAuditorDialog2.value = false
        } else {
            alert('更换失败！')
        }
    })
}

const showInnerAuditorDialog: Ref<boolean> = ref(false)
const innerAuditorInfos: Ref<TeacherInfo[]> = ref([]);
webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', { role: [Role.INNER_AUDITOR] }).then(res => {
    innerAuditorInfos.value = res.data.data;
});

const showOuterAuditorDialog1: Ref<boolean> = ref(false)
const showOuterAuditorDialog2: Ref<boolean> = ref(false)

const outerAuditorInfos: Ref<TeacherInfo[]> = ref([]);
webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', { role: [Role.OUTER_AUDITOR] }).then(res => {
    outerAuditorInfos.value = res.data.data;
});

const showDefenceGroupDialog: Ref<boolean> = ref(false)
const defenceGroupInfos: Ref<DefenceInfo[]> = ref([]);
webApi.post<GetDefenceGroupsRes>('/getDefenceGroupInfo', {}).then(res => {
    console.log(res.data.data)
    defenceGroupInfos.value = res.data.data;
});

//审核相关
const showAuditDialog: Ref<boolean> = ref(false);
const verifyForm: any = reactive({
    flowId: null,
    auditType: '',
    pass: true,
    score: 60,
    comment: '',
})

const verify = () => {
    verifyForm.flowId = String(currentFlowId.value);
    webApi.post('/audit', verifyForm).then((res) => {
        ElMessage(JSON.stringify(res))
        switch (verifyForm.auditType) {
            case 'inner':
                search(FlowStatus.THESIS_AUDIT, null, 'inner')
                break
            case 'outer':
                search(FlowStatus.THESIS_AUDIT, null, 'outer')
                break
            case 'verify':
                search(FlowStatus.FLOW_START, null, 'verify')
                break;
            default:
                search()
                break;
        }
        showAuditDialog.value = false;
    }).catch(err => {
        alert(JSON.stringify(err))
    })
}

const showUploadReportDialog = ref(false)
const studentIdInput = ref()
const duplicateRate = ref(0)
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