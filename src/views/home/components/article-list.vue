<template>
<!-- 阅读记忆 @scroll="remember" -->
  <div ref="myScroll" class="scroll-wrapper" @scroll="remember">
    <van-pull-refresh v-model="downLoading" :success-text="refreshSuccessText" @refresh="onRefresh">
      <van-list
        v-model="upLoading"
        :finished="finished"
        finished-text="人家也是有底线的......"
        @load="onLoad"
      >
      <!-- 点击van-cell跳转到文章详情 -->
      <!-- query传值(?id=123) params传值(/123) -->
        <van-cell :to="`/article?articleId=${article.art_id.toString()}`" v-for="article in articles" :key="article.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis"> {{ article.title }} </h3>
            <!-- 三张图片 -->
            <div class="img_box" v-if="article.cover.type === 3">
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[0]" />
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[1]" />
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[2]" />
            </div>
            <!-- 一张图片 -->
            <div class="img_box" v-if="article.cover.type === 1">
              <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{ article.aut_name }}</span>
              <span>{{ article.comm_count }}评论</span>
              <!-- 使用过滤器 表达式 | 过滤器名称 -->
              <span>{{ article.pubdate | relTime }}</span>
              <!-- 点击叉号 告诉父组件 我要反馈 stop修饰符，阻止事件冒泡 -->
              <span class="close" v-if="user.token" @click.stop="$emit('showAction', article.art_id.toString())">
                <van-icon name="cross" ></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 引入文章数据获取模块
import { getArticles } from '@/api/article'
// 引入
import { mapState } from 'vuex'
// 导入eventBus
import eventBus from '@/utils/eventBus'
export default {
  name: 'article-list',
  data () {
    return {
      downLoading: false, // 是否开启下拉刷新状态
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否全部加载完成
      articles: [], // 定义一个数组来接收上拉加载的数据
      refreshSuccessText: '', // 下拉成功显示的文本
      timestamp: null, // 定义一个时间戳，这个时间戳用来告诉服务器，现在要求什么样的事件数据
      scrollTop: 0 // 记录当前文章列表实例所滚动的位置
    }
  },
  props: {
    channel_id: {
      required: true, // 要求props必传
      type: Number, // 指定要传的props类型（String Number Boolean Function...）
      default: null // 给props一个默认值
    }
  },
  // 映射vuex中的store对象到计算属性
  computed: {
    ...mapState(['user'])
  },
  created () {
    // 开启监听
    // 监听删除文章事件
    eventBus.$on('delArticle', (articleId, channelId) => {
      if (this.channel_id === channelId) {
        // 这个条件表示 该列表就是当前激活的列表
        let index = this.articles.findIndex(item => item.art_id.toString() === articleId) // 查找对应的文章
        // 如果index大于 -1 表示找到了 就要删除
        if (index > -1) {
          this.articles.splice(index, 1) // 删除不喜欢的文章
        }
      }
    })
    // 开启新的监听
    eventBus.$on('changeTab', id => {
      // 判断id 是否等于 该组件通过props得到的频道id
      if (id === this.channel_id) {
        // 如果相等 说明找对了article-list实例
        this.$nextTick(() => {
          if (this.scrollTop && this.$refs.myScroll) {
          // 表示该文章列表存在滚动
            this.$refs.myScroll.scrollTop = this.scrollTop
          }
        })
      }
    })
  },
  methods: {
    // 定义一个记录位置的方法
    // 当绑定事件只写方法名时 第一个参数就是event
    remember (event) {
      // 记录此次滚动事件中，滚动条距离顶部的高度
      // event.target 当前触发事件的元素
      this.scrollTop = event.target.scrollTop // 记录位置
    },
    // 上拉加载
    async onLoad () {
      await this.$sleep() // 等待 sleep resolve
      // // console.log('开始加载数据')
      // setTimeout(() => {
      //   // 给数据设置一个上线，不超过50条
      //   if (this.articles.length < 50) {
      //     let arr = Array.from(
      //       Array(10),
      //       (value, index) => this.articles.length + index + 1
      //     )
      //     // ...是将arr解构成一个个元素
      //     this.articles.push(...arr)
      //     // 关闭状态
      //     this.upLoading = false
      //   } else {
      //     this.finished = true
      //   }
      // }, 1000)

      // 请求数据
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      // 将数据添加到数组尾部
      this.articles.push(...data.results)
      // 关闭加载状态
      this.upLoading = false
      // 判断历史时间戳，如果有，表示可以继续往下看，否则就不看
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        // 如果没有历史，加载完成
        this.finished = true
      }
    },

    // 下拉刷新
    async onRefresh () {
      await this.$sleep() // 等待 sleep resolve
      // setTimeout(() => {
      //   // array.from 将伪数组转为真正的数组
      //   let arr = Array.from(Array(10), (value, index) => '追加' + (index + 1))
      //   // 将数据添加到首部
      //   this.articles.unshift(...arr)
      //   // 关闭状态
      //   this.downLoading = false
      //   this.refreshSuccessText = `更新了${arr.length}条数据`
      // }, 1000)
      // 下拉获取新数据
      let data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      // 关掉下拉状态
      this.downLoading = false
      // 如果没有最新推荐数据
      if (data.results.length) {
        // 如果长度>0 表示有数据
        this.articles = data.results // 将历史数据全部覆盖掉
        // 如果之前已经将上拉加载设置成finished设置成true
        // 表示我们还需要继续往下拉 就需要把原来的状态打开
        this.finished = false
        // 上拉时还需要获取历史时间戳
        this.timestamp = data.pre_timestamp // 赋值历史时间戳，因为当你下拉加载的时候，要用到这个历史时间戳
        // 刷新完提示
        this.refreshSuccessText = `更新了${data.results.length}条数据`
      } else {
        // 如果长度<0 表示没有新数据
        this.refreshSuccessText = '已是最新数据'
      }
    }
  },
  // 激活函数
  activated () {
    // console.log('我被唤醒了')
    // 唤醒的时候，需要把记录的位置 恢复回去
    if (this.$refs.myScroll && this.scrollTop) {
      // 当dom元素存在 且 滚动距离不为0 才去滚动
      this.$refs.myScroll.scrollTop = this.scrollTop // 将原来记录的位置复制给dom元素
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
