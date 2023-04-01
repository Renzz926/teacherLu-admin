import request from '@/utils/request.js';
export const getCodeImg = () => {
  return request({
    url: '/captchaImage',
    method: 'get',
  });
};

// 登录方法
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data: data,
  });
}
