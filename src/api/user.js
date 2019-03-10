import request from '@/utils/request'

export function getUserListByPage(filter) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params: { filter }
  })
}

export function updateUser(data) {
  return request({
    url: '/sys/user/update',
    method: 'post',
    data
  })
}
export function addUser(data) {
  return request({
    url: '/sys/user/add',
    method: 'post',
    data
  })
}
export function deleteUser(data) {
  return request({
    url: '/sys/user/delete',
    method: 'post',
    data
  })
}
