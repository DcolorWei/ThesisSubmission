import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/thesisstatus', component: () => import('../views/student/ThesisStatus.vue') },
    { path: '/processmag', component:()=>import('../views/teacher/ProcessMag.vue') },
    { path: '/uploadthesis', component: () => import('../views/student/UploadThesis.vue')  },
    { path: '/personmag', component:()=>import('../views/teacher/PersonMag.vue')},

    { path: '/innerouteraudit', component: () => import('../views/teacher/InnerOuterAudit.vue') },
    { path: '/defencemag', component: () => import('../views/teacher/DefenceMag.vue') },
]

//路由导航守卫

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})