<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <el-text size="large" tag="b">学生信息</el-text>
    </div>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-table :data="[student]" style="width: 90vw">
            <el-table-column prop="studentId" label="学号" width="200" />
            <el-table-column prop="name" label="姓名" width="200" />
            <el-table-column prop="phoneNumber" label="电话" width="200" />
            <el-table-column prop="emailAddress" label="邮箱" />
        </el-table>
        <el-table :data="[{
            nominalTutorId: student.nominalTutor?.id,
            nominalTutorName: student.nominalTutor?.name,
            academicTutorId: student.academicTutor?.id,
            academicTutorName: student.academicTutor?.name,
        }]" v-if="student.studentId" style="width: 90vw">
            <el-table-column prop="nominalTutorId" label="挂名导师工号" width="200" />
            <el-table-column prop="nominalTutorName" label="挂名导师姓名" width="200" />
            <el-table-column prop="academicTutorId" label="学业导师工号" width="200" />
            <el-table-column prop="academicTutorName" label="学业导师姓名" />
        </el-table>
    </el-card>
    <el-card body-style="width:85vw" style="margin-top: 10px;">
        <el-row :gutter="10" style="margin: 20px auto;">
            <el-col :span="12">
                <el-upload v-model:file-list="file1" class="upload-demo"
                    :action="`${webApi.axios.defaults.baseURL}/student/upload/thesis?anonymous=false`"
                    :headers="{ 'token': useAuthStore().token }" multiple :limit="1">
                    <el-button :icon="Upload">上传论文</el-button>
                </el-upload>
            </el-col>
            <!-- <el-col :span="24">
                <el-upload v-model:file-list="file2" class="upload-demo"
                    :action="`${webApi.axios.defaults.baseURL}/student/upload/thesis?anonymous=true`"
                    :headers="{ 'token': useAuthStore().token }" multiple :limit="1">
                    <el-button :icon="Upload">上传匿名论文</el-button>
                </el-upload>
            </el-col> -->
        </el-row>
        <el-button @click="() => toBack()">返回</el-button>
    </el-card>
</template>

<script lang="ts" setup>
import { Upload } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue'
import { StudentInfo } from '~/entity/base/Student';
import { router } from '~/route';
import webApi from '~/util/webApi';
import { StudentInfoRes } from '~/util/webRes';
import { useAuthStore } from '~/store/authStore';

const file1 = ref([])
const file2 = ref([])

const student: StudentInfo = reactive(
    //初始空白数据
    {
        id: 0,
        userId: '',
        studentId: '',
        name: "",
        phoneNumber: "",
        emailAddress: "",
        flow: null,
        academicTutor: null,
        nominalTutor: null,
        role: [],
    }
)
webApi.get<StudentInfoRes>('/student/getStudentInfo', {}).then(res => {
    const data = res.data
    console.log(data)
    student.id = data.id
    student.userId = data.userId
    student.studentId = data.studentId
    student.name = data.name
    student.phoneNumber = data.phoneNumber
    student.emailAddress = data.emailAddress
    student.flow = data.flow
    student.academicTutor = data.academicTutor
    student.nominalTutor = data.nominalTutor
    student.role = data.role
})

const toBack=()=>{
    router.push({ path: '/thesisstatus' })
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