import axios from 'axios'
import { Params } from './type'

axios.defaults.baseURL = 'http://home.viger.xyz:9511'
const get = async <T>(url: string, params: Params<Object>): Promise<T> => {
    return new Promise<T>(r => {
        axios({
            url: url,
            method: 'get',
            params: params
        }).then(res => r(res.data as T)).catch(() => r(null as T))
    })
}

const post = async <T, K = Params<any>>(url: string, data: K): Promise<T> => {
    return new Promise<T>(r => {
        axios({
            url: url,
            method: 'post',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => r(res.data as T))
            .catch(() => r(null as T))
    })
}



export default {
    get, post
}