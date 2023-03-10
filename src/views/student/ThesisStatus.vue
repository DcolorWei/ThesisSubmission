<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <el-text size="large" tag="b">学生信息</el-text>
    </div>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-table :data="[{ id: '2220200267', name: '韦定彩', class: '航海技术2020-4' }]" style="width: 90vw">
            <el-table-column prop="id" label="学号" width="110" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="class" label="专业班级" />
        </el-table>
        <el-table :data="[{ thesisNo: '4008208820', evaluteNo: 'NJU1145141919810' }]" style="width: 90vw">
            <el-table-column prop="thesisNo" label="论文号" width="110" />
            <el-table-column prop="evaluteNo" label="评审号" />
        </el-table>
        <el-table :data="[{ thesisName: '一种论文评审系统的新设计与再讨论' }]" style="width: 90vw">
            <el-table-column prop="thesisName" label="论文名称" width="250" />
            <el-table-column>
                <template #default>
                    <el-tag type="warning" round>评审中</el-tag>
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
            <el-collapse-item v-for="item, index in statusList" :key="index" :name="index">
                <template #title>
                    {{ item.typeName }}
                    <el-tag v-if="index == 1" round style="margin-left: 10px;">当前阶段</el-tag>

                </template>
                <el-timeline class="timeline">
                    <el-timeline-item center v-for="status, index in item.statusList" :key="index">
                        <el-card shadow="always" body-style="padding:0 20px">
                            <h4>{{ status.statusName }}</h4>
                            <p>Tom committed 2018/4/12 20:46</p>
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
import { ref } from 'vue'
import { router } from "../../route"
const toPage = (path: string = 'home') => {
  router.push(path)
}

const activeNames = ref(['1'])

const statusList = [
    {
        typeName: "请求发起阶段",
        statusList: [
            { statusId: 1, statusName: "评审请求发起" },
            { statusId: 2, statusName: "指导老师已确认" },
            { statusId: 3, statusName: "等待送审审批" },
        ]
    },
    {
        typeName: "内外审阶段",
        statusList: [
            { statusId: 4, statusName: "论文评审中" },
            { statusId: 5, statusName: "论文评审通过" },
            { statusId: 6, statusName: "论文评审未通过" },
        ]
    }, {
        typeName: "答辩阶段",
        statusList: [
            { statusId: 7, statusName: "确认答辩" },
            { statusId: 8, statusName: "等待答辩分配" },
            { statusId: 9, statusName: "等待答辩中" },
            { statusId: 10, statusName: "答辩通过" },
        ]
    },
    {
        typeName: "查重阶段",
        statusList: [
            { statusId: 11, statusName: "论文查重中" },
            { statusId: 12, statusName: "查重通过" },
            { statusId: 13, statusName: "论文通过" },
        ]
    },
]

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