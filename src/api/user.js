import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/vue-admin-template/user/list',
    method: 'get',
    params
  })
}

export function createUser(data) {
  return request({
    url: '/vue-admin-template/user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/vue-admin-template/user/update',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/vue-admin-template/user/delete/${id}`,
    method: 'post'
  })
}

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
