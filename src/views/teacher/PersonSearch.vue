<template>
    <div style="margin: 10px;"></div>
    <div style="margin-top: 10px;width: 860px;">
        <el-row :gutter="20">
            <el-col :span="4">
                <el-select v-model="filter.identify" class="m-2" placeholder="身份">
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select v-model="filter.identify" class="m-2" placeholder="学院">
                </el-select>
            </el-col>
            <el-col :span="7">
                <div class="grid-content ep-bg-purple" />
            </el-col>
            <el-col :span="5">
                <el-input placeholder=""></el-input>
            </el-col>
            <el-col :span="3">
                <el-button>搜索</el-button>
            </el-col>
        </el-row>
    </div>
    <div style="margin-bottom: 10px;width: 860px;">
        <el-row :gutter="20">
            <el-col :span="16">
                <div class="grid-content ep-bg-purple" />
            </el-col>
            <el-col :span="4">
                <dialog-person>新增</dialog-person>
            </el-col>
            <el-col :span="4">
                <el-button type="warning" plain>导入</el-button>
            </el-col>
        </el-row>
    </div>
    <div>
        <el-table :data="tableData.slice(pageIndex * 10, pageIndex * 10 + 10)" border>
            <el-table-column prop="id" label="学号/工号" width="150" />
            <el-table-column prop="name" label="姓名" width="130" />
            <el-table-column prop="identify" label="身份" width="100" />
            <el-table-column prop="college" label="学院" width="130" />
            <el-table-column prop="class" label="班级" width="170" />
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button type="warning" :icon="Edit" size="small" plain>编辑</el-button>
                    <el-button type="primary" :icon="Search" size="small" plain>查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display:flex;justify-content: center;margin: 20px auto;">
            <el-pagination layout="prev, pager, next" :total="tableData.length" @current-change="(e) => changePage(e)" />
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { Edit, Search } from '@element-plus/icons-vue'
import { Ref, ref } from 'vue';
import axios from 'axios'


const filter = ref({
    identify: ''
})

const tableData: Ref<any[]> = ref([])
axios.get('/teacher/getPersonInfo').then(({ data }) => {
    tableData.value.push(...data)
})
const pageIndex = ref(0)
const changePage = (e: number) => pageIndex.value = e - 1
</script>
<style>
.ep-row {
    display: flex;
    align-items: center;
}
</style>