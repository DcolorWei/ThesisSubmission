<template>
    <div style="margin-top: 20px;"></div>
    <div style="width: 90%;display: flex; align-items:flex-end;">
        <h2 style="color:#606266">流程管理</h2>
    </div>
    <div style="margin: 30px 0;width: 87vw;">
        <el-row :gutter="20">
            <el-col :span="4">
                <el-input placeholder="学号"></el-input>
            </el-col>
            <el-col :span="4">
                <el-input placeholder="姓名"></el-input>
            </el-col>
            <el-col :span="4">
                <el-input placeholder="指导教师"></el-input>
            </el-col>
            <el-col :span="3">
                <el-button>筛选</el-button>
            </el-col>
        </el-row>
    </div>
    <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left">学生信息</h3>
    <el-card body-style="width:85vw">
        <el-table
            :data="[{ id: student.data.studentId, name: student.data.name, phone: student.data.phoneNumber, email: student.data.emailAddress }]"
            style="width: 90vw">
            <el-table-column prop="id" label="学号" width="200" />
            <el-table-column prop="name" label="姓名" width="200" />
            <el-table-column prop="phone" label="电话" width="200" />
            <el-table-column prop="email" label="邮箱" />

        </el-table>

        <el-table :data="[{ thesisNo: process.thesisNo, evaluteNo: process.evaluteNo, thesisName: process.thesisName }]"
            style="width: 90vw">
            <el-table-column prop="thesisNo" label="论文号" width="200" />
            <el-table-column prop="thesisName" label="论文名称" :width="process.thesisName.length * 20" />
            <el-table-column>
                <template #default>
                    <el-tag type="warning" round>{{ status.status }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left">关联教师</h3>
    <el-card body-style="width:85vw">
        <el-table :data="[status.verifier, status.innerAuditor, status.outerAuditor]" style="width: 90vw">
            <el-table-column prop="name" label="教师姓名" width="150" />
            <el-table-column label="身份" width="150">
                <template #default="{ $index }">
                    {{ $index == 0 ? '确认老师' : $index == 1 ? '内审老师' : '外审老师' }}
                </template>
            </el-table-column>
            <el-table-column prop="schoolName" label="学校" />
            <el-table-column prop="departmentName" label="学院" />
            <el-table-column prop="phoneNumber" label="电话" width="150" />
            <el-table-column prop="emailAddress" label="邮箱" width="170" />
            <el-table-column>
                <template #default>
                    <el-button type="warning" plain round size="small">更换</el-button>
                    <el-button type="info" plain round size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <h3 style="color:#606266;width: 90%;margin-top: 20px;text-align: left">答辩信息</h3>
    <el-card body-style="width:85vw" style="margin-bottom: 30px;">
        <div style="display:flex;justify-content: flex-end;">
            <el-button type="warning" plain>更换答辩组</el-button>
        </div>
        <el-table :data="[status.defenceGroup.chairman, status.defenceGroup.secretary, ...status.defenceGroup.committee]"
            style="width: 90vw">
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
    </el-card>
</template>

<script lang="ts" setup>
import { column } from 'element-plus/es/components/table-v2/src/common';
import { Ref, ref, reactive } from 'vue'
import { ProcessDetail } from '~/entity/base/Process';
import { ProcessStatusRes, StudentInfoRes } from '~/util/webRes';


const student: StudentInfoRes = reactive(
    {
        "code": 18,
        "message": "ea consequat laboris",
        "data": {
            "id": 34,
            "name": "学气低京决了部",
            "userId": "44",
            "phoneNumber": "4008208820",
            studentId: '114514234',
            "emailAddress": "114514@xiabei.ze",
            "role": [
                "ad mollit dolore",
                "in qui in nisi irure",
                "Lorem",
                "mollit ut"
            ],
            "nominalTutor": null,
            flow: {
                id: 38,
                studentId: 11,
                studentName: "多传变计",
                defenceGroup: null,
                status: "PROCESS_END"
            }
        }
    }
)

const process: ProcessStatusRes = reactive(
    {
        evaluteNo: 41364256,
        thesisNo: 53928074,
        "thesisName": "太局队线干",
        "processCurrent": "nostrud mollit ut nulla",
        "processList": [
            {
                "statusId": 21,
                "statusName": "严见交我间",
                "updateTime": "1985-11-19 03:01:13",
                "handler": "Excepteur Lorem veniam cillum",
                "describe": "amet enim mollit in sed"
            },
            {
                "statusId": 94,
                "statusName": "权想多受克组",
                "updateTime": "2008-06-18 02:51:28",
                "describe": "amet",
                "handler": "laborum"
            }
        ],
    }
)

const status: ProcessDetail = reactive(
    {
        id: 53,
        studentId: 86,
        studentName: "给然原边那",
        status: "WAIT_ORAL_DEFENSE",
        verifier: {
            id: 26,
            name: "身联引",
            schoolName: "必再意又",
            departmentName: "人等或车多所",
            title: "PROFESSOR",
            userId: "13",
            phoneNumber: "23",
            teacherID: "30",
            emailAddress: "b.lshow@qq.com",
            role: [
                "in sunt pariatur qui",
                "Lorem in"
            ],
            innerProcessNum: 18,
            outerProcessNum: 33,
            oralDefenceProcessNum: 91
        },
        outerAuditor: {
            id: 90,
            name: "地学高",
            schoolName: "养议或约他口华",
            departmentName: "建没须程半步交",
            title: "PROFESSOR",
            userId: "8",
            phoneNumber: "43",
            teacherID: "18",
            emailAddress: "n.gcprmyai@qq.com",
            role: null,
            innerProcessNum: 92,
            outerProcessNum: 3,
            oralDefenceProcessNum: 84
        },
        innerAuditor: {
            id: 27,
            name: "委走该什好红",
            schoolName: "打马活要什",
            departmentName: "共与增社根更流",
            title: "PROFESSOR",
            userId: "27",
            phoneNumber: "35",
            teacherID: "41",
            emailAddress: "a.slzyxkcqy@qq.com",
            role: [
                "consequat velit ullamco",
                "irure enim ea laboris dolor",
                "in magna nisi"
            ],
            innerProcessNum: 29,
            outerProcessNum: 98,
            oralDefenceProcessNum: 22
        },
        defenceGroup: {
            "id": "38",
            "chairman": {
                "id": 71,
                "name": "事门用状车目直",
                "schoolName": "影离人领规",
                "departmentName": "示明当标体入",
                "title": "    PROFESSOR",
                "userId": "71",
                "phoneNumber": "17",
                "teacherID": "30",
                "emailAddress": "p.ohbrex@qq.com",
                "role": [
                    "reprehenderit ex cupidatat officia ea",
                    "et dolor",
                    "pariatur quis",
                    "deserunt esse",
                    "ut"
                ],
                "innerProcessNum": 41,
                "outerProcessNum": 13,
                "oralDefenceProcessNum": 37
            },
            "secretary": {
                "id": 68,
                "name": "意切状红后",
                "schoolName": "立王土式",
                "departmentName": "作太更风三走",
                "title": "    PROFESSOR",
                "userId": "39",
                "phoneNumber": "51",
                "teacherID": "24",
                "emailAddress": "l.fputtzn@qq.com",
                "role": null,
                "innerProcessNum": 58,
                "outerProcessNum": 15,
                "oralDefenceProcessNum": 5
            },
            "defenceTime": "1974-10-05 09:41:01",
            "defencePlace": "in tempor nostrud occaecat cupidatat",
            "committee": [
                {
                    "id": 50,
                    "name": "共新低何",
                    "schoolName": "圆层法运也县",
                    "departmentName": "习改装严他这义",
                    "title": "    PROFESSOR",
                    "userId": "73",
                    "phoneNumber": "18",
                    "teacherID": "17",
                    "emailAddress": "u.qshinp@qq.com",
                    "role": null,
                    "innerProcessNum": 40,
                    "outerProcessNum": 77,
                    "oralDefenceProcessNum": 34
                },
                {
                    "id": 67,
                    "name": "价装解先任",
                    "schoolName": "难存果间说",
                    "departmentName": "亲书此元山",
                    "title": "    LECTURER",
                    "userId": "3",
                    "phoneNumber": "65",
                    "teacherID": "4",
                    "emailAddress": "z.xeowofilru@qq.com",
                    "role": null,
                    "innerProcessNum": 23,
                    "outerProcessNum": 54,
                    "oralDefenceProcessNum": 15
                },
                {
                    "id": 28,
                    "name": "样别影级构产",
                    "schoolName": "儿它难红高",
                    "departmentName": "命白毛西路东打",
                    "title": "    PROFESSOR",
                    "userId": "11",
                    "phoneNumber": "83",
                    "teacherID": "17",
                    "emailAddress": "t.qcgjswimc@qq.com",
                    "role": [
                        "dolore ut labore laborum nisi",
                        "exercitation aliquip",
                        "quis enim",
                        "dolor incididunt magna velit"
                    ],
                    "innerProcessNum": 94,
                    "outerProcessNum": 37,
                    "oralDefenceProcessNum": 4
                },
                {
                    "id": 41,
                    "name": "单只几领情北",
                    "schoolName": "争间千上酸育战",
                    "departmentName": "用收所除",
                    "title": "    LECTURER",
                    "userId": "86",
                    "phoneNumber": "65",
                    "teacherID": "41",
                    "emailAddress": "v.hey@qq.com",
                    "role": [
                        "Excepteur labore voluptate adipisicing",
                        "nostrud incididunt",
                        "et ut esse Duis nostrud",
                        "qui ut elit laborum mollit"
                    ],
                    "innerProcessNum": 31,
                    "outerProcessNum": 69,
                    "oralDefenceProcessNum": 27
                }
            ],
            "capacity": 10,
            "nowcapacity": 6
        },
    }
)

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