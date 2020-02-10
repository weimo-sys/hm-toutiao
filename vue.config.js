module.exports = {
  // 覆盖蓝色主题
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  },
  configureWebpack: (config) => {
    // config参数就是当前vue-cli项目中的所偶webpack配置
    if (process.env.NODE_ENV === 'production') {
      // 表示webpack 会在生产环境下运行
      // 把所有的console都删除 然后再打包
      // drop_console 删除所有console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: './' // 默认值是/ 改成./
}
