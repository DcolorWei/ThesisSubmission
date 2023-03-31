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
                <el-button @click="() => add()">新增</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="warning" plain>导入</el-button>
            </el-col>
        </el-row>
    </div>
    <div style="z-index:0">
        <el-table :data="tableData.slice(pageIndex * 10, pageIndex * 10 + 10)" border>
            <el-table-column prop="id" label="学号/工号" width="150" />
            <el-table-column prop="name" label="姓名" width="130" />
            <el-table-column prop="identify" label="身份" width="100">
                <template #default="{ row }">
                    {{ row.identify && row.identify.join(',')
                        .replace('1', '学生')
                        .replace('2', '老师')
                        .replace('3', '导师') }}
                </template>
            </el-table-column>
            <el-table-column prop="schoolName" label="学校" width="170" />
            <el-table-column prop="departmentName" label="学院" width="130" />
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button type="warning" :icon="Edit" size="small" plain @click="() => edit(scope.row)">编辑</el-button>
                    <el-button type="primary" :icon="Search" size="small" plain>查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display:flex;justify-content: center;margin: 20px auto;">
            <el-pagination layout="prev, pager, next" :total="tableData.length" @current-change="(e) => changePage(e)" />
        </div>
    </div>


    <!-- 人员信息表单 -->
    <el-dialog v-model="dialogVisible" title="学生信息" width="30%" align-center>
        <div class="form">
            <div class="form-item"><el-input v-model="personInfo.id" placeholder="学号" /></div>
            <div class="form-item"><el-input v-model="personInfo.name" placeholder="姓名" /></div>
            <div>
                <el-select v-model="personInfo.identify" multiple placeholder="身份" style="width: 80%;">
                    <el-option
                        v-for="item in [{ value: 1, label: '学生' }, { value: 2, label: '老师' }, { value: 3, label: '导师' }]"
                        :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
            <div class="form-item"><el-input v-model="personInfo.college" placeholder="学院" /></div>
            <div class="form-item"><el-input v-model="personInfo.class" placeholder="班级" /></div>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="() => dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="() => save()">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogVisible" title="教师信息" width="30%" align-center>
        <div class="form">
            <div class="form-item"><el-input v-model="personInfo.id" placeholder="学号/工号" /></div>
            <div class="form-item"><el-input v-model="personInfo.name" placeholder="姓名" /></div>
            <div>
                <el-select v-model="personInfo.identify" multiple placeholder="身份" style="width: 80%;">
                    <el-option
                        v-for="item in [{ value: 1, label: '学生' }, { value: 2, label: '老师' }, { value: 3, label: '导师' }]"
                        :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
            <div class="form-item"><el-input v-model="personInfo.college" placeholder="学院" /></div>
            <div class="form-item"><el-input v-model="personInfo.class" placeholder="班级" /></div>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="() => dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="() => save()">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { Edit, Search } from '@element-plus/icons-vue'
import axios from 'axios';
import { reactive, Ref, ref } from 'vue';
import { UpdateTeacherReq } from '~/util/webReq';
import { UsualRes } from '~/util/webRes';

//表单筛选
const filter = ref({
    identify: ''
})

//表单数据
const tableData: Ref<any[]> = ref([])
axios.get('/getPersonInfo').then(({ data }) => {
    tableData.value.push(...data.data)
})
const pageIndex = ref(0)
const changePage = (e: number) => pageIndex.value = e - 1

//编辑页可见
const dialogVisible = ref(false)
//编辑页信息
const personInfo: any = ref({
    id: '',
    name: '',
    identify: [],
    college: '',
    class: ''
})

const mode = ref('edit')
const add = () => {
    personInfo.value = {
        id: '',
        name: '',
        identify: [],
        college: '',
        class: ''
    };
    dialogVisible.value = true
}

const edit = (e: unknown) => {
    personInfo.value = e
    console.log(e, personInfo.value)
    dialogVisible.value = true
}

const save = () => {
    const exist = tableData.value.find(i => i.id == personInfo.value.id)
    if (!exist) {
        tableData.value.unshift(personInfo.value)
    } else {
        Object.keys(exist).forEach(key => exist[key] = personInfo.value[key])
    }
    dialogVisible.value = false
}
</script>
<style>
.ep-row {
    display: flex;
    align-items: center;
}

.form {
    display: flex;
    flex-direction: column;
}

.form-item {
    width: 80%;
    margin: 5px auto;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>