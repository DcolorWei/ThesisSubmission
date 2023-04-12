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
                <el-descriptions-item label="主席">{{ item.chairman?.name }}</el-descriptions-item>
                <el-descriptions-item label="容量">{{ item.nowCapacity || 0 }}/{{ item.capacity || 'infinitas'
                }}</el-descriptions-item>
                <el-descriptions-item label="标记">
                    <el-tag size="small">Available</el-tag>
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
            </el-table>
            <div style="display:flex;justify-content: flex-end;margin-top: 20px;">
                <el-button type="warning" plain @click="() => edit(item)">编辑</el-button>
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
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker style="width: 80%;" v-model="form.defenceTime" type="datetime"
                        placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="地点">
                    <el-input v-model="form.defencePlace" style="width: 80%;"></el-input>
                </el-form-item>

                <!-- 容量，现数量 -->
                <el-form-item label="容量">
                    <el-input-number v-model="form.capacity" style="width: 80%;"></el-input-number>
                </el-form-item>
                <el-form-item label="现数量">
                    <el-input-number v-model="form.nowCapacity" style="width: 80%;"></el-input-number>
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
import { Ref, ref, reactive} from 'vue'
import { DefenceInfo } from '~/entity/base/Defence';
import webApi from '~/util/webApi';
import { GetDefenceGroupsRes, GetTeacherInfoRes, UsualRes } from '~/util/webRes';

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

setTimeout(() => {
    getTeacherInfo()
}, 850)

const dialogVisible = ref(false)
const form = reactive({
    id: '',
    chairman: '',
    secretary: '',
    committee: [] as any[],
    defenceTime: '',
    defencePlace: '',
    //容量，现数量
    capacity: 0,
    nowCapacity: 0
})

const add = () => {
    //清空原表单
    form.id = ''
    form.chairman = ''
    form.secretary = ''
    form.committee = []
    form.defenceTime = ''
    form.defencePlace = ''
    form.capacity = 0
    form.nowCapacity = 0

    dialogVisible.value = true;
}

const edit = (item: any) => {
    //清空原表单
    form.chairman = ''
    form.secretary = ''
    form.defenceTime = ''
    form.defencePlace = ''
    form.capacity = 0
    form.nowCapacity = 0

    while (form.committee.length) {
        form.committee.pop()
    }

    //填充表单
    form.id = item.id;
    form.chairman = item.chairman.id
    form.secretary = item.secretary.id
    form.defenceTime = item.defenceTime
    form.defencePlace = item.defencePlace
    form.committee.push(...item.committee.map((item: any) => item.id))
    form.capacity = item.capacity
    form.nowCapacity = item.nowCapacity

    dialogVisible.value = true;
}

const save = async () => {
    //若form存在id字段则为编辑，否则为新建

    //将时间转换为yyyy-MM-dd HH:mm:ss格式
    form.defenceTime = new Date(form.defenceTime).toLocaleString().replaceAll('/', '-')

    if (form.id) {
        await webApi.post<UsualRes>('/updateDefenceGroupInfo', form)
    } else {
        await webApi.post<UsualRes>('/createDefenceGroupInfo', form)
    }
    await webApi.post<GetDefenceGroupsRes>('/getDefenceGroupInfo', {}).then(res => {
        while (defenceGroups.length) {
            defenceGroups.pop()
        }
        defenceGroups.push(...res.data.data)
        dialogVisible.value = false
    })
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