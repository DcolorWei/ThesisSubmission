import axios from 'axios'
import { Params } from './type'

axios.defaults.baseURL = ''
const get = async <T>(url: string, params: Params<Object>): Promise<T> => {
    
    return new Promise<T>(r => {
        axios.get(url)
    })
}

const post = async <T>(url: string, data: Params<T>): Promise<T> => {
    return new Promise<T>(r => {
        axios.post(url, data)
            .then(res => r(res.data as T))
            .catch(() => r(null as T))
    })
}



export default {

}