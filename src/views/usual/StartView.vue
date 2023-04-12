<template>
    <!-- 开始欢迎界面 -->
    <div style="width: 100vw;height: 60vw;display: flex; justify-content: center;align-items: center;">
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "~/store/authStore";
import { router } from "../../route/index"
import { Role } from "~/entity/enum/Role";
import { ElMessage } from "element-plus";

setTimeout(() => {
    if (useAuthStore().token !== '' || useAuthStore().roles.length !== 0) {
        const role = useAuthStore().roles;
        if (role.includes(Role.STUDENT)) {
            ElMessage.success("欢迎登录，您的身份是：学生");
            router.push("/thesisstatus");
        } else {
            ElMessage.success("欢迎登录，您的身份是：教师");
            router.push("/processmag");
        }
    }
}, 1000)
</script>