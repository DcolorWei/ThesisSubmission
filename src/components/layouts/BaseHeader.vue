

<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="2-1" v-if="useAuthStore().roled(Role.STUDENT)"
      @click="() => toPage('thesisstatus')">论文状态</el-menu-item>
    <el-menu-item index="2-2" v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)||useAuthStore().roled(Role.INNER_AUDITOR)||useAuthStore().roled(Role.OUTER_AUDITOR)"
      @click="() => toPage('processmag')">流程管理</el-menu-item>
    <el-menu-item index="2-4" v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)"
      @click="() => toPage('personmag')">人员管理</el-menu-item>
    <el-menu-item index="2-5" v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)"
      @click="() => toPage('innerouteraudit')">内外审设置</el-menu-item>
    <el-menu-item index="2-6" v-if="useAuthStore().roled(Role.ACADEMIC_REGISTRY)"
      @click="() => toPage('defencemag')">答辩组管理</el-menu-item>
    <el-menu-item>
      <div>
        学工号：{{ '' + (useAuthStore().teacherId ? useAuthStore().teacherId : '') +
          (useAuthStore().studentId ? useAuthStore().studentId : '') }}
      </div>
    </el-menu-item>

  </el-menu>
  <!-- 按钮组，用于快速切换身份和工号 -->
</template>
<script lang="ts" setup>
import { Role } from "~/entity/enum/Role";
import { useAuthStore } from "~/store/authStore";
import { router } from "../../route/index"
const toPage = (path: string) => {
  router.push(path)
}

</script>