import { createRouter, createWebHashHistory } from 'vue-router'

import ThesisStatus from '../views/student/ThesisStatus.vue'
import SubmitThesis from '../views/student/SubmitThesis.vue'
import ProcessMag from '~/views/teacher/ProcessMag.vue'
import TeacherMag from '../views/teacher/TeacherMag.vue'
import InnerOuterAudit from '~/views/teacher/InnerOuterAudit.vue'
import DefenceMag from '../views/teacher/DefenceMag.vue'

const routes = [
    { path: '/thesisstatus', component: ThesisStatus },
    { path: '/processmag', component: ProcessMag },
    { path: '/submitthesis', component: SubmitThesis },
    { path: '/teachermag', component: TeacherMag },

    { path: '/innerouteraudit', component: InnerOuterAudit },
    { path: '/defencemag', component: DefenceMag },

]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置B，但我们在这里
// 暂时保持简单
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})