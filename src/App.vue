<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="router">
      <RouterView style="width: 90vw;margin: 0 auto;"></RouterView>
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { useAuthStore } from './store/authStore';
useAuthStore().login()
</script>
<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.router {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.element-plus-logo {
  width: 50%;
}
</style>
