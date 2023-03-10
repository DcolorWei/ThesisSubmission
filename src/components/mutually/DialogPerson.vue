<template>
    <el-button type="info" plain @click="() => centerDialogVisible = true">
        <slot></slot>
    </el-button>

    <el-dialog v-model="centerDialogVisible" title="新增人员" width="30%" align-center>
        <div class="form">
            <div class="form-item"><el-input placeholder="学号/工号" /></div>
            <div class="form-item"><el-input placeholder="姓名" /></div>
            <div class="form-item"><el-input placeholder="身份" /></div>
            <div class="form-item"><el-input placeholder="学院" /></div>
            <div class="form-item"><el-input placeholder="班级" /></div>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="() => centerDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="() => centerDialogVisible = false">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const centerDialogVisible = ref(false)
</script>
<style scoped>
.form{
    display: flex;
    flex-direction: column;
}
.form-item {
    width: 80%;
    margin: 5px auto;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>