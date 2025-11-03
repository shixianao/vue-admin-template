import request from '@/utils/request'

export function getClassList(params) {
  return request({
    url: '/vue-admin-template/class/list',
    method: 'get',
    params
  })
}

export function createClass(data) {
  return request({
    url: '/vue-admin-template/class/create',
    method: 'post',
    data
  })
}

export function updateClass(data) {
  return request({
    url: '/vue-admin-template/class/update',
    method: 'post',
    data
  })
}

export function deleteClass(id) {
  return request({
    url: `/vue-admin-template/class/delete/${id}`,
    method: 'post'
  })
}