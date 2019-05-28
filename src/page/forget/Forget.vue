<template>
  <div class="rest">
    <head-top head-title="重置密码" goBack="true"></head-top>
    <form class="rest-form">
      <section class="rest-form__container">
        <input type="text" placeholder="账号" v-model="phoneNumber" @input="inputPhone">
      </section>
      <section class="rest-form__container">
        <input type="text" placeholder="旧密码" v-model="oldPassword">
      </section>
      <section class="rest-form__container">
        <input type="text" placeholder="请输入新密码" v-model="newPassword">
      </section>
      <section class="rest-form__container">
        <input type="text" placeholder="请确认密码" v-model="confirmPassword">
      </section>
      <section class="rest-form__container">
        <input type="text" placeholder="验证码" v-model="mobileCode" maxlength="6">
        <div class="rest-form__container--codeImg">
          <img :src="captchaCodeImg" v-show="captchaCodeImg" >
          <div class="rest-form__container--codeImg--change" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <button class="rest-btn" @click="resetBtn">确认修改</button>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
import HeadTop from '@/components/header/Header'
import {getcaptchas, changePassword} from '@/service/getData'
import AlertTip from '@/components/common/AlertTip'
export default {
  data() {
    return {
      phoneNumber: null,//电话号码
      rightPhoneNumber: null,//输入的手机号是否符合要求
      oldPassword: null,//旧密码
      newPassword: null,//新密码
      confirmPassword: null,//确认密码
      mobileCode: null,//验证码
      captchaCodeImg: null,//
      showAlert: false, //显示提示组件
      alertText: null, //提示的内容
    }
  },
  created(){
    this.getCaptchaCode()
  },
  methods: {
    inputPhone() {//判断输入的电话号码
      if(/.+/gi.test(this.phoneNumber)){
        this.rightPhoneNumber = true;
      }else{
        this.rightPhoneNumber = false;
      }
    },
    async getCaptchaCode() {
      let res = await getcaptchas();
      this.captchaCodeImg = res.code;
    },
    async resetBtn() {//重置密码
      if (!this.phoneNumber) {
        this.showAlert = true;
        this.alertText = '请输入正确的账号';
        return;
      }
      if(!this.oldPassWord){
        this.showAlert = true;
        this.alertText = '请输入旧密码';
        return
      }
      if(!this.newPassWord){
        this.showAlert = true;
        this.alertText = '请输入新密码';
        return
      }
      if(!this.confirmPassWord){
        this.showAlert = true;
        this.alertText = '请输确认密码';
        return
      }
      if(this.newPassWord !== this.confirmPassWord){
        this.showAlert = true;
        this.alertText = '两次输入的密码不一致';
        return
      }
      if(!this.mobileCode){
        this.showAlert = true;
        this.alertText = '请输验证码';
        return
      }
      //发送重置信息
      let res = await changePassword(this.phoneNumber, this.oldPassWord, this.newPassWord, this.confirmPassWord, this.mobileCode);
      if (res.message) {
        this.showAlert = true;
        this.alertText = res.message;
        this.getCaptchaCode();
        return
      }
      this.showAlert = true;
      this.alertText = '密码修改成功';
    },
    closeTip() {
      this.showAlert = false;
    }
  },
  components: {
    HeadTop,
    AlertTip
  }
}
</script>

<style lang="scss" scoped>
@import 'src/style/mixin';
.rest{
  padding-top: 1.95rem;
  .rest-form{
    background-color: #fff;
    margin-top: .6rem;
    .rest-form__container{
      display: flex;
      justify-content: space-between;
      padding: .6rem .8rem;
      border-bottom: 1px solid #f1f1f1;
      input{
        @include sc(.7rem, #666);
        outline: none;
        border: none;
      }
      button{
        @include sc(.65rem, #fff);
        font-family: Helvetica Neue,Tahoma,Arial;
        padding: .28rem .4rem;
        border: 1px;
        border-radius: 0.15rem;
      }
      .rest-form__container--codeImg{
        display: flex;
        align-items: center;
        img{
          @include wh(3.5rem, 1.5rem);
          margin-right: .2rem;
        }
        .rest-form__container--codeImg--change{
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
      .right_phone_number{
        background-color: #4cd964;
      }
    }
  }
  .rest-btn{
    margin: 1rem .5rem;
    width: 93%;
    @include sc(.7rem, #fff);
    background-color: #4cd964;
    border: 1px;
    padding: .5rem 0;
    border-radius: 0.15rem;
    outline: none;
  }
}
</style>
