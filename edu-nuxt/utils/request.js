import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import cookie from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:9001', // api 的 base_url
  timeout: 20000, // 请求超时时间
  headers: {
    contentType: 'application/json;charset=utf-8'
  }
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 从cookie中获取token
    const token = cookie.get('guli_token');
    if (token ) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers['token'] = token;  //请求头加上token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response 拦截器
// service.interceptors.response.use(
//   res => res.data.code === 200 ? Promise.resolve(res) : Promise.reject(res),
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )
export default service
