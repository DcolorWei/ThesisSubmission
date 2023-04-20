<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <h2 style="color:#606266">内外审分配</h2>
    </div>
    <el-row :gutter="20" style="width: 80vw;">
        <el-col :span="7">
            <div class="sabar-list-item">
                <div style="margin:12px;">
                    <el-checkbox v-model="allInnerChoose" label="全选" size="large" />
                    <el-input v-model="innerSearch" placeholder="搜索内审导师">
                        <template #suffix>
                            <el-icon>
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                </div>
                <div v-for="teacher, idx in innerAuditorInfos" :key="idx" style="margin: 12px;">
                    <el-card>
                        <el-descriptions class="margin-top" :title="teacher.teacherId + ' ' + teacher.name" :column="1"
                            size="small" border>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="cell-item">
                                        学校
                                    </div>
                                </template>
                                {{ teacher.schoolName }}
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="cell-item">
                                        学院
                                    </div>
                                </template>
                                {{ teacher.departmentName }}
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="cell-item">
                                        内审任务数量
                                    </div>
                                </template>
                                {{ teacher.innerProcessNum }}
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-checkbox label="选入" v-model="innerAuditorInfos[idx].choose" />
                    </el-card>
                </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="sabar-list-item">
                <div style="margin:12px">
                    <el-checkbox v-model="allOuterChoose" label="全选" size="large" />
                    <el-input v-model="outerSearch" placeholder="搜索外审导师">
                        <template #suffix>
                            <el-icon>
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                </div>
                <div v-for="teacher, idx in outerAuditorInfos" :key="idx" style="margin: 12px;">
                    <el-card>
                        <el-descriptions class="margin-top" :title="teacher.teacherId + ' ' + teacher.name" :column="1"
                            size="small" border>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="cell-item">
                                        学校
                                    </div>
                                </template>
                                {{ teacher.schoolName }}
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="cell-item">
                                        学院
                                    </div>
                                </template>
                                {{ teacher.departmentName }}
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="cell-item">
                                        外审任务数量
                                    </div>
                                </template>
                                {{ teacher.innerProcessNum }}
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-checkbox label="选入" v-model="outerAuditorInfos[idx].choose" />
                    </el-card>
                </div>
            </div>
        </el-col>
        <el-col :span="10">
            <div class="sabar-list-item">
                <div style="margin:12px">
                    <el-checkbox v-model="allFlowChoose" label="全选" size="large" />
                </div>
                <div v-for="flow, idx in flowInfos" :key="idx" style="margin: 12px;">
                    <el-card>
                        <el-descriptions :column="3" :title="flow.studentId + ' ' + flow.studentName" size="small" border>
                            <el-descriptions-item width="100px">
                                <template #label>
                                    <div class="cell-item"
                                        style="display:flex; justify-content:space-between;align-items: center;">
                                        <div>内审导师</div>
                                        <Switch style="width: 1em; height: 1em;cursor: pointer;"
                                            @click="() => changeTeacher(1, flow.id!)" />
                                    </div>
                                </template>
                                <div v-if="flow.innerAuditor">
                                    {{ flow.innerAuditor?.teacherId + ' ' + flow.innerAuditor?.name }}
                                </div>
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-descriptions :column="3" size="small" border>
                            <el-descriptions-item width="100px">
                                <template #label>
                                    <div class="cell-item"
                                        style="display:flex; justify-content:space-between;align-items: center;">
                                        <div>外审导师1</div>
                                        <Switch style="width: 1em; height: 1em;cursor: pointer;"
                                            @click="() => changeTeacher(2, flow.id!)" />
                                    </div>
                                </template>
                                <div v-if="flow.outerAuditor1">
                                    {{ flow.outerAuditor1?.teacherId + ' ' + flow.outerAuditor1?.name }}
                                </div>
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-descriptions :column="3" size="small" border>
                            <el-descriptions-item width="100px">
                                <template #label>
                                    <div class="cell-item"
                                        style="display:flex; justify-content:space-between;align-items: center;">
                                        <div>外审老师2</div>
                                        <Switch style="width: 1em; height: 1em;cursor: pointer;"
                                            @click="() => changeTeacher(3, flow.id!)" />
                                    </div>
                                </template>
                                <div v-if="flow.outerAuditor2">
                                    {{ flow.outerAuditor2?.teacherId + ' ' + flow.outerAuditor2?.name }}
                                </div>
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-descriptions :column="3" size="small" border>
                            <el-descriptions-item width="100px">
                                <template #label>
                                    <div class="cell-item">
                                        当前状态
                                    </div>
                                </template>
                                {{ flow.status }}
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-checkbox label="选入" v-model="flowInfos[idx].choose" />
                    </el-card>
                </div>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-button type="warning" style="margin: 10px auto;" @click="() => assignAudit()">预览分配</el-button>
    </el-row>

    <el-row>
        <el-button type="primary" style="margin: 10px auto;" @click="() => savePlan()">保存方案</el-button>
    </el-row>

    <!-- 弹窗，用于更换内审教师 -->
    <el-dialog title="更换内审教师" v-model="showInnerAuditorDialog" style="overflow-y: scroll;height: 50vh;">
        <el-input v-model="searchInner"></el-input>
        <el-table :data="innerAuditorInfosBak.filter(i => JSON.stringify(i).includes(searchInner))" style="width: 90vw">
            <el-table-column prop="teacherId" label="工号" width="110" />
            <el-table-column prop="name" label="教师姓名" width="150" />
            <el-table-column prop="schoolName" label="学校" />
            <el-table-column prop="departmentName" label="学院" />
            <el-table-column width="80">
                <template #default="{ row }">
                    <el-button type="warning" plain round size="small" @click="() => {
                        flowInfos.find(i => i.id == currentFlowId)!.innerAuditor = row;
                        showInnerAuditorDialog = false;
                    }">指定</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>

    <!-- 弹窗，用于更换外审教师1 -->
    <el-dialog title="更换外审老师1" v-model="showOuterAuditorDialog1" style="overflow-y: scroll;height: 50vh;">
        <el-input v-model="searchOuter1"></el-input>
        <el-table :data="outerAuditorInfosBak.filter(i => JSON.stringify(i).includes(searchOuter1))" style="width: 90vw">
            <el-table-column prop="teacherId" label="工号" width="110" />
            <el-table-column prop="name" label="教师姓名" width="150" />
            <el-table-column prop="schoolName" label="学校" />
            <el-table-column prop="departmentName" label="学院" />
            <el-table-column width="80">
                <template #default="{ row }">
                    <el-button type="warning" plain round size="small" @click="() => {
                        flowInfos.find(i => i.id == currentFlowId)!.outerAuditor1 = row;
                        showOuterAuditorDialog1 = false;
                    }">指定</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>

    <!-- 弹窗，用于更换外审教师2 -->
    <el-dialog title="更换外审老师2" v-model="showOuterAuditorDialog2" style="overflow-y: scroll;height: 50vh;">
        <el-input v-model="searchOuter2"></el-input>
        <el-table :data="outerAuditorInfosBak.filter(i => JSON.stringify(i).includes(searchOuter2))" style="width: 90vw">
            <el-table-column prop="teacherId" label="工号" width="110" />
            <el-table-column prop="name" label="教师姓名" width="150" />
            <el-table-column prop="schoolName" label="学校" />
            <el-table-column prop="departmentName" label="学院" />
            <el-table-column width="80">
                <template #default="{ row }">
                    <el-button type="warning" plain round size="small" @click="() => {
                        flowInfos.find(i => i.id == currentFlowId)!.outerAuditor2 = row;
                        showOuterAuditorDialog2 = false;
                    }">指定</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { Ref, ref, watch } from 'vue';
import { ProcessDetail } from '~/entity/base/Process';
import { TeacherInfo } from '~/entity/base/Teacher';
import { FlowStatus } from '~/entity/enum/Flow';
import { Role } from '~/entity/enum/Role';
import webApi from '~/util/webApi';
import { GetFlowDetailRes, GetTeacherInfoRes, AssignAuditRes } from '~/util/webRes';

import { Switch, Search } from '@element-plus/icons-vue'

const innerAuditorInfos: Ref<TeacherInfo[]> = ref([]);
const innerAuditorInfosBak: Ref<TeacherInfo[]> = ref([]);
const outerAuditorInfos: Ref<TeacherInfo[]> = ref([]);
const outerAuditorInfosBak: Ref<TeacherInfo[]> = ref([]);
const flowInfos: Ref<ProcessDetail[]> = ref([]);


//搜索
const searchInner = ref('')
const searchOuter1 = ref('')
const searchOuter2 = ref('')

//全选按钮
const allInnerChoose = ref()
const allOuterChoose = ref()
const allFlowChoose = ref()

watch(allInnerChoose, () => {
    if (allInnerChoose.value) {
        innerAuditorInfos.value.forEach(i => i.choose = true)
    } else {
        innerAuditorInfos.value.forEach(i => i.choose = false)
    }
})

watch(allOuterChoose, () => {
    if (allOuterChoose.value) {
        outerAuditorInfos.value.forEach(i => i.choose = true)
    } else {
        outerAuditorInfos.value.forEach(i => i.choose = false)
    }
})

watch(allFlowChoose, () => {
    if (allFlowChoose.value) {
        flowInfos.value.forEach(i => i.choose = true)
    } else {
        flowInfos.value.forEach(i => i.choose = false)
    }
})


const getInnerTeacherInfo = (pageIndex = 1) => {
    webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', { role: [Role.INNER_AUDITOR] }).then(res => {
        const data: Array<any> = res.data.data.sort((a, b) => a.innerProcessNum - b.innerProcessNum);
        data.forEach(i => i.choose = false)
        innerAuditorInfos.value = data.map(i => i);
        innerAuditorInfosBak.value = data.map(i => i);
        //去除重复项
        innerAuditorInfos.value = innerAuditorInfos.value.filter((item, index, array) => {
            return array.findIndex(i => i.teacherId == item.teacherId) === index;
        });
        innerAuditorInfosBak.value = innerAuditorInfosBak.value.filter((item, index, array) => {
            return array.findIndex(i => i.teacherId == item.teacherId) === index;
        });
        if (innerAuditorInfos.value.length < res.data.total) {
            getInnerTeacherInfo(pageIndex + 1)
        }
    });
}

const getOuterTeacherInfo = (pageIndex = 1) => {
    webApi.post<GetTeacherInfoRes>('/getTeacherInfoBy', { role: [Role.OUTER_AUDITOR] }).then(res => {
        const data: Array<any> = res.data.data.sort((a, b) => a.outerProcessNum - b.outerProcessNum);
        data.forEach(i => i.choose = false)
        outerAuditorInfos.value = data.map(i => i);
        outerAuditorInfosBak.value = data.map(i => i);
        //去除重复项
        outerAuditorInfos.value = outerAuditorInfos.value.filter((item, index, array) => {
            return array.findIndex(i => i.teacherId == item.teacherId) === index;
        });
        outerAuditorInfosBak.value = outerAuditorInfosBak.value.filter((item, index, array) => {
            return array.findIndex(i => i.teacherId == item.teacherId) === index;
        });
        if (outerAuditorInfos.value.length < res.data.total) {
            getOuterTeacherInfo(pageIndex + 1)
        }
    });
}

//更换教师
const showInnerAuditorDialog: Ref<boolean> = ref(false)
const showOuterAuditorDialog1: Ref<boolean> = ref(false)
const showOuterAuditorDialog2: Ref<boolean> = ref(false)

function getFlowInfo(pageIndex = 1, filter: any) {
    webApi.post<GetFlowDetailRes>(`/getFlowInfo?current= ${pageIndex}`, filter).then(res => {
        flowInfos.value.push(...res.data.data)
        if (flowInfos.value.length < res.data.total) {
            getFlowInfo(pageIndex + 1, filter)
        }
    })
}

setTimeout(() => {
    getInnerTeacherInfo();
    getOuterTeacherInfo();
    getFlowInfo(1, { flowStatus: "TEACHER_CONFIRMED" });
}, 850)

const currentFlowId = ref<string | number>()
const changeTeacher = (index: number, flowId: string | number) => {
    currentFlowId.value = flowId;
    switch (index) {
        case 1:
            showInnerAuditorDialog.value = true
            break
        case 2:
            showOuterAuditorDialog1.value = true
            break
        case 3:
            showOuterAuditorDialog2.value = true
            break
    }
}

const innerSearch = ref('')
const outerSearch = ref('')

watch(innerSearch, () => {
    if (innerSearch.value === '') {
        getInnerTeacherInfo()
        return
    } else {
        innerAuditorInfos.value = innerAuditorInfos.value.filter(i =>
            i.name.includes(innerSearch.value) || i.teacherId?.includes(innerSearch.value) || i.schoolName?.includes(innerSearch.value) || i.departmentName?.includes(innerSearch.value)
        )
    }
})

watch(outerSearch, () => {
    if (outerSearch.value === '') {
        getOuterTeacherInfo()
        return
    } else {
        outerAuditorInfos.value = outerAuditorInfos.value.filter(i =>
            i.name.includes(outerSearch.value) || i.teacherId?.includes(outerSearch.value) || i.schoolName?.includes(outerSearch.value) || i.departmentName?.includes(outerSearch.value)
        )
    }
})

const assignAudit = () => {
    const submitForm: any = {
        assignType: 1,
        innerTeachers: innerAuditorInfos.value.filter(i => i.choose).map(i => i.id),
        outerTeachers: outerAuditorInfos.value.filter(i => i.choose).map(i => i.id),
        flows: flowInfos.value.filter(i => i.choose).map(i => i.id)
    }

    if (submitForm.innerTeachers.length === 0) {
        alert('请至少选择一个内审导师');
        return
    }
    if (submitForm.outerTeachers.length === 0) {
        alert('请至少选择一个外审导师');
        return
    }
    if (submitForm.flows.length === 0) {
        alert('请至少选择一个学生');
        return
    }
    webApi.post<AssignAuditRes>('/assignAudit', submitForm).then(res => {
        //删除未被选择的教师项和Flow项
        innerAuditorInfos.value = innerAuditorInfos.value.filter(i => i.choose);
        outerAuditorInfos.value = outerAuditorInfos.value.filter(i => i.choose);
        flowInfos.value = flowInfos.value.filter(i => i.choose);
        //检查flow分配有空白的项目
        const empty = flowInfos.value.find(i => !(i.innerAuditor && i.outerAuditor1 && i.outerAuditor2))
        if (empty) {
            ElMessage.error("存在未分配的学生，请注意检查")
        }
        //遍历返回结果，补充对应的flow信息
        res.data.forEach((item: any) => {
            const flow = flowInfos.value.find(flow => flow.id === item.id);
            if (flow) {
                flow.innerAuditor = item.innerAuditor;
                flow.outerAuditor1 = item.outerAuditor1;
                flow.outerAuditor2 = item.outerAuditor2;
            }
        });
        //重新排序flows，将有空白的flow放到最前
        flowInfos.value.sort((a, b) => {
            if (a.innerAuditor && a.outerAuditor1 && a.outerAuditor2) {
                return 1
            } else {
                return -1
            }
        })
    });
}

const savePlan = () => {
    //保存分配方案，向服务器提交，成功后重新请求学生和教师的数据
    flowInfos.value.forEach(async (flow) => {
        await webApi.post('/reassignFlow', {
            id: flow.id,
            innerAuditorId: flow.innerAuditor?.id,
            outerAuditorId1: flow.outerAuditor1?.id,
            outerAuditorId2: flow.outerAuditor2?.id
        }).then((res) => {
            ElMessage('保存成功')
            ElMessage(JSON.stringify(res))
            // 重新请求学生、教师以及flow数据
            getInnerTeacherInfo();
            getOuterTeacherInfo();
            getFlowInfo();
        })
    })
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

.sabar-list-item {
    height: 70vh;
    border: 1px solid #9f9f9f;
    border-radius: 8px;
    overflow-y: scroll;
}

::-webkit-scrollbar {
    width: 2px;
    height: 16px;
    background-color: #F5F5F5;
}

/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    border-radius: 10px;
    background-color: #F5F5F5;
}

/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, .3);
    background-color: #9d9d9d;
}
</style>