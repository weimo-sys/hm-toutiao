import Vue from 'vue'
import App from './App.vue'
import router from './permission'
import store from './store'
import Vant, { Lazyload } from 'vant' // 引入vant组件， 引入lazyload对象（懒加载）
import plugin from '@/utils/plugin'
import 'vant/lib/index.less' // vant 样式文件换成less
import '@/styles/index.less' // 引入全局的自定义样式，因为要覆盖vant 的样式
import 'amfe-flexible' // 引入自定义适配插件
// 注册完成，在任意位置就可以使用vant 组件库的组件
Vue.use(Vant)
// 注册小插件，会调用插件中的install方法
Vue.use(plugin)
// 完成懒加载对象的注册
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
