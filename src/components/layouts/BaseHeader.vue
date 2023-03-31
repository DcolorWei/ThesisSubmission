

<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="2-1" @click="() => toPage('thesisstatus')">论文状态</el-menu-item>
    <el-menu-item index="2-3" @click="() => toPage('processmag')">流程管理</el-menu-item>
    <el-menu-item index="2-4" @click="() => toPage('personsearch')">教师管理</el-menu-item>
    <el-menu-item index="2-5" @click="() => toPage('personsearch')">内外审设置</el-menu-item>
    <el-menu-item index="2-6" @click="() => toPage('defencemag')">答辩组管理</el-menu-item>
  </el-menu>
</template>
<script lang="ts" setup>
import { router } from "../../route/index"
const toPage = (path: string) => {
  router.push(path)
}

</script>