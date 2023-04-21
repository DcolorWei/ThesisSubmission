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
                <el-upload v-model:file-list="file1"
                    :action="`${webApi.axios.defaults.baseURL}/student/upload/thesis?anonymous=false`"
                    :headers="{ 'token': useAuthStore().token }" :on-success="(e) => showUpload(e)" multiple :limit="1">
                    <el-button :icon="Upload">上传匿名论文</el-button>
                </el-upload>
            </el-col>
            <el-col :span="12">
                <el-button :icon="Download" type="info" plain @click="download(false)">
                    查看已上传论文
                </el-button>
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
import { Upload, Download } from '@element-plus/icons-vue';
import { reactive, Ref, ref } from 'vue'
import { StudentInfo } from '~/entity/base/Student';
import { router } from '~/route';
import webApi from '~/util/webApi';
import { FlowHistoryRes, StudentInfoRes } from '~/util/webRes';
import { useAuthStore } from '~/store/authStore';
import { ElMessage } from 'element-plus';

const file1 = ref([])

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

const flowId: Ref<string | number> = ref('')
const thesisName = ref('')

const download = (anonymous: boolean) => {
    webApi.axios({
        method: "GET",
        url: `/getThesis?id=${flowId.value}&anonymous=${anonymous}`,
        responseType: "blob",
        headers: {
            token: useAuthStore().token
        }
    })
        .then(res => {
            let blob = new Blob([res.data], {
                type: "application/pdf" //这里需要根据不同的文件格式写不同的参数
            });
            let eLink = document.createElement("a");


            eLink.setAttribute("target", "_blank")
            eLink.style.display = "none";
            eLink.download = thesisName.value;
            eLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eLink);
            eLink.click();
            URL.revokeObjectURL(eLink.href);
            document.body.removeChild(eLink);
        })
}

const showUpload = (event: { code: -1 | 0, message: string }) => {
    switch (event.code) {
        case -1:
            file1.value = []
            ElMessage({
                message: event.message,
                type: 'error',
                duration: 3500
            });
            break;
        case 0:
            ElMessage({
                message: event.message,
                type: 'success',
                duration: 3500
            });
            break;
    }
}

const toBack = () => {
    router.push({ path: '/thesisstatus' })
}

setTimeout(() => {
    ElMessage({
        message: '请注意检查论文是否匿名，请勿携带学号姓名等个人信息',
        type: 'warning',
        duration: 5000
    });

    webApi.get<FlowHistoryRes>('/student/getFlowHistory', {}).then(res => {
        thesisName.value = res.data.thesisName
        flowId.value = res.data.id
    })

    webApi.get<StudentInfoRes>('/student/getStudentInfo', {}).then(res => {
        const data = res.data
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
}, 1000)

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