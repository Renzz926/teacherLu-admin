import request from '@/utils/request'

// 查询经济行业分类列表
export function listGb4754(query) {
  return request({
    url: '/gb4754_2017/gb4754/list',
    method: 'get',
    params: query
  })
}

// 查询经济行业分类详细
export function getGb4754(type) {
  return request({
    url: '/gb4754_2017/gb4754/' + type,
    method: 'get'
  })
}

// 新增经济行业分类
export function addGb4754(data) {
  return request({
    url: '/gb4754_2017/gb4754',
    method: 'post',
    data: data
  })
}

// 修改经济行业分类
export function updateGb4754(data) {
  return request({
    url: '/gb4754_2017/gb4754',
    method: 'put',
    data: data
  })
}

// 删除经济行业分类
export function delGb4754(type) {
  return request({
    url: '/gb4754_2017/gb4754/' + type,
    method: 'delete'
  })
}

// 导出经济行业分类
export function exportGb4754(query) {
  return request({
    url: '/gb4754_2017/gb4754/export',
    method: 'get',
    params: query
  })
}