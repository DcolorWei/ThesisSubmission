import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/student/ThesisStatus.vue'
import ThesisStatus from '../views/student/ThesisStatus.vue'
import SubmitThesis from '../views/student/SubmitThesis.vue'
import ProcessMag from '~/views/teacher/ProcessMag.vue'
import PersonSearch from '../views/teacher/PersonSearch.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/thesisstatus', component: ThesisStatus },
    { path: '/processmag', component: ProcessMag },
    { path: '/submitthesis', component: SubmitThesis },
    { path: '/personsearch', component: PersonSearch },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置B，但我们在这里
// 暂时保持简单
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})