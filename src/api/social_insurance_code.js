import request from '@/utils/request'

// 查询社保缴纳码值列表
export function listSocial_insurance_code(query) {
  return request({
    url: '/social_insurance_code/social_insurance_code/list',
    method: 'get',
    params: query
  })
}

// 查询社保缴纳码值详细
export function getSocial_insurance_code(colunmName) {
  return request({
    url: '/social_insurance_code/social_insurance_code/' + colunmName,
    method: 'get'
  })
}

// 新增社保缴纳码值
export function addSocial_insurance_code(data) {
  return request({
    url: '/social_insurance_code/social_insurance_code',
    method: 'post',
    data: data
  })
}

// 修改社保缴纳码值
export function updateSocial_insurance_code(data) {
  return request({
    url: '/social_insurance_code/social_insurance_code',
    method: 'put',
    data: data
  })
}

// 删除社保缴纳码值
export function delSocial_insurance_code(colunmName) {
  return request({
    url: '/social_insurance_code/social_insurance_code/' + colunmName,
    method: 'delete'
  })
}

// 导出社保缴纳码值
export function exportSocial_insurance_code(query) {
  return request({
    url: '/social_insurance_code/social_insurance_code/export',
    method: 'get',
    params: query
  })
}