import request from '@/utils/request.js';
export const getResouceList = () => {
  return request({
    url: '/getResouceList',
    method: 'get',
  });
};
export function indexApi(params) {
  return request({
    url: `/${params.script}`,
    method: 'post',
    data: params,
  });
}
