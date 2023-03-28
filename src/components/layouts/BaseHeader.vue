
<template>
  <el-menu mode="horizontal" default-active="1">
    <el-menu-item index="1">Thesis</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
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
