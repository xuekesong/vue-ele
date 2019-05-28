<template>
  <div class="login">
    <head-top :head-title="loginWay ? '登录': '密码登录'" goBack="true"></head-top>
    <form class="login-form" v-if="loginWay">
      <section class="login-form__container">
        <input type="text" placeholder="账号密码随便输入" name="phone" maxlength="11" v-model="phoneNumber">
        <button :class="{right_phone_number:rightPhoneNumber}" @click.prevent="getVerifyCode" v-show="!computedTime">获取验证码</button>
        <button v-show="computedTime" @click.prevent>已发送({{computedTime}})</button>
      </section>
      <section class="login-form__container">
        <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
      </section>
    </form>
    <form class="login-form" v-else>
      <section class="login-form__container">
        <input type="text" placeholder="账号" v-model.lazy="userAccount">
      </section>
      <section class="login-form__container">
        <input type="password" v-if="!showPassword" placeholder="密码" v-model="passWord">
        <input type="text" v-else placeholder="密码" v-model="passWord">
        <div class="button-switch" :class="{change_to_text: showPassword}">
          <div class="button-switch__circle" :class="{trans_to_right: showPassword}" @click="changePassWordType"></div>
          <span>K</span>  
          <span>...</span>
        </div>
      </section>
      <section class="login-form__container">
        <input type="text" placeholder="验证码" maxlength="4" v-model="codeNumber">
        <div class="login-form__container--codeImg">
          <img :src="captchaCodeImg" v-show="captchaCodeImg" >
          <div class="login-form__container--codeImg--change" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <p class="login-tips">温馨提示：未注册过的账号，登录时将自动注册</p>
    <p class="login-tips">注册过的用户可凭账号密码登录</p>
    <button class="login-btn" @click="mobileLogin">登录</button>
    <alert-tip :alertText="alertText" @closeTip="closeTip" v-if="showAlert"></alert-tip>
    <router-link to="/forget" class="login-forget" v-if="!loginWay">重置密码？</router-link>
  </div>
</template>

<script>
import HeadTop from '@/components/header/Header'
import { getcaptchas, accountLogin, checkExsis, mobileCode } from '@/service/getData'
import AlertTip from '@/components/common/AlertTip'
import {mapMutations} from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      loginWay: false,//登录方式，默认短信登陆
      userAccount: null,//用户名
      showPassword: false,//是否显示密码
      passWord: null,//密码
      codeNumber: null,//验证码
      captchaCodeImg: null,//验证码地址
      alertText: null,//提示内容
      showAlert: false,//是否显示提示组件
      phoneNumber: null,//电话号码
      computedTime: 0,//倒数计时
      validate_token: null,//获取短信时返回的验证值
      mobileCode: null,//短信验证码
    }
  },
  created() {
    this.getCaptchaCode();
  },
  computed: {
    rightPhoneNumber() {
      return /^1\d{10}$/gi.test(this.phoneNumber);
    }
  },
  components: {
    HeadTop,
    AlertTip
  },
  methods: {
    ...mapMutations([
      'RECORD_USERINFO'
    ]),
    changePassWordType() {//是否显示密码
      this.showPassword = !this.showPassword;
    },
    async getCaptchaCode() {//利用async await来处理异步操作
      let res = await getcaptchas();
      this.captchaCodeImg = res.code;
    },
    async mobileLogin() {//发送登录信息
      if (this.loginWay) {
        
      } else {
        if (!this.userAccount) {
          this.showAlert = true;
          this.alertText = '请输入手机号/邮箱/用户名';
          return;
        }
        if (!this.passWord) {
          this.showAlert = true;
          this.alertText = '请输入密码';
          return;
        }
        if (!this.codeNumber) {
          this.showAlert = true;
          this.alertText = '请输入验证码';
          return;
        }
        //用户名登录
        this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
      }

      //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
      if (!this.userInfo.user_id) {
        this.showAlert = true;
        this.alertText = this.userInfo.message;
        if (!this.loginWay) this.getCaptchaCode();
      } else {
        this.RECORD_USERINFO(this.userInfo);
        this.$router.go(-1);
      }
    },
    closeTip(){
      this.showAlert = false;
    },
    async getVerifyCode() {//获取短信验证码
      if (this.rightPhoneNumber) {
        this.computedTime = 30;
        this.timer = setInterval(() => {
          this.computedTime --;
          if (this.computedTime == 0) {
            clearInterval(this.timer);
          }
        }, 1000)
        //判断用户是否存在
        let exsis = await checkExsis(this.phoneNumber, 'mobile');
        if (exsis.message) {
          this.showAlert = true;
          this.alertText = exsis.message;
          return;
        }
        if (!exsis.is_exists) {
          this.showAlert = true;
          this.alertText = '您输入的手机号上未绑定';
          return;
        }
        //发送短信验证码
        let res = await mobileCode(this.phoneNumber);
        if (res.message) {
          this.showAlert = true;
          this.alertText = res.message;
          return;
        }
        this.validate_token = res.validate_token;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/mixin';
.login{
  padding-top: 1.95rem;
  .login-form{
    background-color: #fff;
    margin-top: .6rem;
    .login-form__container{
      display: flex;
      justify-content: space-between;
      padding: .6rem .8rem;
      border-bottom: 1px solid #f1f1f1;
      .login-form__container--codeImg{
        display: flex;
        align-items: center;
        img{
          @include wh(3.5rem, 1.5rem);
          margin-right: .2rem;
        }
        .login-form__container--codeImg--change{
          display: flex;
          flex-direction: 'column';
          flex-wrap: wrap;
          width: 2rem;
          justify-content: center;
          p{
            @include sc(.55rem, #666);
          }
          p:nth-of-type(2){
            color: #3b95e9;
            margin-top: .2rem;
          }
        }
      }
      input{
        outline: none;
      }
      .right_phone_number{
        background-color: #4cd964;
      }
    }
  }
  .login-tips{
    @include sc(.5rem, red);
    padding: .4rem .6rem;
    line-height: .5rem;
  }
  .login-btn{
    margin: 0 .5rem 1rem;
    @include sc(.7rem, #fff);
    background-color: #4cd964;
    padding: .5rem 0;
    border: 1px;
    outline: none;
    border-radius: .15rem;
    width: 93.6%;
  }
  .login-forget{
    float: right;
    @include sc(.6rem, #3b95e9);
    margin-right: .3rem;
  }
}
.button-switch{
  background-color: #ccc;
  display: flex;
  justify-content: space-around;
  @include wh(2rem, .7rem);
  padding: 0 .2rem;
  border: 1px;
  border-radius: 0.5rem;
  position: relative;
  @include sc(.45rem, #fff);
  transform: translateY(.05rem);
  line-height: .75rem;
  .button-switch__circle{
    transition: all .3s;
    position: absolute;
    top: -0.2rem;
    z-index: 1;
    left: -0.3rem;
    @include wh(1.2rem, 1.2rem);
    box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0,0,0,.1);
    background-color: #f1f1f1;
    border-radius: 50%;
  }
  .trans_to_right{
    transform: translateX(1.3rem);
  }
  &.change_to_text{
    background-color: #4cd964;
  }
}
</style>
