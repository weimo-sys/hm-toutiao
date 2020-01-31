// 专门处理频道的请求
import request from '@/utils/request' // 引入封装号的模块
import store from '@/store'
// 本地缓存需要key
const CACHE_CHANNEL_T = 'hm-toutiao-t' // 游客缓存的key
const CACHE_CHANNEL_U = 'hm-toutiao-u' // 登录用户的key

// 获取我的频道
export function getMyChannels () {
  // 返回一个promise对象
  // 首先我们应该先从缓存中读取数据,看看缓存中有没有数据,如果有,从缓存中读取,如果没有,就去查询
  // return request({
  //   url: '/user/channels'
  // })
  return new Promise(async function (resolve, reject) {
    // 如果有token 就用登录用户的key,没有登录就用游客的key
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T // 用于缓存的key
    // 从缓存中读取数据
    let str = localStorage.getItem(key) // 得到缓存结果
    if (str) {
      // 如果str 存在,表示缓存中有数据,  得到一个字符串
      resolve({ channels: JSON.parse(str) })
    } else {
      // 如果str 不存在,表示缓存中无数据
      const data = await request({ url: '/user/channels' }) // 从线上拉去数据
      localStorage.setItem(key, JSON.stringify(data.channels)) // 将线上数据写入缓存
      resolve({ data }) // 将线上获取到的数据释放给下个promise
    }
  })
}

// 获取所有频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}

// 删除频道
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 判断删除游客的频道还是登录的频道
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T // 用于缓存的key
    let channels = JSON.parse(localStorage.getItem(key)) // 得到缓存结果
    let index = channels.findIndex(item => item.id === id) // 找到对应频道的索引
    if (index > -1) {
      channels.splice(index, 1) // 直接删除原数组中的数据
      // channels = channels.filter(item => item.id !== id) // 新数组模式删除频道
      // 应该重新写入缓存
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
      resolve()
    } else {
      reject(new Error('找不到对应的频道'))
    }
  })
}
