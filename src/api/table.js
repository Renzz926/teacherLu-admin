import request from '@/utils/request'

// 查询dw信息列表
export function listTable(query) {
  return request({
    url: '/dw_table/table/list',
    method: 'get',
    params: query
  })
}

// 查询dw信息详细
export function getTable(id) {
  return request({
    url: '/dw_table/table/' + id,
    method: 'get'
  })
}

// 新增dw信息
export function addTable(data) {
  return request({
    url: '/dw_table/table',
    method: 'post',
    data: data
  })
}

// 修改dw信息
export function updateTable(data) {
  return request({
    url: '/dw_table/table',
    method: 'put',
    data: data
  })
}

// 删除dw信息
export function delTable(id) {
  return request({
    url: '/dw_table/table/' + id,
    method: 'delete'
  })
}

// 导出dw信息
export function exportTable(query) {
  return request({
    url: '/dw_table/table/export',
    method: 'get',
    params: query
  })
}