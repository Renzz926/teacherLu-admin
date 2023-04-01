import request from '@/utils/request.js';
export const getRouterList = (data) => {
  return request({
    url: '/getRouters',
    method: 'get',
    data,
  });
};
