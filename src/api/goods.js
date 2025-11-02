import request from '@/utils/request'

// 获取物品列表
export function getGoodsList(params) {
  return request({
    url: '/goods/list',
    method: 'get',
    params
  })
}

// 获取物品详情
export function getGoodsDetail(id) {
  return request({
    url: '/goods/detail',
    method: 'get',
    params: { id }
  })
}

// 发布物品
export function publishGoods(data) {
  return request({
    url: '/goods/publish',
    method: 'post',
    data: { goods: data }
  })
}
