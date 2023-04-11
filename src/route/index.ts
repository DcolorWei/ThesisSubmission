import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import StartViewVue from '../views/usual/StartView.vue'
import ThesisStatusVue from '../views/student/ThesisStatus.vue'
import ProcessMagVue from '../views/teacher/ProcessMag.vue'
import UploadThesisVue from '../views/student/UploadThesis.vue'
import PersonMagVue from '../views/teacher/PersonMag.vue'
import InnerOuterAuditVue from '../views/teacher/InnerOuterAudit.vue'
import DefenceMagVue from '../views/teacher/DefenceMag.vue'

const routes = [
    // { path: '/', component: () => import('../views/usual/StartView.vue') },
    // { path: '/thesisstatus', component: () => import('../views/student/ThesisStatus.vue') },
    // { path: '/processmag', component: () => import('../views/teacher/ProcessMag.vue') },
    // { path: '/uploadthesis', component: () => import('../views/student/UploadThesis.vue') },
    // { path: '/personmag', component: () => import('../views/teacher/PersonMag.vue') },

    // { path: '/innerouteraudit', component: () => import('../views/teacher/InnerOuterAudit.vue') },
    // { path: '/defencemag', component: () => import('../views/teacher/DefenceMag.vue') },
    { path: '/', component: StartViewVue },
    { path: '/thesisstatus', component: ThesisStatusVue },
    { path: '/processmag', component: ProcessMagVue },
    { path: '/uploadthesis', component: UploadThesisVue },
    { path: '/personmag', component: PersonMagVue },
    { path: '/innerouteraudit', component: InnerOuterAuditVue },
    { path: '/defencemag', component: DefenceMagVue },
]

//路由导航守卫

export const router = createRouter({
    history: createWebHistory(),
    routes
})