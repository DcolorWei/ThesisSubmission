import axios from 'axios'
import { useAuthStore } from '~/store/authStore'
import { Params } from './type'

axios.defaults.baseURL = 'https://home.viger.xyz:9512'
const get = async <T>(url: string, params?: Params<Object>): Promise<T> => {
    if (useAuthStore().token == '') return null as T
    return new Promise<T>(r => {
        let token = useAuthStore().token
        axios({
            url: url,
            method: 'get',
            params: params,
            headers: {
                token: token
            }
        }).then(res => r(res.data as T)).catch(() => r(null as T))
    })
}

const post = async <T, K = Params<any>>(url: string, data?: K): Promise<T> => {
    if (useAuthStore().token == '') return null as T
    return new Promise<T>(r => {
        axios({
            url: url,
            method: 'post',
            data: data,
            headers: {
                "Content-Type": "application/json",
                token: useAuthStore().token
            }
        })
            .then(res => r(res.data as T))
            .catch(() => r(null as T))
    })
}



export default {
    get, post, axios
}