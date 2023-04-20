<template>
    <div style="margin: 10px;"></div>
    <div style="margin-top: 10px;width: 960px;">
        <el-row :gutter="5">
            <el-col :span="4">
                <el-select v-model="filter.identify" class="m-2" placeholder="身份" clearable>
                    <el-option label="学生" :value="Role.STUDENT" />
                    <el-option label="内审教师" :value="Role.INNER_AUDITOR" />
                    <el-option label="外审教师" :value="Role.OUTER_AUDITOR" />
                    <el-option label="教务教师" :value="Role.ACADEMIC_REGISTRY" />
                    <el-option label="答辩组教师" :value="Role.DEFENCE_GROUP_TEACHER" />
                    <el-option label="学术导师" :value="Role.ACADEMIC_TUTOR" />
                    <el-option label="挂名导师" :value="Role.NOMINAL_TUTOR" />
                </el-select>
            </el-col>
            <el-col :span="7">
                <div class="grid-content ep-bg-purple" />
            </el-col>
            <el-col :span="5">
                <el-input placeholder="" v-model="searchContent"></el-input>
            </el-col>
            <el-col :span="3">
                <el-button @click="() => search(searchContent)">搜索</el-button>
            </el-col>
        </el-row>
    </div>
    <div style="margin-bottom: 10px;width: 930px;">
        <el-row :gutter="1">
            <el-col :span="12">
                <div class="grid-content ep-bg-purple" />
            </el-col>
            <el-col :span="3">
                <el-button @click="() => add('t')" style="width: 80px;">新增教师</el-button>
            </el-col>
            <el-col :span="3">
                <el-button @click="() => add('s')" style="width: 80px;">新增学生</el-button>
            </el-col>
            <el-col :span="3">
                <el-upload v-model:file-list="file1" class="upload-demo"
                    :action="`${webApi.axios.defaults.baseURL}/upload/student`" :headers="{ 'token': useAuthStore().token }"
                    multiple :limit="1" :show-file-list="false" :on-success="() => {
                        ElMessage.success('导入成功');
                        search();
                    }">
                    <el-button type="warning" plain style="width: 80px;">导入学生</el-button>
                </el-upload>
            </el-col>
            <el-col :span="3">
                <el-upload v-model:file-list="file2" class="upload-demo"
                    :action="`${webApi.axios.defaults.baseURL}/upload/teacher`" :headers="{ 'token': useAuthStore().token }"
                    multiple :limit="1" :show-file-list="false" :on-success="() => {
                        ElMessage.success('导入成功');
                        search();
                    }">
                    <el-button type="warning" plain style="width: 80px;">导入教师</el-button>
                </el-upload>
            </el-col>
        </el-row>
    </div>
    <div style="z-index:0">
        <el-table :data="tableData.slice(pageIndex * 10, pageIndex * 10 + 10)" border>
            <el-table-column label="学号/工号" width="100">
                <template #default="{ row }">
                    {{ row.studentId ? row.studentId : '' + row.teacherId ? row.teacherId : '' }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="130" />
            <el-table-column prop="role" label="身份" width="200">
                <template #default="{ row }">
                    {{ row.role && row.role.join() }}
                </template>
            </el-table-column>
            <el-table-column prop="emailAddress" label="邮箱" width="170" />
            <el-table-column prop="phoneNumber" label="电话" width="130" />
            <el-table-column label="操作" width="180">
                <template #default="{ row }">
                    <el-button type="warning" :icon="Edit" size="small" plain
                        @click="() => edit(row, row.role == 'STUDENT' ? 's' : 't')">编辑</el-button>
                    <el-button type="primary" :icon="Search" size="small" plain @click="() => viewInfo(row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display:flex;justify-content: center;margin: 20px auto;">
            <el-pagination layout="prev, pager, next" :total="tableData.length" @current-change="(e) => changePage(e)" />
        </div>
    </div>

    <!-- 人员信息表单 -->
    <el-dialog v-model="dialogStudent" title="学生信息" width="30%" align-center>
        <el-form :model="studentInfo" label-width="80px">
            <el-form-item label="学号">
                <el-input v-model="studentInfo.studentId" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="studentInfo.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="身份">
                <el-select v-model="studentInfo.role" multiple style="width: 80%;">
                    <el-option v-for="item in ['STUDENT']" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="studentInfo.emailAddress" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="studentInfo.phoneNumber" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="挂名导师">
                <el-select v-model="studentInfo.nominalTutorId" filterable placeholder="请选择" style="width: 80%;">
                    <el-option style="width: 100%;"
                        v-for="item in teacherInfosForNA.filter(i => i.role?.includes(Role.NOMINAL_TUTOR))" :key="item.id"
                        :label="item.name + ' ' + item.teacherId" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="学术导师">
                <el-select v-model="studentInfo.academicTutorId" filterable placeholder="请选择" style="width: 80%;">
                    <el-option style="width: 100%;"
                        v-for="item in teacherInfosForNA.filter(i => i.role?.includes(Role.ACADEMIC_TUTOR))" :key="item.id"
                        :label="item.name + ' ' + item.teacherId" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="() => dialogStudent = false">Cancel</el-button>
                <el-button type="primary" @click="() => save('s')">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogTeacher" title="教师信息" width="30%" align-center>
        <div class="form">
            <div class="form-item"><el-input v-model="teacherInfo.teacherId" placeholder="工号" />
            </div>
            <div class="form-item"><el-input v-model="teacherInfo.name" placeholder="姓名" /></div>
            <div style="margin: 5px 0;">
                <el-select v-model="teacherInfo.role" multiple placeholder="身份" style="width: 80%;">
                    <el-option v-for="item in Object.entries(Role).filter(i => i[0] != Role.STUDENT)" :key="item[0]"
                        :label="item[0]" :value="item[0]" />
                </el-select>
            </div>
            <div style="margin: 5px 0;">
                <el-select v-model="teacherInfo.title" placeholder="职称" style="width: 80%;">
                    <el-option v-for="item in Object.entries(Title)" :key="item[0]" :label="item[0]" :value="item[0]" />
                </el-select>
            </div>
            <div class="form-item"><el-input v-model="teacherInfo.schoolName" placeholder="学校" /></div>
            <div class="form-item"><el-input v-model="teacherInfo.departmentName" placeholder="学院" /></div>
            <div class="form-item"><el-input v-model="teacherInfo.emailAddress" placeholder="邮箱" /></div>
            <div class="form-item"><el-input v-model="teacherInfo.phoneNumber" placeholder="电话" /></div>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="() => dialogTeacher = false">Cancel</el-button>
                <el-button type="primary" @click="() => save('t')">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogPerson">
        <el-descriptions title="人员信息">
            <el-descriptions-item label="UserID">
                {{ person.userId }}
            </el-descriptions-item>
            <el-descriptions-item label="学工号">
                {{ person.studentId || person.teacherId }}
            </el-descriptions-item>
            <el-descriptions-item label="姓名">
                {{ person.name }}
            </el-descriptions-item>
            <el-descriptions-item label="身份">
                {{ person.role.includes(Role.STUDENT) ? '学生' : '教师' }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
                {{ person.emailAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="电话">
                {{ person.phoneNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="职称" v-if="person.title !== ''">
                {{ person.title }}
            </el-descriptions-item>
            <el-descriptions-item label="挂名导师" v-if="person.nominalTutor">
                {{ person.nominalTutor?.name + ' ' + person.nominalTutor?.teacherId }}
            </el-descriptions-item>
            <el-descriptions-item label="学术导师" v-if="person.academicTutor">
                {{ person.academicTutor?.name + ' ' + person.academicTutor?.teacherId }}
            </el-descriptions-item>
        </el-descriptions>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { Edit, Search } from '@element-plus/icons-vue'
import { Ref, ref, watch } from 'vue';
import { Title } from '~/entity/enum/Title'
import { Role } from '~/entity/enum/Role'
import { useAuthStore } from '~/store/authStore';
import webApi from '~/util/webApi';
import { GetStudentInfoRes, GetTeacherInfoRes, UsualRes } from '~/util/webRes';
import { ElMessage } from 'element-plus';
import { TeacherInfo } from '~/entity/base/Teacher';

//表单筛选
const filter = ref({
    identify: ''
})
watch(filter, (val) => {
    search(val.identify)
}, { deep: true })
//表单数据
const tableData: Ref<Array<any>> = ref([])

const file1 = ref()
const file2 = ref()
//获取教师信息
const teacherInfosForNA = ref<TeacherInfo[]>([])
function getTeacherInfo(pageIndex = 1, content: string = '') {
    webApi.post<GetTeacherInfoRes>(`/getTeacherInfoBy?current= ${pageIndex}`, {}).then(res => {
        teacherInfosForNA.value.push(...res.data.data)
        const targets = res.data.data
            .filter(i =>
                i.teacherId?.includes(content) || i.name?.includes(content) || i.emailAddress?.includes(content) || i.phoneNumber?.includes(content) ||
                i.role?.find(i => i == content) || i.title?.includes(content) || i.schoolName?.includes(content) || i.departmentName?.includes(content)
            )
        tableData.value.push(...targets)
        const { page, size, total } = res.data
        if (page * size < total) return getTeacherInfo(pageIndex + 1, content)
    })
}

//获取学生信息
function getStudentInfo(pageIndex = 1, content: string = '') {
    webApi.post<GetStudentInfoRes>(`/getStudentInfoBy?current= ${pageIndex}`, {}).then(res => {
        const targets = res.data.data
            .filter(i =>
                i.studentId?.includes(content) || i.name?.includes(content) || i.emailAddress?.includes(content) || i.phoneNumber?.includes(content) ||
                i.role?.find(i => i == content)
            )
        tableData.value.push(...targets)
        const { page, size, total } = res.data
        if (page * size < total) return getStudentInfo(pageIndex + 1, content)
    })
}

setTimeout(() => {
    ElMessage.success('加载完毕');
    getTeacherInfo()
    getStudentInfo()
}, 850)

const pageIndex = ref(0)
const changePage = (e: number) => pageIndex.value = e - 1

//编辑页可见
const dialogTeacher = ref(false)
const dialogStudent = ref(false)

//个人信息页面
const dialogPerson = ref(false)

const person = ref<any>({})

//编辑页信息
const teacherInfo = ref({
    departmentName: '',
    emailAddress: '',
    id: '',
    name: '',
    phoneNumber: '',
    role: [],
    schoolName: '',
    teacherId: '',
    title: '',
    userId: ''
})

const studentInfo = ref({
    academicTutorId: '',
    nominalTutorId: '',
    emailAddress: '',
    id: '',
    name: '',
    phoneNumber: '',
    role: [],
    studentId: '',
    userId: ''
})

const add = (identify: 's' | 't') => {
    if (identify == 's') {
        //清空studentInfo的值
        studentInfo.value = {
            academicTutorId: '',
            emailAddress: '',
            id: '',
            name: '',
            nominalTutorId: '',
            phoneNumber: '',
            role: [],
            studentId: '',
            userId: ''
        }
        dialogStudent.value = true
    } else {
        teacherInfo.value = {
            departmentName: '',
            emailAddress: '',
            id: '',
            name: '',
            phoneNumber: '',
            role: [],
            schoolName: '',
            teacherId: '',
            title: '',
            userId: ''
        }
        dialogTeacher.value = true
    }
}

//人员搜索
const searchContent = ref('')
const search = (content = '') => {
    while (tableData.value.length) {
        tableData.value.pop()
    }
    while (teacherInfosForNA.value.length > 0) teacherInfosForNA.value.pop()
    getTeacherInfo(1, content)
    getStudentInfo(1, content)
}


const edit = (e: any, identify: 's' | 't') => {
    if (identify == 's') {
        studentInfo.value = e
        studentInfo.value.academicTutorId = e.academicTutor?.id || ''
        studentInfo.value.nominalTutorId = e.nominalTutor?.id || ''
        dialogStudent.value = true
    } else {
        teacherInfo.value = e
        dialogTeacher.value = true
    }
}

const viewInfo = (e: any) => {
    //@ts-ignore
    Object.keys(e).forEach(key => person.value[key] = e[key])
    dialogPerson.value = true
}
const save = (identify: 's' | 't') => {
    //身份为student
    if (identify == 's') {
        const exist = tableData.value.find(i => i.studentId == studentInfo.value.studentId)
        if (!exist || studentInfo.value.studentId == '') {
            tableData.value.unshift(studentInfo.value)
            webApi.post<UsualRes>('/createStudentInfo', studentInfo.value).then(res => {
                ElMessage(JSON.stringify(res))
            })
        } else {
            //@ts-ignore
            Object.keys(exist).forEach(key => exist[key] = studentInfo.value[key])
            webApi.post<UsualRes>('/updateStudentInfo', studentInfo.value).then(res => {
                ElMessage(JSON.stringify(res))
            })
        }

        //隐藏dialog
        dialogStudent.value = false
    }
    //身份为teacher
    else {
        const exist = tableData.value.find(i => i.teacherId == teacherInfo.value.teacherId)

        if (!exist) {
            tableData.value.unshift(teacherInfo.value)
            webApi.post<UsualRes>('/createTeacherInfo', teacherInfo.value).then(res => {
                ElMessage(JSON.stringify(res))
            })
        } else {
            //@ts-ignore
            Object.keys(exist).forEach(key => exist[key] = teacherInfo.value[key])
            webApi.post<UsualRes>('/updateTeacherInfo', teacherInfo.value).then(res => {
                ElMessage(JSON.stringify(res))
            })
        }

        //隐藏dialog
        dialogTeacher.value = false

    }
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