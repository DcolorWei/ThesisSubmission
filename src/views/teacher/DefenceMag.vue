<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <h2 style="color:#606266">答辩组管理</h2>
    </div>
    <div style="display:flex;justify-content: flex-end;margin: 20px;">
        <el-button type="primary" plain @click="() => add()">新建</el-button>
    </div>
    <el-card body-style="width:85vw" style="margin: 15px 0;" v-for="item, index in defenceGroups" :key="index">
        <div style="width:90%;margin: 10px auto;">
            <el-descriptions :title="'ID: ' + item.id">
                <el-descriptions-item label="主席">{{ item.chairman.name }}</el-descriptions-item>
                <el-descriptions-item label="容量">{{ item.nowCapacity || 0 }}/{{ item.capacity || 'infinitas'
                }}</el-descriptions-item>
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
        <!-- el-dialog 表单用于填写新建答辩组信息 -->
        <el-dialog title="答辩组信息" v-model="dialogVisible" width="30%" align-center>
            <el-form :model="form" label-width="80px">
                <el-form-item label="主席">
                    <el-select v-model="form.chairman" filterable placeholder="请选择" style="width: 80%;">
                        <el-option v-for="item in teacherInfo" :key="item.id" :label="item.name + ' ' + item.teacherId"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="秘书">
                    <el-select v-model="form.secretary" filterable placeholder="请选择" style="width: 80%;">
                        <el-option v-for="item in teacherInfo" :key="item.id" :label="item.name + ' ' + item.teacherId"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="委员">
                    <el-select v-model="form.committee" filterable multiple placeholder="请选择" style="width: 80%;">
                        <el-option v-for="item in teacherInfo" :key="item.id" :label="item.name + ' ' + item.teacherId"
                            :value="item.id + ' ' + item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker style="width: 80%;" v-model="form.defenceTime" type="datetime"
                        placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="地点">
                    <el-input v-model="form.defencePlace" style="width: 80%;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="() => dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="() => save()">确定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { Ref, ref, reactive } from 'vue'
import { DefenceInfo } from '~/entity/base/Defence';
import webApi from '~/util/webApi';
import { GetDefenceGroupsRes, GetTeacherInfoRes } from '~/util/webRes';

const defenceGroups = reactive([] as DefenceInfo[])
webApi.post<GetDefenceGroupsRes>('/getDefenceGroupInfo', {}).then(res => {
    defenceGroups.push(...res.data.data)
})

//表单数据
const teacherInfo: Ref<Array<any>> = ref([])
//获取教师信息
function getTeacherInfo(pageIndex = 1) {
    webApi.post<GetTeacherInfoRes>(`/getTeacherInfoBy?current= ${pageIndex}`, {}).then(res => {
        teacherInfo.value.push(...res.data.data)
        const { page, size, total } = res.data
        if (page * size < total) return getTeacherInfo(pageIndex + 1)
    })
}
getTeacherInfo()
const dialogVisible = ref(false)
const form = reactive({
    chairman: '',
    secretary: '',
    committee: [],
    defenceTime: '',
    defencePlace: ''
})

const add = () => {
    //清空原表单
    form.chairman = ''
    form.secretary = ''
    form.committee = []
    form.defenceTime = ''
    form.defencePlace = ''

    dialogVisible.value = true;
}

const save = () => {
    webApi.post<GetDefenceGroupsRes>('/getDefenceGroupInfo', {}).then(res => {
        defenceGroups.push(...res.data.data)
    })
    dialogVisible.value = false
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