
<template>
  <el-menu mode="horizontal" default-active="1">
    <el-menu-item index="1">Thesis</el-menu-item>
    <el-sub-menu index="2">
      <template #title>工作区</template>
      <el-menu-item index="2-1" @click="() => toPage('thesisstatus')">论文状态</el-menu-item>
      <el-menu-item index="2-3"  @click="() => toPage('processmag')">流程管理</el-menu-item>
      <el-menu-item index="2-4" @click="() => toPage('personsearch')">人员管理</el-menu-item>
      <el-menu-item index="2-5">权限管理</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="3" >任务列表</el-menu-item>
    <el-menu-item index="4" disabled>公告栏</el-menu-item>
    <el-menu-item index="5" disabled>关于</el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { router } from "../../route"
const toPage = (path: string = 'home') => {
  router.push(path)
}
</script>
