<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" :success-text="refreshSuccessText" @refresh="onRefresh">
      <van-list
        v-model="upLoading"
        :finished="finished"
        finished-text="人家也是有底线的......"
        @load="onLoad"
      >
        <van-cell v-for="article in articles" :key="article">
          <div class="article_item">
            <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
            <!-- 三张图片 -->
            <div class="img_box">
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <!-- 一张图片 -->
            <div class="img_box">
              <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <div class="info_box">
              <span>你像一阵风</span>
              <span>8评论</span>
              <span>10分钟前</span>
              <span class="close">
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      downLoading: false, // 是否开启下拉刷新状态
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否全部加载完成
      articles: [], // 定义一个数组来接收上拉加载的数据
      refreshSuccessText: ''
    }
  },
  methods: {
    // 上拉加载
    onLoad () {
      // console.log('开始加载数据')
      setTimeout(() => {
        // 给数据设置一个上线，不超过50条
        if (this.articles.length < 50) {
          let arr = Array.from(
            Array(10),
            (value, index) => this.articles.length + index + 1
          )
          // ...是将arr解构成一个个元素
          this.articles.push(...arr)
          // 关闭状态
          this.upLoading = false
        } else {
          this.finished = true
        }
      }, 1000)
    },

    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        // array.from 将伪数组转为真正的数组
        let arr = Array.from(Array(10), (value, index) => '追加' + (index + 1))
        // 将数据添加到首部
        this.articles.unshift(...arr)
        // 关闭状态
        this.downLoading = false
        this.refreshSuccessText = `更新了${arr.length}条数据`
      }, 1000)
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
