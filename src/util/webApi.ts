import axios from 'axios'
import { Params } from './type'

axios.defaults.baseURL = ''
const get = async <T>(url: string, params: Params<Object>): Promise<T | null> => {
    return new Promise<T | null>(r => {
        axios.post(url, { params: params })
            .then(res => r(res.data as T))
            .catch(() => r(null))
    })
}

const post = async <T>(url: string, data: Params<T>): Promise<T | null> => {
    return new Promise<T | null>(r => {
        axios.post(url, data)
            .then(res => r(res.data as T))
            .catch(() => r(null))
    })
}



export default {

}