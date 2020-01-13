// 路由拦截 导航守卫
import router from '@/router'
import store from '@/store'

router.beforeEach(function (to, from, next) {
  // 判断是否有token，有token放行， 无拦截
  // startawith: 以...开头（字符串方法）
  if (to.path.startawith('/user') && !store.state.user.token) {
    let toPath = {
      path: '/login',
      query: {
        redirectUrl: to.path
      }
    }
    next(toPath)
  } else {
    next()
  }
})

export default router
