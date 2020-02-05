// 路由拦截 导航守卫
import router from '@/router'
import store from '@/store'

router.beforeEach(function (to, from, next) {
  // 判断是否有token，有token放行， 无拦截
  // startswith: 以...开头（字符串方法）
  if (to.path.startsWith('/user') && !store.state.user.token) {
    let toPath = {
      path: '/login',
      query: {
        redirectUrl: to.fullPath
      }
    }
    next(toPath)
  } else {
    next()
  }
})

export default router
