import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'

const BASE = ''
//登录请求接口
export const reqLogin =  (username, password) => ajax(BASE + '/login' , {username, password}, 'POST')

//获取商品分类一级（二级）列表
export const reqCategory = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

//修改分类名称
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE +'manage/category/update', {categoryId, categoryName},'POST')

//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + 'manage/category/add' ,{categoryName, parentId}, 'POST')

//Jsonp请求百度天气信息

export const reqWeather = city => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`

    return new Promise( (resolve, reject) => {
       setTimeout(() => {
        jsonp(url, {}, (error, data) => {
            if (!error && data.status === 'success') {
                const {
                    dayPictureUrl,
                    weather
                } = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            } else {
                message.error('获取天气信息失败！')
            }
        })   
       });
    })
}