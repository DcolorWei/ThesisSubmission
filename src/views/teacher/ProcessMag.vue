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
                <el-button @click="search()">搜索</el-button>
            </el-col>
        </el-row>
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
        </el-table>
    </el-card>
    <!-- 暂无学生与流程的信息 -->
    <el-card body-style="width:85vw" v-else>
        <div style="display: flex;justify-content: center;align-items: center;height: 50px;">
            <h4 style="color:#606266">暂无匹配的学生与流程的信息</h4>
        </div>
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
                <template #default>
                    <el-button type="warning" plain round size="small">更换</el-button>
                    <el-button type="info" plain round size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left">答辩信息</h3>
    <el-card body-style="width:85vw" style="margin-bottom: 30px;">
        <div style="display:flex;justify-content: flex-end;">
            <el-button type="warning" plain>更换答辩组</el-button>
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
</template>

<script lang="ts" setup>
import { Ref, ref, reactive } from 'vue'
import { ProcessDetail } from '~/entity/base/Process';
import { FlowStatus } from '~/entity/enum/Flow';
import webApi from '~/util/webApi';
import { GetFlowDetailRes } from '~/util/webRes';

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

//触发search事件，搜索流程信息
const search = () => {
    webApi.post<GetFlowDetailRes>('/getFlowInfo', {
        id: Number(flowId.value),
    }).then(res => {
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