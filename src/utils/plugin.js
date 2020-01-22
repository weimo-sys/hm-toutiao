export default {
  // Vue.use(obj) => 会调用obj（这个对象）中的install方法
  install (Vue) {
    // 插件
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep // 封装一个休眠函数
  }
}

function sleep (time = 500) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(), time)
  })
}
