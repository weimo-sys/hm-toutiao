<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索框 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想搜索 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell @click="toSearchResult(item)" icon="search" v-for="item in suggestList" :key="item">
        {{ item }}
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <!-- 只有当有历史记录的时候 才显示历史记录的盒子 -->
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <!-- 清空所有历史 -->
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <!-- 循环生成历史记录 item是唯一的 搜索历史记录不能重复 -->
        <van-cell @click="toResult(item)" v-for="(item, index) in historyList" :key="item">
          <!-- item是搜索关键字 -->
          <a class="word_btn">{{ item }}</a>
          <!-- 给删除按钮注册删除事件 -->
          <van-icon
            @click.stop="delHistory(index)"
            class="close_btn"
            slot="right-icon"
            name="cross"
          />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 用来当作存储本地历史记录的key
import { suggestion } from '@/api/article'
const key = 'hm-toutiao-history'
export default {
  name: 'search',
  data () {
    return {
      q: '', // 查询缓存
      historyList: [], // 存放查询历史记录的数据
      suggestList: [] // 存放联想建议的数据
    }
  },
  watch: {
    // // 防抖搜索
    // q () {
    //   clearTimeout(this.timer)
    //   this.timer = setTimeout(async () => {
    //     if (!this.q) {
    //       this.suggestList = [] // 当搜索关键字为空的时候 清空联想数组
    //       return false
    //     }
    //     // 搜索联想词汇
    //     let data = await suggestion({ q: this.q }) // 搜索联想建议
    //     this.suggestList = data.options
    //   }, 500)
    // }
    // 函数节流
    q () {
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          this.timer = null // 将定时器标记清空
          if (!this.q) {
            this.suggestList = [] // 当搜索关键字为空的时候 清空联想数组
            return false // 直接返回，下面不必执行
          }
          // 搜索联想词汇
          let data = await suggestion({ q: this.q }) // 搜索联想建议
          this.suggestList = data.options
        }, 500)
      }
    }
  },
  created () {
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]') // 读取本地内容
  },
  methods: {
    // 删除对应的历史记录
    delHistory (index) {
      this.historyList.splice(index, 1) // 删除
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入缓存
    },
    // 跳转到搜索结果页面
    toResult (text) {
      this.$router.push({ path: 'search/result', query: { q: text } }) // 直接跳转到搜索结果页面
    },
    // 清空所有历史
    clear () {
      this.historyList = []
      localStorage.setItem(key, '[]') // 写入缓存
    },
    // 搜索,当回车/虚拟键盘时触发
    onSearch () {
      // 跳转到搜索结果之前，应该把搜索关键字写入历史记录
      if (!this.q) return // 如果q为空没有必要往下写
      // 如果不为空 要将this.q加入到历史记录中
      // 判断重复
      let obj = new Set(this.historyList) // 生成一个set变量
      obj.add(this.q) // 将搜索关键字 添加到数组
      this.historyList = Array.from(obj) // 将obj转换为数组
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入缓存
      // 跳转到搜索结果页面
      this.$router.push({ path: 'search/result', query: { q: this.q } }) // 直接跳转到搜索结果页面
    },
    // 点击联想搜索关键词 去跳转 => 先把点击的关键词放入历史记录 表示我搜索过
    toSearchResult (text) {
      // 放入历史记录
      let obj = new Set(this.historyList) // 生成一个set变量  set对象自动去重
      obj.add(text)
      this.historyList = Array.from(obj) // 将set转回数组
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入缓存
      this.$router.push({ path: '/search/result', query: { q: text } }) // 直接跳转到搜索结果界面
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>
