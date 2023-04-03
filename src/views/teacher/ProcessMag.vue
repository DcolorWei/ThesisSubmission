<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <h2 style="color:#606266">流程管理</h2>
    </div>
    <div style="margin: 30px 0;width: 87vw;">
        <el-row :gutter="20">
            <el-col :span="4">
                <el-input v-model="studentId" placeholder="学号"></el-input>
            </el-col>
            <el-col :span="4">
                <el-input v-model="flowId" placeholder="流程号"></el-input>
            </el-col>
            <el-col :span="3">
                <el-button @click="() => search()">搜索</el-button>
            </el-col>
            <el-col :span="13">
    
            </el-col>
        </el-row>
    </div>
    <div style="margin: 30px 0;width: 87vw;">

    </div>

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
                    <el-button type="primary" plain round size="small" @click="() => showAuditDialog = true">审核</el-button>
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

    <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left">任务信息</h3>
    <el-card body-style="width:85vw">
        <el-upload v-model:file-list="fileList" class="upload-demo"
            :action="webApi.axios.defaults.baseURL + '/upload/duplicateReport'" multiple :limit="2">
            <el-button :icon="Upload">上传查重报告</el-button>
        </el-upload>
    </el-card>

    <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left">关联教师</h3>
    <el-card body-style="width:85vw">
        <el-table v-if="flow.verifier" style="width: 90vw"
            :data="[flow.verifier, flow.innerAuditor, flow.outerAuditor1, flow.outerAuditor2]">
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
                    <el-button type="warning" plain round size="small" @click="() => changeTeacher($index)">更换</el-button>
                    <el-button type="info" plain round size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left">答辩信息</h3>
    <el-card body-style="width:85vw" style="margin-bottom: 30px;">
        <div style="display:flex;justify-content: flex-end;">
            <el-button type="warning" plain @click="() => changeTeacher(3)">更换答辩组</el-button>
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
            <el-table-column width="80">
                <template #default>
                    <el-button type="info" plain round size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

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
    <el-dialog title="更换外审老师A" v-model="showOuterAuditorDialog1">
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
    <el-dialog title="更换外审老师B" v-model="showOuterAuditorDialog2">
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
                    <el-option label="确认" value="TEACHER_VERIFY"></el-option>
                    <el-option label="内审" value="INNER_AUDIT"></el-option>
                    <el-option label="外审1" value="OUTER_AUDIT1"></el-option>
                    <el-option label="外审2" value="OUTER_AUDIT2"></el-option>
                    <el-option label="答辩" value="ORAL_DEFENCE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核结果">
                <el-radio-group v-model="verifyForm.pass">
                    <el-radio label="通过">通过</el-radio>
                    <el-radio label="不通过">不通过</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="评分">
                <el-input-number v-model="verifyForm.score" :min="0" :max="100" :step="1" />
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
import { Upload } from '@element-plus/icons-vue';

const flow: ProcessDetail = reactive({
    id: 0,
    status: FlowStatus.FLOW_START,
    verifier: null,
    innerAuditor: null,
    outerAuditor1: null,
    outerAuditor2: null,
    defenceGroup: null,
    studentName: '',
    studentId: null,
})

const studentId: Ref<string> = ref('')
const flowId: Ref<string> = ref('')
const fileList = ref([])

//触发search事件，搜索流程信息
const search = () => {
    let fifter = {};
    webApi.post<GetFlowDetailRes>('/getFlowInfo', fifter).then(res => {
        //只有流程结果数量为1时，才会赋值，否则报错
        if (res.data.data.length != 1) {
            alert('无唯一匹配结果！')
            throw new Error('流程数量不为1')
        } else {
            const target = res.data.data[0]
            //遍历每一个属性，将其赋值给flow
            if (target)
                Object.keys(target).forEach(key => {
                    //@ts-ignore
                    flow[key] = target[key]
                })
        }
    })
}
search()

const changeTeacher = (index: number) => {
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

const updateFlow = (type: 'i' | 'oa' | 'ob' | 'd', id: string) => {
    const form = {
        id: flow.id,
        innerAuditorId: flow.innerAuditor?.id,
        outerAuditorId1: flow.outerAuditor1?.id,
        outerAuditorId2: flow.outerAuditor2?.id,
        defenceGroupId: flow.defenceGroup?.id,
    }
    switch (type) {
        case 'i':
            form.innerAuditorId = Number(id)
            break
        case 'oa':
            form.outerAuditorId1 = Number(id)
            break
        case 'ob':
            form.outerAuditorId2 = Number(id)
            break;
        case 'd':
            form.defenceGroupId = String(id)
            break;
    }
    webApi.post('/reassignFlow', form).then(res => {
        if (res) {
            alert('更换成功！')
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
    auditType: 'TEACHER_VERIFY',
    pass: "通过",
    score: 60,
    comment: '',
})

const verify = () => {
    verifyForm.flowId = String(flow.id!);
    verifyForm.pass = verifyForm.pass == "通过" ? true : false
    webApi.post('/audit', verifyForm).then(() => {
        search()
        showAuditDialog.value = false;
    })
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