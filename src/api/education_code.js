
import request from '@/utils/request'

// 查询教育厅码值列表
export function listEducation_code(query) {
  return request({
    url: '/education_code/education_code/list',
    method: 'get',
    params: query
  })
}

// 查询教育厅码值详细
export function getEducation_code(tableEn) {
  return request({
    url: '/education_code/education_code/' + tableEn,
    method: 'get'
  })
}

// 新增教育厅码值
export function addEducation_code(data) {
  return request({
    url: '/education_code/education_code',
    method: 'post',
    data: data
  })
}

// 修改教育厅码值
export function updateEducation_code(data) {
  return request({
    url: '/education_code/education_code',
    method: 'put',
    data: data
  })
}

// 删除教育厅码值
export function delEducation_code(tableEn) {
  return request({
    url: '/education_code/education_code/' + tableEn,
    method: 'delete'
  })
}

// 导出教育厅码值
export function exportEducation_code(query) {
  return request({
    url: '/education_code/education_code/export',
    method: 'get',
    params: query
  })
}