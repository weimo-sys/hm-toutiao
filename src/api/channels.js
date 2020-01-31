// 专门处理频道的请求
import request from '@/utils/request' // 引入封装号的模块

// 获取我的频道
export function getMyChannels () {
  // 返回一个promise对象
  return request({
    url: '/user/channels'
    // methods: 'get'   axios 默认get类型
  })
}

// 获取所有频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
