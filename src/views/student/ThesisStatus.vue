<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <el-text size="large" tag="b">学生信息</el-text>
    </div>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-table
            :data="[{ id: student.data.studentId, name: student.data.name, phone: student.data.phoneNumber, email: student.data.emailAddress }]"
            style="width: 90vw">
            <el-table-column prop="id" label="学号" width="200" />
            <el-table-column prop="name" label="姓名" width="200" />
            <el-table-column prop="phone" label="电话" width="200" />
            <el-table-column prop="email" label="邮箱" />

        </el-table>
        <el-table :data="[{ thesisNo: process.thesisNo, evaluteNo: process.evaluteNo, thesisName: process.thesisName }]"
            style="width: 90vw">
            <el-table-column prop="thesisNo" label="论文号" width="200" />
            <el-table-column prop="thesisName" label="论文名称" :width="process.thesisName.length * 20" />
            <el-table-column>
                <template #default>
                    <el-tag type="warning" round>{{ student.data.flow?.status }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <el-text size="large" tag="b">论文流程</el-text>
    </div>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-button @click="() => toPage('submitthesis')">
            发起评审
        </el-button>

    </el-card>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-collapse class="collapse" v-model="activeNames" accordion>
            <el-collapse-item v-for="item, index in statusList" :key="index" :name="index" :disabled="!item.passed">
                <template #title>
                    {{ item.typeName }}
                    <el-tag v-if="item.statusList.find(i => i.statusId == process.processCurrent)" round
                        style="margin-left: 10px;">当前阶段</el-tag>

                </template>
                <el-timeline class="timeline">
                    <el-timeline-item center v-for="status, index in item.statusList" :key="index"
                        :timestamp="status.updateTime" :color='status.statusId < process.processCurrent ? "#0bbd87" : ""'>
                        <el-card v-if="status.statusId < process.processCurrent" shadow="always"
                            body-style="padding:0 20px">
                            <h4>{{ status.statusName }}</h4>
                            <p>{{ status.describe + ' 处理人:' + status.handler }}</p>
                        </el-card>
                        <el-card v-if="status.statusId == process.processCurrent" shadow="always"
                            body-style="padding:0 20px">
                            <h4>{{ status.statusName }}</h4>
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

    </el-card>
</template>

<script lang="ts" setup>
import { it } from 'node:test';
import { reactive, ref } from 'vue'
import { ProcessDetail } from '~/entity/base/Process';
import { ProcessStatusRes, StudentInfoRes } from '~/util/webRes';
import { router } from "../../route"
const toPage = (path: string = 'home') => {
    router.push(path)
}

const activeNames = ref(['1'])


const student: StudentInfoRes = reactive(
    {
        "code": 18,
        "message": "ea consequat laboris",
        "data": {
            "id": 34,
            "name": "学气低京决了部",
            "userId": "44",
            "phoneNumber": "4008208820",
            "studentId": "23343244",
            "emailAddress": "114514@xiabei.ze",
            "role": [
                "ad mollit dolore",
                "in qui in nisi irure",
                "Lorem",
                "mollit ut"
            ],
            "nominalTutor": null,
            flow: {
                id: 38,
                studentId: 11,
                studentName: "多传变计",
                defenceGroup: null,
                status: "PROCESS_END"
            }
        }
    }
)

const process: ProcessStatusRes = reactive(
    {
        evaluteNo: 41364256,
        thesisNo: 53928074,
        thesisName: "太局队线干",
        // 这里要确认是否为状态
        processCurrent: 6,
        processList: [
            {
                "statusId": 1,
                "statusName": "评审请求发起了",
                "updateTime": "1985-11-19 03:01:13",
                "handler": "Excepteur Lorem veniam cillum",
                "describe": "amet enim mollit in sed"
            },
            {
                "statusId": 2,
                "statusName": "权想多受克组",
                "updateTime": "2008-06-18 02:51:28",
                "describe": "amet",
                "handler": "laborum"
            },
            {
                "statusId": 3,
                "statusName": "权想多受克组",
                "updateTime": "2008-06-18 02:51:28",
                "describe": "amet",
                "handler": "laborum"
            },
            {
                "statusId": 4,
                "statusName": "权想多受克组",
                "updateTime": "2008-06-18 02:51:28",
                "describe": "amet",
                "handler": "laborum"
            },
            {
                "statusId": 5,
                "statusName": "权想多受克组",
                "updateTime": "2008-06-18 02:51:28",
                "describe": "amet",
                "handler": "laborum"
            }
        ],
    }
)

const statusList = reactive([
    {
        typeName: "请求发起阶段",
        passed: false,
        statusList: [
            { statusId: 1, statusName: "评审请求发起" },
            { statusId: 2, statusName: "指导老师已确认" },
            { statusId: 3, statusName: "等待送审审批" },
        ]
    },
    {
        typeName: "内外审阶段",
        passed: false,
        statusList: [
            { statusId: 4, statusName: "论文评审中" },
            { statusId: 5, statusName: "论文评审通过/未通过" },
            { statusId: 6, statusName: "等待学生处理" },
        ]
    }, {
        typeName: "答辩阶段",
        passed: false,
        statusList: [
            { statusId: 7, statusName: "确认答辩" },
            { statusId: 8, statusName: "等待答辩分配" },
            { statusId: 9, statusName: "等待答辩中" },
            { statusId: 10, statusName: "答辩通过" },
        ]
    },
    {
        typeName: "查重阶段",
        passed: false,
        statusList: [
            { statusId: 11, statusName: "论文查重中" },
            { statusId: 12, statusName: "查重通过" },
            { statusId: 13, statusName: "论文通过" },
        ]
    },
])

//加载到进程树，进行匹配
statusList.forEach(statusInfo => {
    statusInfo.statusList.forEach((item: any) => {
        if (item.statusId < process.processCurrent) {
            const t: any = process.processList.find(i => i.statusId == item.statusId)!
            Object.keys(t).forEach(key => item[key] = t[key])
            statusInfo.passed = true
        } else if (item.statusId == process.processCurrent) {
            statusInfo.passed = true
        } else {
            //若子阶段已经为最新阶段，则不需要再更新
            statusInfo.passed = statusInfo.passed || false
        }
    })
})
console.log(statusList)
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