export default {
  // Vue.use(obj) => 会调用obj（这个对象）中的install方法
  install (Vue) {
    // 插件
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
  }
}
