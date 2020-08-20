<template>
  <div class="main">
    <div class="title">
      <a class="active" href="/login">登录</a>
      <span>·</span>
      <a href="/register">注册</a>
    </div>

    <div class="sign-up-container">
      <el-form ref="userForm" :model="userInfo">

        <el-form-item class="input-prepend restyle" prop="mobile" :rules="[{ required: true, message: '请输入手机号码', trigger: 'blur' },{validator: checkPhone, trigger: 'blur'}]">
            <el-input type="text" placeholder="手机号" v-model="userInfo.mobile"/>
            <i class="iconfont icon-phone" />
        </el-form-item>

        <el-form-item class="input-prepend" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
            <el-input type="password" placeholder="密码" v-model="userInfo.password"/>
            <i class="iconfont icon-password"/>
        </el-form-item>
        <el-form-item>
            <input type="button" class="sign-in-button" value="登录" @click="submitLogin()">
        </el-form-item>
      </el-form>
      <!-- 更多登录方式 -->
      <div class="more-sign">
        <h6>社交帐号登录</h6>
        <ul>
          <li><a id="weixin" class="weixin" target="_blank" href="localhost:8150/api/userCenter/wx/login"><i class="iconfont icon-weixin"/></a></li>
          <li><a id="qq" class="qq" target="_blank" href="#"><i class="iconfont icon-qq"/></a></li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  import '~/assets/css/sign.css'
  import '~/assets/css/iconfont.css'
  import cookie from 'js-cookie'
  import loginApi from '@/api/login.js'
  export default {
    layout: 'sign',

    data () {
      return {
        userInfo:{
          mobile:'',
          password:''
        },
        loginInfo:{}
      }
    },

    methods: {
      checkPhone (rule, value, callback) {
        //debugger
        if (!(/^1[34578]\d{9}$/.test(value))) {
          return callback(new Error('手机号码格式不正确'))
        }
        return callback()
      },
      submitLogin() {
        const _this = this
        loginApi.login(this.userInfo)
        .then(res => {
             //第二步 获取token字符串放到cookie里面
             //第一个参数cookie名称，第二个参数值，第三个参数作用范围
             cookie.set('guli_token',res.data.data.token,{domain: 'localhost'})
             
              //第四步 调用接口 根据token获取用户信息，为了首页面显示
              loginApi.getLoginUserInfo()
                .then(response => {
                  _this.loginInfo = response.data.data.userInfo
                  //获取返回用户信息，放到cookie里面 '登录成功'
                  cookie.set('guli_ucenter',this.loginInfo,{domain: 'localhost'})
                  this.$message.success('登录成功')
                  //跳转页面
                  window.location.href = "/";
                })
        })
        .catch(err => {
          this.$message.error(err.data.message)
        })
      }
    }
  }
</script>
<style>
   .el-form-item__error{
    z-index: 9999999;
  }
</style>