<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <h2 style="color:#606266">流程管理</h2>
    </div>
    <div style="margin: 30px 0;width: 87vw;">
        <el-row :gutter="20">
            <el-col :span="4">
                <el-input placeholder="学号"></el-input>
            </el-col>
            <el-col :span="4">
                <el-input placeholder="姓名"></el-input>
            </el-col>
            <el-col :span="4">
                <el-input placeholder="指导教师"></el-input>
            </el-col>
            <el-col :span="3">
                <el-button>筛选</el-button>
            </el-col>
        </el-row>
    </div>
    <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left">学生信息</h3>
    <el-card body-style="width:85vw">
        <el-table
            :data="[{ id: student.studentId, name: student.name, phone: student.phoneNumber, email: student.emailAddress }]"
            style="width: 90vw">
            <el-table-column prop="id" label="学号" width="200" />
            <el-table-column prop="name" label="姓名" width="200" />
            <el-table-column prop="phone" label="电话" width="200" />
            <el-table-column prop="email" label="邮箱" />

        </el-table>

        <el-table style="width: 90vw">
            <el-table-column>
                <template #default>
                    <el-tag type="warning" round>{{ status.status }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left">关联教师</h3>
    <el-card body-style="width:85vw">
        <el-table :data="[status.verifier, status.innerAuditor, status.outerAuditor1,status.outerAuditor2]" style="width: 90vw">
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
        <el-table :data="[status.defenceGroup?.chairman, status.defenceGroup?.secretary, ...status.defenceGroup!.committee]"
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
import axios from 'axios';
import { Ref, ref, reactive } from 'vue'
import { ProcessDetail } from '~/entity/base/Process';
import webApi from '~/util/webApi';
import { ProcessStatusRes, StudentInfoRes } from '~/util/webRes';


const student: any = ref({})
webApi.post<StudentInfoRes>('/getStudentInfoBy', {}).then((data) => {
    student.value = data[0]
    console.log(student.value)
})
const status: any = reactive({})
axios.post('/getFlowInfo').then(({ data }) => {
    Object.keys(data[0]).forEach((k: any) => status[k] = data[0][k])
})


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