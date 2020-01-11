<template>
  <div class="container">
    <van-nav-bar
    title="文章详情"
    left-text="返回"
    @click-left="$router.back()"
    ></van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'articles'
}
</script>

<style lang="less" scoped>
</style>
