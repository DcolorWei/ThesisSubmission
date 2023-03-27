<script lang="ts" setup>
import { toggleDark } from '~/composables';
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1">Element Plus</el-menu-item>
    <el-sub-menu index="2">
<<<<<<< Updated upstream
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
=======
      <template #title>工作区</template>
      <el-menu-item index="2-1" @click="() => toPage('thesisstatus')">论文状态</el-menu-item>
      <el-menu-item index="2-3"  @click="() => toPage('processmag')">流程管理</el-menu-item>
      <el-menu-item index="2-4" @click="() => toPage('personsearch')">人员一览</el-menu-item>
      <el-menu-item index="2-5" @click="() => toPage('personsearch')">内外审设置</el-menu-item>
      <el-menu-item index="2-6" @click="() => toPage('defencemag')">答辩组管理</el-menu-item>

>>>>>>> Stashed changes
    </el-sub-menu>
    <el-menu-item index="3" disabled>Info</el-menu-item>
    <el-menu-item index="4">Orders</el-menu-item>
    <el-menu-item h="full" @click="toggleDark()">
      <button class="border-none w-full bg-transparent cursor-pointer" style="height: var(--ep-menu-item-height);">
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
  </el-menu>
</template>
