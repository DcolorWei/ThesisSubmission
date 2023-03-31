<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <h2 style="color:#606266">答辩组管理</h2>
    </div>
    <div style="display:flex;justify-content: flex-end;margin: 20px;">
        <el-button type="primary" plain>新建</el-button>
    </div>
    <el-card body-style="width:85vw" style="margin: 15px 0;" v-for="item, index in defenceGroups" :key="index">
        <div style="width:90%;margin: 10px auto;">
            <el-descriptions :title="'ID: ' + item.id">
                <el-descriptions-item label="主席">{{ item.chairman.name }}</el-descriptions-item>
                <el-descriptions-item label="容量">{{ item.nowcapacity }}/{{ item.capacity }}</el-descriptions-item>
                <el-descriptions-item label="Remarks">
                    <el-tag size="small">Copied</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="时间">{{ item.defenceTime }}</el-descriptions-item>
                <el-descriptions-item label="地点">{{ item.defencePlace }}</el-descriptions-item>
            </el-descriptions>
            <hr>
            <el-table :data="[item.chairman, item.secretary, ...item.committee]" style="width: 90vw">
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
            <div style="display:flex;justify-content: flex-end;margin-top: 20px;">
                <el-button type="warning" plain>编辑</el-button>
                <el-button type="danger" plain>删除</el-button>
            </div>
        </div>

    </el-card>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { Ref, ref, reactive } from 'vue'
import { DefenceInfo } from '~/entity/base/Defence';

const defenceGroups: Array<DefenceInfo> = reactive([])
axios.post('/getDefenceGroupInfo').then(({ data }) => defenceGroups.push(...data.defenceGroups))
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