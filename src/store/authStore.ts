import { defineStore } from 'pinia'
import { Role } from '~/entity/enum/Role'
import webApi from '~/util/webApi'


import * as dd from 'dingtalk-jsapi';
import { onMounted } from 'vue';
import { StudentInfoRes, TeacherInfoRes } from '~/util/webRes';


onMounted(() => {
    dd.ready(function () {
        dd.runtime.permission.requestAuthCode({
            corpId: "corpid",
        });
    });
});

interface AuthCode {
    result: {
        code: string
    },
    method: string,
    success: boolean
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        studentId: null as number | string | null,
        teacherId: null as number | string | null,
        roles: [] as Role[]
    }),
    actions: {
        roled(role: Role) {
            if (this.roles.includes(role)) {
                return true
            } else {
                return false
            }
        },
        async login() {
            let that = this

            const code = await new Promise<string>((resolve) => {
                if (dd.env.platform == 'notInDingTalk') {
                    alert('非钉钉环境')
                    resolve('oo777')
                    return
                }
                dd.ready(() => {
                    // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
                    dd.runtime.permission.requestAuthCode({
                        corpId: "dinga636c7a8b99cfb07ffe93478753d9884"
                    }).then(async (res) => {
                        resolve(res.code)
                    }).catch((err) => {
                        resolve('')
                    })
                })
            })

            that.token = code
            // alert(code)
            webApi.get<{ data: Role[] }>('/roles').then(res => {
                that.roles = res.data
                webApi.get<StudentInfoRes>('/student/getStudentInfo').then(
                    res => {
                        that.studentId = res.data.studentId
                    }
                )
                webApi.get<TeacherInfoRes>('/teacher/getTeacherInfo').then(
                    res => {
                        that.teacherId = res.data.teacherId
                    }
                )
            }).catch(err => {
                console.log(err)
            })
        }
    }
})