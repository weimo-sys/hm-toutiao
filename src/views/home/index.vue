<template>
  <div class="container">
    <van-tabs v-model="activeIndex" swipeable>
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 这个div 设置了滚动条 -->
        <!-- 在父组件的子组件标签上写监听 -->
        <article-list :channel_id="channel.id" @showAction="openMoreAction"></article-list>
      </van-tab>
    </van-tabs>
    <!-- 显示编辑频道的按钮 -->
    <span class="bar_btn" @click="showChannelEdit = true">
      <van-icon name="wap-nav" />
    </span>
    <!-- 放置弹层组件 -->
    <van-popup :style="{ width: '80%' }" v-model="showMoreAction">
      <!-- $event是事件里携带的参数 -->
      <!-- dislike事件中的第一个参数$event 是一个占位符 -->
      <!-- report事件中的第一个参数$event是more-action组件传出的type -->
      <more-action @dislike="dislikeOrReport($event, 'dislike')" @report="dislikeOrReport($event, 'report')"></more-action>
    </van-popup>
    <!-- 编辑频道 -->
    <van-action-sheet :round="false" v-model="showChannelEdit" title="编辑频道">
      <!-- 放置编辑频道组件 -->
      <!-- 父传子 -->
      <channel-edit
      @addChannel="addChannel"
      @delChannel="delChannel"
      :activeIndex="activeIndex"
      @selectChannel="selectChannel"
      :channels="channels"></channel-edit>
    </van-action-sheet>
  </div>
</template>

<script>
import MoreAction from './components/more-action'
import ArticleList from './components/article-list'
// 导入封装的请求模块
import { getMyChannels, delChannel, addChannel } from '@/api/channels'
// 导入封装的不喜欢模块
import { disLikeArticle, reportArticle } from '@/api/article'
// 导入封装的eventBus 模块
import eventBus from '@/utils/eventBus'
import ChannelEdit from './components/channel-edit'
export default {
  name: 'home', // devtools查看组件时  可以看到 对应的name名称
  data () {
    return {
      activeIndex: 0, // 默认启动第0个标签
      channels: [], // 声明数组接收获取的频道信息
      showMoreAction: false, // 控制弹出层显示隐藏
      articleId: null, // 用来接收文章的id
      showChannelEdit: false // 设置频道编辑的显示或者隐藏
    }
  },
  // 注册article-list
  components: {
    ArticleList, MoreAction, ChannelEdit
  },
  methods: {
    // 添加频道
    async addChannel (channel) {
      await addChannel(channel) // 完成写入本地缓存的操作 只是写入缓存
      this.channels.push(channel) // 这一步是修改data中的数据
    },
    // 删除频道的方法
    async delChannel (id) {
      try {
        await delChannel(id) // 表示删除数据成功
        // 要移除自身data中channels中的数据
        let index = this.channels.findIndex(item => item.id === id) // 找到删除的索引
        if (index <= this.activeIndex) {
          // 如果删除的频道在当前激活频道之前或者就是当前激活频道
          // 要把我们的激活索引往前挪一位
          this.activeIndex = this.activeIndex - 1
        }
        if (index > -1) {
          //  如果大于-1
          this.channels.splice(index, 1) // 移除当前频道
        }
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '删除频道失败' })
      }
    },
    // 切换到对应的频道 关闭弹窗
    selectChannel (id) {
      let index = this.channels.findIndex(item => item.id === id) // 获取切换频道的索引
      this.activeIndex = index // 将tabs激活标签切换到对应的标签下
      this.showChannelEdit = false // 关闭弹层
    },
    // 组件方法
    async getMyChannels () {
      // 调用api方法，获取频道列表数据
      let data = await getMyChannels()
      this.channels = data.channels // 将获取的频道赋值给声明的变量
    },
    openMoreAction (artId) {
      this.showMoreAction = true
      this.articleId = artId
    },
    async dislike () {
      try {
        if (this.articleId) {
          await disLikeArticle({ target: this.articleId })
        }
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 触发一个事件，发出一个广播，根据广播的文章列表，删除对应的数据
        // 需要文章id 和频道id
        eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        // 关闭弹出框
        this.showMoreAction = false
      } catch (error) {
        this.$gnotify({
          type: 'danger',
          message: '操作失败'
        })
      }
    },
    // 不喜欢或者举报
    // params: 表示第一个参数(举报类型参数)
    // operateType: 表示第二个参数.操作类型
    async dislikeOrReport (params, operatetype) {
      try {
        if (this.articleId) {
          operatetype === 'dislike' ? await disLikeArticle({
            target: this.articleId
          }) : await reportArticle({
            target: this.articleId,
            type: params
          })
          this.$gnotify({ type: 'success', message: '操作成功' })
          eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
          this.showMoreAction = false
        }
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '操作失败' })
      }
    }
  },
  created () {
    // 调用组建方法，在打开页面就获取数据
    this.getMyChannels()
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
// 编辑频道面板的样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
</style>
