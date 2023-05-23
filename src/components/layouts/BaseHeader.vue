<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="2-1" v-if="useAuthStore().roled(Role.STUDENT)"
      @click="() => toPage('thesisstatus')">论文状态</el-menu-item>
    <el-menu-item index="2-2"
      v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY) || useAuthStore().roled(Role.INNER_AUDITOR) || useAuthStore().roled(Role.OUTER_AUDITOR)"
      @click="() => toPage('processmag')">流程管理</el-menu-item>
    <el-menu-item index="2-4" v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)"
      @click="() => toPage('personmag')">人员管理</el-menu-item>
    <el-menu-item index="2-5" v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)"
      @click="() => toPage('innerouteraudit')">内外审设置</el-menu-item>
    <el-menu-item index="2-6" v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)"
      @click="() => toPage('defencemag')">答辩组管理</el-menu-item>
    <el-menu-item>
      <div @dblclick="() => showVersion()">
        学工号：{{ '' + (useAuthStore().teacherId ? useAuthStore().teacherId : '') +
          (useAuthStore().studentId ? useAuthStore().studentId : '') }}
      </div>
    </el-menu-item>

  </el-menu>
</template>
<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { Role } from "~/entity/enum/Role";
import { useAuthStore } from "~/store/authStore";
import { router } from "../../route/index"
const toPage = (path: string) => {
  router.push(path)
}

const showVersion = () => {
  ElMessage('v0.2.11 05231613')
}
</script>