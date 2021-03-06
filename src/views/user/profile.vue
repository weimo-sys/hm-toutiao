<template>
   <div class="container">
     <!-- 导航 -->
    <van-nav-bar @click-right="saveUserInfo" left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <!-- 点击图片选择图片的弹层 -->
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
          :src="user.photo"
        />
      </van-cell>
      <van-cell @click="showName=true" is-link title="名称" :value="user.name" />
      <van-cell @click="showGender= true" is-link title="性别" :value="user.gender === 0 ? '男': '女'"/>
      <van-cell @click="showDate" is-link title="生日" :value="user.birthday" />
    </van-cell-group>

    <!-- 弹层组件 头像 -->
    <van-popup v-model="showPhoto" style="width: 80%">
      <!-- 内容 -->
      <!-- 一：本地相册选择图片 -->
      <!-- 二：拍照 -->
      <van-cell @click="openChangeFile" is-link title="本地相册选择图片"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>

    <!-- 弹层组件 昵称 -->
    <!-- :close-on-click-overlay="false" 控制关闭弹层功能（禁用点击背景关闭弹窗） -->
    <!-- round 和 :round="true" 效果相同 -->
    <van-popup round :close-on-click-overlay="false" v-model="showName" style="width: 80%">
      <!-- 编辑用户昵称 双向绑定用户昵称-->
      <van-field :error-message="nameMsg" v-model.trim="user.name" type="textarea" rows="4"></van-field>
      <!-- 关闭按钮 -->
      <van-button type="info" size="large" block @click="btnName">确定</van-button>
    </van-popup>

    <!-- 上拉菜单 性别选择 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>

    <!-- 弹层组件 生日选择 -->
    <!-- 点击取消弹层关闭 @cancel="showBirthday=false" -->
    <van-popup v-model="showBirthday" position="bottom">
      <!-- 选择出生日期 应该小于现在时间 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthday=false"
        @confirm="confirmDate"
      />
    </van-popup>
    <!-- 设置文件上传控件 但是不能让人看到 -->
    <!-- input:file 中当选择文件就会触发  @change="upLoad"-->
    <input ref="myFile" @change="upLoad" type="file" style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs' // 引入dayjs插件
import { getUserProfile, updateImg, saveUserInfo } from '@/api/user' // 引入获取资料的方法
import { mapMutations } from 'vuex'
export default {
  name: 'profile',
  data () {
    return {
      currentDate: new Date(), // 当前时间
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远小于当前时间
      showPhoto: false, // 是否显示选择头像弹层
      showName: false, // 是否显示编辑昵称
      showGender: false, // 是否显示性别弹层
      showBirthday: false, // 是否显示日期弹层
      // 用户信息
      user: {
        name: '',
        gender: 0, // 0 男 1 女
        birthday: ''
      },
      // 性别数据
      actions: [{ name: '男' }, { name: '女' }],
      nameMsg: '' // 专门来控制显示的错误信息
    }
  },
  methods: {
    ...mapMutations(['updatePhoto']), // 在编辑资料页面引入 公共的mutations方法
    // 绑定按钮事件  昵称
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        // 如果长度小于1 或者大于7 不符合
        this.nameMsg = '您的用户昵称不符合1-7的长度要求'
        return false
      }
      // 如果满足继续执行
      this.nameMsg = '' // 先清空提示消息
      this.showName = false // 关闭弹层
    },
    // 性别
    selectItem (item) {
      // console.log(item) // item就是选择的对象
      this.user.gender = item.name === '男' ? 0 : 1 // 根据判断得到当前性别
      this.showGender = false // 关闭当前的弹层
    },
    // 点击生日时触发
    showDate () {
      // 要将字符串 2019-08-08 转换为时期类型
      this.currentDate = new Date(this.user.birthday) // 将当前用户的生日 赋值给绑定当前时间的数据
      this.showBirthday = true // 显示生日弹层
    },
    // 点击生日弹层时 触发的方法
    confirmDate (data) {
      this.user.birthday = dayjs(data).format('YYYY-MM-DD') // 将转化后的结果赋值给 user中的生日
      this.showBirthday = false // 关闭弹层
    },
    // 获取用户资料的方法
    async getUserProfile () {
      let data = await getUserProfile()
      // 将头像地址 更新设置给公共的state
      this.updatePhoto({ photo: data.photo }) // 载荷参数
      // console.log(data)
      this.user = data // 将得到的数据赋值给user
    },
    // 点击事件 选择图片时触发
    openChangeFile () {
      // 上传本地文件
      // 触发文件上传的点击事件
      this.$refs.myFile.click() // 触发文件上传组件点击方法
    },
    // 当我们选择图片就会触发
    async upLoad () {
      // console.log('触发了')
      // 应该上传头像
      // console.log(this.$refs.myFile.files[0])
      // 首先 应该把这个图片上传到服务器上
      // 调用编辑头像的方法
      let data = new FormData()
      data.append('photo', this.$refs.myFile.files[0]) // 网formdata 添加参数
      let result = await updateImg(data)
      // console.log(result)
      // 应该把地址 同步设置给 当前页面的数据
      this.user.photo = result.photo // 将上传成功的头像设置给当前头像
      this.showPhoto = false // 关闭弹层
      // 当头像上传成功之后 更新公共状态
      this.updatePhoto({
        photo: result.photo
      })
    },
    // 保存方法 调用保存接口 这里是不需要传photo数据的
    // 1 我们通过别的方法更新了头像
    // 2 photo base64字符串
    async saveUserInfo () {
      try {
        await saveUserInfo({ ...this.user, photo: null })
        this.$gnotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '保存失败' })
      }
    }
  },
  created () {
    // 调用获取用户资料的方法
    this.getUserProfile()
  }
}
</script>

<style lang="less" scoped>
</style>
