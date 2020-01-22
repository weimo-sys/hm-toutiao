// 时间格式处理
// 引入dayjs
import dayjs from 'dayjs'
// 引入中文语言包
import 'dayjs/locale/zh-cn'
// dayjs的使用需要扩展一个自身的功能
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
  // Vue.use(obj) => 会调用obj（这个对象）中的install方法
  install (Vue) {
    // 插件
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep // 封装一个休眠函数
    // 注册全局相对时间的过滤器过滤器
    Vue.filter('relTime', relTime)
  }
}

// function(time = 500) 如果传time 用传的，如果不传 用500
function sleep (time = 500) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(), time)
  })
}

// 相对时间的过滤器
function relTime (value) {
  return dayjs().locale('zh-cn').from(value)
}
