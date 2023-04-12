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
                    <el-radio label="全部" border @click="() => search()"></el-radio>
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
            <el-table :data="[flow]" style="width: 90vw">
                <el-table-column prop="id" label="ID" width="100" />
                <el-table-column label="学号" width="150">
                    <template #default>
                        {{ useAuthStore().roles.includes(Role.ACADEMIC_REGISTRY) ? flow.studentId : "***" }}
                    </template>
                </el-table-column>
                <el-table-column label="姓名" width="150">
                    <template #default>
                        {{ useAuthStore().roles.includes(Role.ACADEMIC_REGISTRY) ? flow.studentName : "***" }}
                    </template>
                </el-table-column>
                <el-table-column label="论文名称" width="200">
                    <template #default>
                        {{ flow.thesisName }}
                    </template>
                </el-table-column>
                <el-table-column label="流程状态">
                    <template #default>
                        <el-tag type="warning" round>{{ flow.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default>
                        <!-- 审核操作，点击后还将显示出弹窗，选择审核类型、是否通过，并填写score和comment -->
                        <el-button type="warning" plain round v-if="
                            flow.status === FlowStatus.FLOW_START || flow.status === FlowStatus.THESIS_AUDIT"
                            @click="() => openAudit(flow.id!)">审核</el-button>
                        <div v-else style="display: flex;align-items: center;">
                            <el-button type="warning" plain round :disabled="true"
                                @click="() => (showAuditDialog = true) && (currentFlowId = flow.id!)">审核</el-button>
                            <div style="margin-left: 10px;">(您无需操作)</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="[{}]" style="width: 90vw">
                <!-- <el-table-column>
                    <template #default>
                        <el-button :icon="Download" @click="() => download(flow.id!, false)">下载论文</el-button>
                    </template>
                </el-table-column> -->
                <el-table-column align="center">
                    <template #default>
                        <el-button :icon="Download" @click="() => download(flow.id!, true)">下载匿名论文</el-button>
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
    <div v-if="flows.length == 0">
        <el-empty :image-size="200" description="暂无任务" />
    </div>

    <!-- 弹窗，用于更换内审教师 -->
    <el-dialog title="更换内审教师" v-model="showInnerAuditorDialog" style="overflow-y: scroll;height: 50vh;">
        <el-input v-model="searchInner"></el-input>
        <el-table :data="innerAuditorInfos.filter(i => JSON.stringify(i).includes(searchInner))" style="width: 90vw">
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
    <el-dialog title="更换外审老师1" v-model="showOuterAuditorDialog1" style="overflow-y: scroll;height: 50vh;">
        <el-input v-model="searchOuter1"></el-input>
        <el-table :data="outerAuditorInfos.filter(i => JSON.stringify(i).includes(searchOuter1))" style="width: 90vw">
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
    <el-dialog title="更换外审老师2" v-model="showOuterAuditorDialog2" style="overflow-y: scroll;height: 50vh;">
        <el-input v-model="searchOuter2"></el-input>
        <el-table :data="outerAuditorInfos.filter(i => JSON.stringify(i).includes(searchOuter2))" style="width: 90vw">
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
    <el-dialog title="更换答辩组" v-model="showDefenceGroupDialog" style="width: 80vw;overflow-y: scroll;height: 50vh;">
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
            <el-form-item label="评审类型">
                <el-select v-model="verifyForm.auditType" disabled>
                    <el-option label="确认" value="TEACHER_VERIFY"></el-option>
                    <el-option label="内审" value="INNER_AUDIT"></el-option>
                    <el-option label="外审" value="OUTER_AUDIT"></el-option>
                    <el-option label="答辩" value="ORAL_DEFENCE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核结果">
                <el-radio-group v-model="verifyForm.pass" :fill="verifyForm.pass ? '' : '#E93027'">
                    <el-radio-button :label="true">通过</el-radio-button>
                    <el-radio-button :label="false">不通过</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="审核补充">
                <el-radio-group v-model="verifyForm.score" :fill="verifyForm.score == 59 ? '#FFD662' : '#0097FF'">
                    <el-radio-button size="small" :label="59">需修改</el-radio-button>
                    <el-radio-button size="small" :label="60">无需修改</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="评审意见" v-if="flows.find(i => i.id == currentFlowId)?.status != FlowStatus.FLOW_START">
                <el-input type="textarea" :autosize="{ minRows: 8 }" v-model="verifyForm.comment" />
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



//搜索，用于弹窗内部搜索
const searchInner = ref('')
const searchOuter1 = ref('')
const searchOuter2 = ref('')

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

//打开审核窗口
const openAudit = (flowId: string | number) => {
    showAuditDialog.value = true;
    currentFlowId.value = flowId;

    const flow = flows.find(i => i.id == currentFlowId.value)
    const tId = useAuthStore().teacherId;
    switch (flow?.status) {
        case FlowStatus.FLOW_START:
            verifyForm.auditType = "TEACHER_VERIFY";
            break;
        case FlowStatus.THESIS_AUDIT:
            if (flows.find(i => i.id == flowId)?.innerAuditor?.teacherId == tId) {
                verifyForm.auditType = "INNER_AUDIT";
                break;
            } else if (flow.outerAuditor1?.teacherId == tId || flow.outerAuditor2?.teacherId == tId) {
                verifyForm.auditType = "OUTER_AUDIT";
                break;
            }
        case FlowStatus.WAIT_STUDENT_CONFIRM_ORAL_DEFENSE:
            verifyForm.auditType = "ORAL_DEFENCE"
            break;
    }
}

//更新流程信息
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
            case "INNER_AUDIT":
                search(FlowStatus.THESIS_AUDIT, null, 'inner')
                break
            case "OUTER_AUDIT":
                search(FlowStatus.THESIS_AUDIT, null, 'outer')
                break
            case "TEACHER_VERIFY":
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