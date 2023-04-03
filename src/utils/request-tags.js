import axios from 'axios';
import { ElMessage } from 'element-plus';
import store from '@/store';
import { getToken } from '@/utils/auth';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: "http://10.68.201.141:18100",
  // 服务器部署
  baseURL: 'http://101.43.129.67:8080',

  // 超时
  timeout: 60000,
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  (error) => Promise.error(error)
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态

    const resStatus = res.data.code;
    if (resStatus == '200') {
      return res.data.data;
    } else {
      // Notification.error({
      //   title: res.data.msg
      // });
      return Promise.reject(res.data.msg);
    }
  },
  (error) => {
    console.log('err' + error);
    let { message } = error;
    if (message == 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常';
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
