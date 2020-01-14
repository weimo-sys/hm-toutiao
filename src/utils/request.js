// 封装 axios
import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store'
import router from '@/router'

// 创建一个axios实例
const instance = axios.create({
  // 设置baseUrl 和处理最大数字
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  transformResponse: [function (data) {
    // 或者 return data ? JSONBig.parse(data) : {}
    try {
      // 先尝试转换，如果转换不成功，返回data
      return JSONBig.parse(data)
    } catch (error) {
      return data
    }
  }]
})

// 请求拦截器（在发送请求之前做一些事情）
instance.interceptors.request.use(function (config) {
// config就是请求的参数
  if (store.state.user.token) {
    //   统一注入token
    config.headers['Authorization'] = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  // 返回失败
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use((response) => {
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, async (error) => {
  // 处理token失效
  // 错误的时候 token容易失效 处理token失效问题
  if (error.response && error.response.status === 401) {
    let toPath = {
      path: '/login', query: { redirectUrl: router.currentRoute.path }
    }
    // token 失效，判断是否有refresh_token
    if (store.state.user.refresh_token) {
      try {
        // 如果有refresh_token， 发送请求换取新token
        let result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          }
        })
        // 将获取的数据提交到载荷
        store.commit('updateUser', {
          user: {
            token: result.data.data.token,
            refresh_token: store.state.user.refresh_token
          }
        })
        // 把刚才错误的请求再次发送出去，然后将promise返回
        return instance(error.config)
      } catch (error) {
        // 如果错误，表示不久措施也无效了 应该跳转到登录页面，并且把废掉的user全部移除
        // 所有用户信息清空
        store.commit('clearUser')
        // 跳转到登录页面
        router.push(toPath)
      }
    } else {
      // 没有refresh_tokan
      router.push(toPath)
    }
  }
  return Promise.reject(error)
})
export default instance
