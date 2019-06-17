import axios from 'axios'

export default function ajax (url, data = {}, method = 'GET') {
    //异常统一处理
    let promise
    return new Promise( resolve => {
        if (method === 'GET') {
            promise = axios.get(url, {
                params : data
            })
        } else {
            promise = axios.post(url, data)
        }

        promise.then(
            ({data}) => {resolve(data)},
            reason => {alert(`请求出现错误${reason.message}`)}
        )
    })
}
