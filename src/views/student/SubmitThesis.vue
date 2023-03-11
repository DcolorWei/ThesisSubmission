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
    </el-card>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-row :gutter="10">
            <el-col :span="12">
                <el-button :icon="Upload">上传论文</el-button>
            </el-col>
            <el-col :span="12">
                <el-select class="m-2" placeholder="指导老师"> </el-select>
            </el-col>
        </el-row>
        <el-button>提交</el-button>
    </el-card>
</template>

<script lang="ts" setup>
import { Upload } from  '@element-plus/icons-vue';
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