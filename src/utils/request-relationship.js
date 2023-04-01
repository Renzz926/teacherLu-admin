import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store'
// import errorCode from '@/utils/errorCode'
import qs from 'qs'

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: "http://101.43.129.67:8080/api2",
  // 超时
  timeout: 3600000
})
// request拦截器
service.interceptors.request.use(config => {
  config.data = qs.stringify(config.data) // 转为formdata数据格式
  return config
},error => Promise.error(error))

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    if (res.data.type == "application/vnd.ms-excel") {
      return res;
    }
    const resStatus = res.data.success;
    if (resStatus) {
      return res.data;
    }
    else {
      ElMessage({
        message: res.data.info,
        type: 'error',
      })
      return Promise.reject(res.data.info)
    }
    // const code = res.data.code || 200;
    // // 获取错误信息
    // const msg = errorCode[code] || res.data.msg || errorCode['default']
    // if (code === 401) {
    //   MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }
    //   ).then(() => {
    //     store.dispatch('LogOut').then(() => {
    //       location.href = '/index';
    //     })
    //   }).catch(() => {});
    //   return Promise.reject('令牌验证失败')
    // } else if (code === 500) {
    //   Message({
    //     message: msg,
    //     type: 'error'
    //   })
    //   return Promise.reject(new Error(msg))
    // } else if (code !== 200) {
    //   Notification.error({
    //     title: msg
    //   })
    //   return Promise.reject('error')
    // } else {
    //   return res.data
    // }
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
