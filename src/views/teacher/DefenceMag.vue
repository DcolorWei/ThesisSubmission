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
import { Ref, ref, reactive } from 'vue'

const defenceGroups = reactive([
    {
        "id": "52",
        "chairman": {
            "id": 9,
            "name": "周达数新更路",
            "schoolName": "候线书党",
            "departmentName": "争化次该",
            "title": "LECTURER",
            "userId": "12",
            "phoneNumber": "52",
            "teacherID": "57",
            "emailAddress": "l.sdofhwnyxp@qq.com",
            "role": null,
            "innerProcessNum": 71,
            "outerProcessNum": 87,
            "oralDefenceProcessNum": 23
        },
        "secretary": {
            "id": 29,
            "name": "段受教",
            "schoolName": "周如门常厂",
            "departmentName": "知向指与单真",
            "title": "ASSOCIATE_PROFESSOR",
            "userId": "59",
            "phoneNumber": "72",
            "teacherID": "29",
            "emailAddress": "u.wbof@qq.com",
            "role": [
                "adipisicing",
                "Ut ullamco"
            ],
            "innerProcessNum": 81,
            "outerProcessNum": 43,
            "oralDefenceProcessNum": 74
        },
        "defenceTime": "2017-02-25 17:00:20",
        "defencePlace": "elit",
        "committee": [
            {
                "id": 65,
                "name": "快事论装统",
                "schoolName": "马院路",
                "departmentName": "学易或形因建",
                "title": "PROFESSOR",
                "userId": "51",
                "phoneNumber": "23",
                "teacherID": "19",
                "emailAddress": "i.kbsrc@qq.com",
                "role": null,
                "innerProcessNum": 94,
                "outerProcessNum": 34,
                "oralDefenceProcessNum": 92
            },
            {
                "id": 53,
                "name": "理作省解当体",
                "schoolName": "人何老等员阶成",
                "departmentName": "院成心给许须研",
                "title": "PROFESSOR",
                "userId": "19",
                "phoneNumber": "97",
                "teacherID": "1",
                "emailAddress": "g.jluerpvfw@qq.com",
                "role": [
                    "Lorem non id dolor voluptate",
                    "consequat eu magna deserunt",
                    "ea",
                    "sed nisi ipsum",
                    "velit magna occaecat pariatur nostrud"
                ],
                "innerProcessNum": 42,
                "outerProcessNum": 86,
                "oralDefenceProcessNum": 90
            },
            {
                "id": 49,
                "name": "美华战亲采",
                "schoolName": "两一此较",
                "departmentName": "件必知",
                "title": "LECTURER",
                "userId": "92",
                "phoneNumber": "13",
                "teacherID": "52",
                "emailAddress": "w.ohpevfmv@qq.com",
                "role": [
                    "laborum et enim ut qui",
                    "adipisicing laborum Excepteur dolor qui",
                    "esse quis ex tempor magna"
                ],
                "innerProcessNum": 50,
                "outerProcessNum": 18,
                "oralDefenceProcessNum": 51
            }
        ],
        "capacity": 16,
        "nowcapacity": 25
    },
    {
        "id": "63",
        "chairman": {
            "id": 20,
            "name": "把即代任",
            "schoolName": "与第行",
            "departmentName": "以按住得该",
            "title": "LECTURER",
            "userId": "33",
            "phoneNumber": "57",
            "teacherID": "57",
            "emailAddress": "e.bkhn@qq.com",
            "role": null,
            "innerProcessNum": 3,
            "outerProcessNum": 31,
            "oralDefenceProcessNum": 41
        },
        "secretary": {
            "id": 85,
            "name": "有受社步",
            "schoolName": "对式太速",
            "departmentName": "劳着太需",
            "title": "    LECTURER",
            "userId": "91",
            "phoneNumber": "46",
            "teacherID": "58",
            "emailAddress": "h.jmrih@qq.com",
            "role": null,
            "innerProcessNum": 97,
            "outerProcessNum": 35,
            "oralDefenceProcessNum": 33
        },
        "defenceTime": "2012-02-16 01:40:49",
        "defencePlace": "et laborum dolore",
        "committee": [
            {
                "id": 18,
                "name": "四军明型决院",
                "schoolName": "样己入光发山",
                "departmentName": "政再并",
                "title": "ASSOCIATE_PROFESSOR",
                "userId": "2",
                "phoneNumber": "86",
                "teacherID": "69",
                "emailAddress": "y.vghgdlgv@qq.com",
                "role": null,
                "innerProcessNum": 80,
                "outerProcessNum": 4,
                "oralDefenceProcessNum": 50
            }
        ],
        "capacity": 35,
        "nowcapacity": 42
    }
])
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