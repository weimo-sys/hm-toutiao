<template>
  <div class="scroll-wrapper">
      <van-list v-model="upLoading" :finished="finished" finished-text="人家也是有底线的" @load="onLoad"></van-list>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false,
      finished: false
    }
  },
  methods: {
    onLoad () {
      console.log('开始加载数据')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
