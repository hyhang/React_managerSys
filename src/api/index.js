import ajax from './ajax'
import jsonp from 'jsonp'
import {
  message
} from 'antd'

const BASE = ''
//登录请求接口
export const reqLogin = (username, password) => ajax(BASE + '/login', {
  username,
  password
}, 'POST')

//获取商品分类一级（二级）列表
export const reqCategory = (parentId) => ajax(BASE + '/manage/category/list', {
  parentId
})

//修改分类名称
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + 'manage/category/update', {
  categoryId,
  categoryName
}, 'POST')

//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + 'manage/category/add', {
  categoryName,
  parentId
}, 'POST')

//获取商品信息
export const reqProducts = ({
  pageNum,
  pageSize
}) => ajax(BASE + '/manage/product/list', {
  pageNum,
  pageSize
})

//根据搜索关键字查找商品
export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchType,
  keyWord
}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: keyWord
})

//修改商品上下架信息
export const reqUpdateStatus = (productId, status) => ajax(BASE + 'manage/product/updateStatus', {
  productId,
  status
}, 'POST')

//根据id获取分类
export const reqCategoryById = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

//删除上传图片
export const reqDeletePicture = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

//更新(添加)商品
export const reqAddOrUpdate = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

//获取用户列表
export const reqUserList = () => ajax(BASE + '/manage/user/list')

//Jsonp请求百度天气信息

export const reqWeather = city => {
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      jsonp(url, {}, (error, data) => {
        if (!error && data.status === 'success') {
          const {
            dayPictureUrl,
            weather
          } = data.results[0].weather_data[0]
          resolve({
            dayPictureUrl,
            weather
          })
        } else {
          message.error('获取天气信息失败！')
        }
      })
    });
  })
}