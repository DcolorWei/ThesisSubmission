<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90vw;display: flex; align-items:flex-end;">
        <h2 style="color:#606266">流程管理</h2>
    </div>
    <div
        style="margin: 10px 0;width: 80vw;display: flex;justify-content: space-around;align-items: center;flex-wrap: wrap;">
        <div style="margin-bottom: 2vh;display: flex; justify-content: space-around;align-items: center; width: 360px;">
            <el-input v-model="personFifter" placeholder="搜索姓名/学号/相关信息" style="width: 220px;" />
            <el-button :icon="Search" type="success" plain circle />
        </div>
        <!-- 根据流程状态显示筛选 -->
        <el-radio-group v-model="flowStatusFifter"
            style="margin-bottom: 2vh;width: 360px;display: flex; justify-content: space-between;align-items: center;flex-wrap: wrap;">
            <el-radio style="margin-bottom: 10px;" label="全部" v-if="userInfo.roled(Role.ACADEMIC_REGISTRY)" border
                @click="() => { if (flowStatusFifter !== '全部') search() }"></el-radio>
            <el-radio style="margin-bottom: 10px;" label="待确认" v-if="userInfo.roled(Role.ACADEMIC_TUTOR)" border
                @click="() => { if (flowStatusFifter !== '待确认') search(FlowStatus.FLOW_START, null, 'verify') }"></el-radio>
            <el-radio style="margin-bottom: 10px;" label="待内审" v-if="userInfo.roled(Role.INNER_AUDITOR)" border
                @click="() => { if (flowStatusFifter !== '待内审') search(FlowStatus.THESIS_AUDIT, null, 'inner') }"></el-radio>
            <el-radio style="margin-bottom: 10px;" label="待外审" v-if="userInfo.roled(Role.OUTER_AUDITOR)" border
                @click="() => { if (flowStatusFifter !== '待外审') search(FlowStatus.THESIS_AUDIT, null, 'outer') }"></el-radio>
            <el-radio style="margin-bottom: 10px;" label="已过审" v-if="userInfo.roled(Role.ACADEMIC_REGISTRY)" border
                @click="() => { if (flowStatusFifter !== '已过审') search(FlowStatus.AUDIT_PASSED, null, null) }"></el-radio>
        </el-radio-group>

        <div>
            <el-button :icon="Upload" v-if="userInfo.roled(Role.ACADEMIC_REGISTRY)" style="width:140px" type="warning" plain
                @click="() => exportAudit()">导出评审信息</el-button>
            <el-button :icon="Download" v-if="userInfo.roled(Role.ACADEMIC_REGISTRY)" style="width:140px" type="success"
                plain
                @click="() => downloadMul(false, flowsFilter.filter(i => i.status === FlowStatus.AUDIT_PASSED).map(i => i.id))">下载已通过论文</el-button>
        </div>
    </div>

    <div style="display:flex;align-items: center;margin:10px auto">
        <el-button :icon="ArrowLeft" color="#fff" style="border:1px solid #efefef"
            @click="() => flowIndex > 0 ? flowIndex-- : null" />
        <div style="margin: 0 2vh;">{{ flowsFilter.length && flowIndex + 1 }} / {{ flowTotal }}</div>
        <el-button :icon="ArrowRight" color="#fff" style="border:1px solid #efefef"
            @click="() => flowIndex < flowsFilter.length - 1 ? flowIndex++ : null" />
    </div>
    <div v-for="   flow    in    flowsFilter.slice(flowIndex, flowIndex + pagesize)   "
        style="border: 1px solid #999999;padding:1px 1.5vw  1.0vw 1.5vw;margin-bottom: 10px;border-radius: 15px;">
        <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left">学生信息</h3>
        <el-card v-if="flow.id" body-style="width:85vw">
            <el-table :data="[flow]" style="width: 90vw">
                <el-table-column prop="id" label="ID" width="100" />
                <el-table-column label="学号" width="150">
                    <template #default>
                        {{ userInfo.roles.includes(Role.ACADEMIC_REGISTRY) ? flow.studentId : "***" }}
                    </template>
                </el-table-column>
                <el-table-column label="姓名" width="150">
                    <template #default>
                        {{ userInfo.roles.includes(Role.ACADEMIC_REGISTRY) ? flow.studentName : "***" }}
                    </template>
                </el-table-column>
                <el-table-column label="论文名称" width="200">
                    <template #default>
                        {{ flow.thesisName || '(未上传)' }}
                    </template>
                </el-table-column>
                <el-table-column label="流程状态">
                    <template #default>
                        <el-tag type="warning" round>{{ flow.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column v-if="flowStatusFifter !== '全部'">
                    <!-- 审核操作，点击后还将显示出弹窗，选择审核类型、是否通过，并填写score和comment -->
                    <el-button type="warning" plain round
                        @click="() => openAudit(flowsFilter[flowIndex].id!)">审核</el-button>
                    <!-- <div v-else style="display: flex;align-items: center;">
                        <el-button type="warning" plain round :disabled="true"
                            @click="() => (showAuditDialog = true) && (currentFlowId = flow.id!)">审核</el-button>
                        <div style="margin-left: 10px;">(您无需操作)</div>
                    </div> -->
                </el-table-column>
            </el-table>
            <el-table :data="[{}]" style="width: 90vw">
                <el-table-column align="center">
                    <el-button v-if="flow.thesisName" :icon="Download" @click="() => download(false)">下载匿名论文</el-button>
                    <el-button :icon="Upload" v-if="flow.thesisName && userInfo.roled(Role.ACADEMIC_REGISTRY)"
                        @click="() => showUploadReportDialog = true">上传查重报告</el-button>
                    <el-button :icon="Delete" v-if="userInfo.roled(Role.ACADEMIC_REGISTRY)" type="danger" plain
                        @click="() => deleteFlow(flowsFilter[flowIndex].id)">强行终止流程</el-button>
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
            v-if="userInfo.roled(Role.ACADEMIC_REGISTRY)">关联教师</h3>
        <el-card body-style="width:85vw" v-if="userInfo.roled(Role.ACADEMIC_REGISTRY)">
            <el-table style="width: 90vw"
                :data="[flow.verifier, flow.innerAuditor, flow.outerAuditor1, flow.outerAuditor2]">
                <el-table-column prop="teacherId" label="工号" width="150" />
                <el-table-column prop="name" label="教师姓名" />
                <el-table-column label="身份" width="110">
                    <template #default="{ $index }">
                        {{ $index == 0 ? '确认老师' : $index == 1 ? '内审老师' : '外审老师' }}
                    </template>
                </el-table-column>
                <el-table-column prop="schoolName" label="学校" width="150" />
                <el-table-column prop="departmentName" label="学院" width="150" />
                <el-table-column prop="phoneNumber" label="电话" width="150" />
                <el-table-column>
                    <template #default="{ $index }">
                        <!-- <el-tag v-if="$index == 0" :type="flowsFilter[flowIndex].verifierPass ? 'success' : 'danger'">
                            {{ flowsFilter[flowIndex].verifierPass ? 'pass' : 'fail' }}
                        </el-tag> -->
                        <el-tag v-if="$index == 0 && flowsFilter[flowIndex]?.verifier"
                            :type="flowsFilter[flowIndex].verifyPass == true ? 'success' : flowsFilter[flowIndex].verifyPass == false ? 'danger' : 'warning'">
                            {{ flowsFilter[flowIndex].verifyPass == true ? 'pass' : flowsFilter[flowIndex].verifyPass ==

                                false ? 'fail' : 'waiting' }}
                        </el-tag>
                        <el-tag v-else-if="$index == 1 && flowsFilter[flowIndex]?.innerAuditor"
                            :type="flowsFilter[flowIndex].innerPass == true ? 'success' : flowsFilter[flowIndex].innerPass == false ? 'danger' : 'warning'">
                            {{ flowsFilter[flowIndex].innerPass == true ? 'pass' : flowsFilter[flowIndex].innerPass ==
                                false ? 'fail' : 'waiting' }}
                        </el-tag>
                        <el-tag v-else-if="$index == 2 && flowsFilter[flowIndex]?.outerAuditor1"
                            :type="flowsFilter[flowIndex].outerPass1 == true ? 'success' : flowsFilter[flowIndex].outerPass1 == false ? 'danger' : 'warning'">
                            {{ flowsFilter[flowIndex].outerPass1 == true ? 'pass' : flowsFilter[flowIndex].outerPass1 ==
                                false ? 'fail' : 'waiting' }}
                        </el-tag>
                        <el-tag v-else-if="$index == 3 && flowsFilter[flowIndex]?.outerAuditor2"
                            :type="flowsFilter[flowIndex].outerPass2 == true ? 'success' : flowsFilter[flowIndex].outerPass2 == false ? 'danger' : 'warning'">
                            {{ flowsFilter[flowIndex].outerPass2 == true ? 'pass' : flowsFilter[flowIndex].outerPass2 ==
                                false ? 'fail' : 'waiting' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default="{ $index }">
                        <el-button type="warning" plain round size="small" v-if="$index !== 0"
                            @click="() => changeTeacher($index, flow.id!)">更换</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left"
            v-if="userInfo.roled(Role.ACADEMIC_REGISTRY)">答辩信息</h3>
        <el-card body-style="width:85vw" style="margin-bottom: 30px;" v-if="userInfo.roled(Role.ACADEMIC_REGISTRY)">
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
    <el-dialog :title="'审核 ' + flowsFilter.find(i => i.id == verifyForm.flowId)?.studentName" v-model="showAuditDialog"
        style="min-width: 380px">
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
                    <el-radio-button :label="false" style="width:100px">不通过</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="审核补充" v-if="verifyForm.auditType != 'TEACHER_VERIFY'">
                <el-radio-group v-model="verifyForm.score" :fill="verifyForm.score == 59 ? '#FFD662' : '#0097FF'">
                    <el-radio-button size="small" :label="59">需修改</el-radio-button>
                    <el-radio-button size="small" :label="60">无需修改</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="评审意见" v-if="verifyForm.auditType != 'TEACHER_VERIFY'">
                <el-input type="textarea" :autosize="{ minRows: 8 }" v-model="verifyForm.comment" placeholder="在此输入评审意见" />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="() => showAuditDialog = false" style="width:100px">暂存并返回</el-button>
            <el-button type="primary" @click="() => verify()" style="width:100px">确定提交</el-button>
        </span>
    </el-dialog>

    <!-- 弹窗，用于上传查重报告 -->
    <el-dialog title="上传查重报告" v-model="showUploadReportDialog">
        <el-form label-width="150">
            <el-form-item label="学号">
                <el-input style="width: 60%;" v-model="studentIdInput" placeholder="请确认学号">
                    <template #suffix>
                        <el-icon v-if="studentIdInput !== flows.find(i => i.id == flowsFilter[flowIndex].id)?.studentId">
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
            :action="`${webApi.axios.defaults.baseURL}/upload/duplicateReport?id=${flowsFilter[flowIndex].id}&duplicateRate=${duplicateRate}`"
            :headers="{
                token: userInfo.token,
            }
                " :limit="1" multiple
            :disabled="!(studentIdInput == (flows.find(i => i.id == flowsFilter[flowIndex].id)?.studentId) && duplicateRate > 0)"
            :before-upload="(e) => showRollback(e)">
            <el-button :icon="Upload"
                :disabled="!(studentIdInput == (flows.find(i => i.id == flowsFilter[flowIndex].id)?.studentId) && duplicateRate > 0)">上传查重报告</el-button>
        </el-upload>
    </el-dialog>
</template>

<script lang="ts" setup>
import { Ref, ref, reactive, watch } from 'vue'
import { DefenceInfo } from '~/entity/base/Defence';
import { ProcessDetail } from '~/entity/base/Process';
import { TeacherInfo } from '~/entity/base/Teacher';
import { FlowStatus } from '~/entity/enum/Flow';
import { Role } from '~/entity/enum/Role';
import webApi from '~/util/webApi';
import { GetDefenceGroupsRes, GetFlowDetailRes, GetTeacherInfoRes } from '~/util/webRes';
import { Download, Upload, WarningFilled, CircleCheckFilled, ArrowLeft, ArrowRight, Search, Delete } from '@element-plus/icons-vue';
import { useAuthStore } from '~/store/authStore';
import { ElLoading, ElMessage } from 'element-plus';


const userInfo = useAuthStore();

const flows: Ref<ProcessDetail[]> = ref([])
const flowsFilter: Ref<ProcessDetail[]> = ref([])

const flowIndex = ref(0)
const pagesize = ref(1)
const flowTotal = ref(0)

const flowStatusFifter = ref('')
setTimeout(() => {
    if (userInfo.roles.includes(Role.ACADEMIC_REGISTRY)) {
        flowStatusFifter.value = '全部'
    } else if (userInfo.roles.includes(Role.ACADEMIC_TUTOR)) {
        flowStatusFifter.value = '待确定'
    } else if (userInfo.roles.includes(Role.INNER_AUDITOR)) {
        flowStatusFifter.value = '待内审'
    } else if (userInfo.roles.includes(Role.OUTER_AUDITOR)) {
        flowStatusFifter.value = '待外审'
    }
}, 300)


const personFifter: Ref<string> = ref('')
//监听flowStatusFifter和perSonFifter的变化，过滤flows
watch([flows, personFifter], (value, old) => {
    flowsFilter.value = flows.value
        .filter(i => String(i.id).includes(personFifter.value) ||
            i.studentId?.toString().includes(personFifter.value) ||
            i.studentName?.includes(personFifter.value) ||
            i.thesisName?.includes(personFifter.value))
}, { deep: true })

watch(personFifter, () => {
    flowTotal.value = flowsFilter.value.length
    setTimeout(() => {
        flowTotal.value = flowsFilter.value.length
    }, 1000)
    setTimeout(() => {
        flowTotal.value = flowsFilter.value.length
    }, 2000)
    setTimeout(() => {
        flowTotal.value = flowsFilter.value.length
    }, 3000)
    setTimeout(() => {
        flowTotal.value = flowsFilter.value.length
    }, 4000)
    setTimeout(() => {
        flowTotal.value = flowsFilter.value.length
    }, 5000)
}, { deep: true })



const fileList = ref([])

//搜索，用于弹窗内部搜索
const searchInner = ref('')
const searchOuter1 = ref('')
const searchOuter2 = ref('')

//触发search事件，搜索流程信息
const search = (type?: FlowStatus, studentId?: string | null, auditType?: 'inner' | 'outer' | 'verify' | null) => {
    let fifter: any = {};
    if (type) fifter.flowStatus = type;
    if (studentId) fifter.studentId = studentId;

    switch (auditType) {
        case 'inner':
            fifter.innerAuditorId = userInfo.teacherId
            break;
        case 'outer':
            fifter.outerAuditorId = userInfo.teacherId
            break;
        case 'verify':
            fifter.verifierId = userInfo.teacherId
            break;
    }
    while (flows.value.length) flows.value.pop()
    getFlowInfo(1, fifter)
}

//触发download事件，下载文件
const download = (anonymous: boolean) => {
    webApi.axios({
        method: "GET",
        url: `/getThesis?id=${flowsFilter.value[flowIndex.value].id}&anonymous=${anonymous}`,
        responseType: "blob",
        headers: {
            token: userInfo.token
        }
    })
        .then(res => {
            let blob = new Blob([res.data], {
                type: "application/pdf" //这里需要根据不同的文件格式写不同的参数
            });
            let eLink = document.createElement("a");

            const { thesisName, id } = flowsFilter.value[flowIndex.value]

            eLink.setAttribute("target", "_blank")
            eLink.style.display = "none";
            eLink.download = id + '_' + thesisName;
            eLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eLink);
            eLink.click();
            URL.revokeObjectURL(eLink.href);
            document.body.removeChild(eLink);
        })
}

const downloadMul = (anonymous: boolean, list: Array<number>) => {
    ElMessage(JSON.stringify(list))
    webApi.axios({
        method: "POST",
        url: `/getMultipleThesis`,
        data: list,
        responseType: "blob",
        headers: {
            token: userInfo.token
        }
    })
        .then(res => {
            let blob = new Blob([res.data], {
                type: "application/zip" //这里需要根据不同的文件格式写不同的参数
            });
            let eLink = document.createElement("a");
            eLink.setAttribute("target", "_blank")
            eLink.style.display = "none";
            eLink.download = "已过审论文.zip";
            eLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eLink);
            eLink.click();
            URL.revokeObjectURL(eLink.href);
            document.body.removeChild(eLink);
        })
}

const exportAudit = () => {
    webApi.axios({
        method: "POST",
        url: "/exportAudit",
        data: flowsFilter.value.map(i => i.id),
        responseType: "blob",
        headers: {
            token: userInfo.token
        }
    })
        .then(res => {
            let blob = new Blob([res.data], {
                type: "application/pdf" //这里需要根据不同的文件格式写不同的参数
            });
            let eLink = document.createElement("a");
            eLink.setAttribute("target", "_blank")
            eLink.style.display = "none";
            eLink.download = "评审意见.xlsx";
            eLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eLink);
            eLink.click();
            URL.revokeObjectURL(eLink.href);
            document.body.removeChild(eLink);
        })
}

const deleteFlow = (id: string | number) => {
    const target = flows.value.find(i => i.id == id)

    //弹窗确认
    if (confirm("确定删除" + target?.studentName + "的流程？")) {
        webApi.post<{ message: string }>("/deleteFlow", [id])
            .then(res => {
                target!.status = FlowStatus.PROCESS_END
                ElMessage.success(JSON.stringify(res.message))
            })
    }
}

const changeTeacher = (index: number, flowId: string | number) => {
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
    const flow = flows.value.find(i => i.id == flowsFilter.value[flowIndex.value].id)
    switch (flow?.status) {
        case FlowStatus.FLOW_START:
            verifyForm.auditType = "TEACHER_VERIFY";
            break;
        case FlowStatus.THESIS_AUDIT:
            if (flowStatusFifter.value == '待内审') {
                verifyForm.auditType = "INNER_AUDIT";
                break;
            } else if (flowStatusFifter.value == '待外审') {
                verifyForm.auditType = "OUTER_AUDIT";
                break;
            }
            break;
        case FlowStatus.WAIT_STUDENT_CONFIRM_ORAL_DEFENSE:
            verifyForm.auditType = "ORAL_DEFENCE"
            break;
        default:
            verifyForm.auditType = "";
            break;
    }

    //补丁修正
    if (verifyForm.auditType === "") {
        if (useAuthStore().roles.includes(Role.INNER_AUDITOR)) {
            verifyForm.auditType = "INNER_AUDIT";
        } else if (useAuthStore().roles.includes(Role.OUTER_AUDITOR)) {
            verifyForm.auditType = "OUTER_AUDIT";
        }
    }

}
function getTeacherInfo(pageIndex = 1, type?: Role) {
    if (type == Role.INNER_AUDITOR) {
        webApi.post<GetTeacherInfoRes>(`/getTeacherInfoBy?current= ${pageIndex}`, { role: [Role.INNER_AUDITOR] }).then(res => {
            innerAuditorInfos.value.push(...res.data.data)
            //去除重复项
            innerAuditorInfos.value = innerAuditorInfos.value.filter((item, index, arr) => {
                return arr.findIndex(i => i.id == item.id) == index
            })
            const { page, size, total } = res.data
            if (page * size < total) getTeacherInfo(pageIndex + 1, type)
        })
    } else if (type == Role.OUTER_AUDITOR) {
        webApi.post<GetTeacherInfoRes>(`/getTeacherInfoBy?current= ${pageIndex}`, { role: [Role.OUTER_AUDITOR] }).then(res => {
            outerAuditorInfos.value.push(...res.data.data)
            //去除重复项
            outerAuditorInfos.value = outerAuditorInfos.value.filter((item, index, arr) => {
                return arr.findIndex(i => i.id == item.id) == index
            })
            const { page, size, total } = res.data
            if (page * size < total) getTeacherInfo(pageIndex + 1, type)
        })
    }
}

function getFlowInfo(pageIndex = 1, filter: any) {
    webApi.post<GetFlowDetailRes>(`/getFlowInfo?current= ${pageIndex}`, filter).then(res => {
        //获得返回的数据的所有流程状态是否相同，并获得该状态
        const sameStatus = res.data.data.every((item, index, arr) => {
            return item.status == arr[0].status
        }) ? res.data.data[0].status : null

        let allowAdd = false
        //判断sameStatus和flowStatusFifter.value是否匹配
        //只有在全部状态才添加不同状态的流程，否则要求状态和当前筛选器匹配
        if ((sameStatus == FlowStatus.FLOW_START && flowStatusFifter.value == "待确认") ||
            (sameStatus == FlowStatus.THESIS_AUDIT && flowStatusFifter.value == "待内审") ||
            (sameStatus == FlowStatus.THESIS_AUDIT && flowStatusFifter.value == "待外审") ||
            (sameStatus == FlowStatus.WAIT_STUDENT_CONFIRM_ORAL_DEFENSE && flowStatusFifter.value == "待答辩") ||
            (sameStatus == FlowStatus.AUDIT_PASSED && flowStatusFifter.value == "已过审") ||
            (flowStatusFifter.value == "全部")) {
            allowAdd = true
        }
        if (allowAdd) {
            flowTotal.value = res.data.total
            flows.value.push(...res.data.data)
            flowsFilter.value = flows.value
            //删除flows中的重复项
            flows.value = flows.value.filter((item, index, self) => {
                return self.findIndex(i => i.id == item.id) == index
            })
            if (res.data.page * res.data.size < res.data.total) {
                getFlowInfo(pageIndex + 1, filter)
            }
        }
    })
}
//更新流程信息
const updateFlow = (type: 'i' | 'oa' | 'ob' | 'd', teacherId: string) => {
    const flow = flows.value.find(f => f.id == flowsFilter.value[flowIndex.value].id)!
    const form: any = {
        id: flow.id,
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
    webApi.post<{ message: string }>('/reassignFlow', form).then(res => {
        if (res) {
            ElMessage(JSON.stringify(res.message))
            while (innerAuditorInfos.value.length > 0) innerAuditorInfos.value.pop()
            while (innerAuditorInfos.value.length > 0) outerAuditorInfos.value.pop()
            getTeacherInfo(1, Role.INNER_AUDITOR)
            getTeacherInfo(1, Role.OUTER_AUDITOR)
            // webApi.post<GetDefenceGroupsRes>('/getDefenceGroupInfo', {}).then(res => {
            //     defenceGroupInfos.value = res.data.data;
            // });
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
const showOuterAuditorDialog1: Ref<boolean> = ref(false)
const showOuterAuditorDialog2: Ref<boolean> = ref(false)

const innerAuditorInfos: Ref<TeacherInfo[]> = ref([]);
const outerAuditorInfos: Ref<TeacherInfo[]> = ref([]);

setTimeout(() => {
    if (useAuthStore().roled(Role.ACADEMIC_REGISTRY)) {
        search()
        getTeacherInfo(1, Role.INNER_AUDITOR)
        getTeacherInfo(1, Role.OUTER_AUDITOR)
    }
    else if (useAuthStore().roled(Role.ACADEMIC_TUTOR)) {
        search(FlowStatus.FLOW_START, null, 'verify')
    } else if (useAuthStore().roled(Role.INNER_AUDITOR)) {
        search(FlowStatus.THESIS_AUDIT, null, 'inner')
    }
    else if (useAuthStore().roled(Role.OUTER_AUDITOR)) {
        search(FlowStatus.THESIS_AUDIT, null, 'outer')
    }
}, 850)
const showDefenceGroupDialog: Ref<boolean> = ref(false)

const defenceGroupInfos: Ref<DefenceInfo[]> = ref([]);
// webApi.post<GetDefenceGroupsRes>('/getDefenceGroupInfo', {}).then(res => {
//     defenceGroupInfos.value = res.data.data;
// });

//审核相关
const showAuditDialog: Ref<boolean> = ref(false);
watch(showAuditDialog, () => {
    if (showAuditDialog.value == false) {
        savedraft()
    }
}, { deep: true })

const verifyForm: any = reactive({
    flowId: null,
    auditType: '',
    pass: true,
    score: 60,
    comment: '',
})


//保存草稿
const savedraft = () => {
    webApi.post('/draft', verifyForm).catch(err => {
        ElMessage.error(JSON.stringify(err))
    })
}

//定时器，10秒自动保存一次草稿，暂存按钮将会置零进行暂存操作
let timer = new Date().getTime();

const getdraft = () => {
    verifyForm.flowId = String(flowsFilter.value[flowIndex.value].id);
    webApi.get(`/draft?flowId=${verifyForm.flowId}`).then((res: any) => {
        verifyForm.pass = res.data.pass;
        verifyForm.score = res.data.score;
        verifyForm.comment = res.data.comment;
    }).catch(() => {
        verifyForm.pass = true;
        verifyForm.score = 60;
        verifyForm.comment = '';
    })
}

watch(showAuditDialog, () => {
    if (showAuditDialog.value) {
        getdraft();
    }
})
const verify = () => {
    verifyForm.flowId = flowsFilter.value[flowIndex.value].id;
    webApi.post<{ message: string }>('/audit', verifyForm).then((res) => {
        ElMessage(JSON.stringify(res.message))
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
        ElMessage.error(JSON.stringify(err))
    })
}

const showUploadReportDialog = ref(false)

const showRollback = (e: any) => {
    ElMessage(JSON.stringify(e))
}
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