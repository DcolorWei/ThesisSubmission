<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <el-text size="large" tag="b">流程管理</el-text>
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
                <el-button>搜索</el-button>
            </el-col>
        </el-row>
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
        <el-table :data="[{ thesisNo: '4008208820', evaluteNo: 'NJU1145141919810' }]" style="width: 90vw">
            <el-table-column prop="thesisNo" label="论文号" width="110" />
            <el-table-column prop="evaluteNo" label="评审号" />
        </el-table>
    </el-card>

</template>

<script lang="ts" setup>
import { ref } from 'vue'

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