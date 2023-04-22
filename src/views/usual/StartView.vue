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
    try {
        if (useAuthStore().token !== '' && useAuthStore().roles.length !== 0) {
            const role = useAuthStore().roles;
            if(role&&role[0]==Role.STUDENT){
                router.push("/thesisstatus");
            }else if (role && role.length) {
                ElMessage.success("欢迎登录，您的身份是：" + role[0]);
                router.push("/processmag");
            } else {
                ElMessage.error("您的身份状态缺失，请联系管理员");
            }
        }
    } catch {
        ElMessage.error("您的身份状态有误，请联系管理员");
    }

}, 1000)
</script>