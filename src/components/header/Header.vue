<template>
  <header class="header-top">
    <slot name="logo"></slot>
    <section class="header-top__goback" v-if="goBack" @click="$router.go(-1)">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
      </svg>
    </section>
    <router-link :to="userInfo ? '/profile': '/login'" class="header-top__login" v-if="signinUp">
      <svg class="header-top__login--avatar" v-if="userInfo">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
      </svg>
      <span class="header-top__login--login" v-else>登录|注册</span>
    </router-link>
    <section class="header-top__title ellipsis" v-if="headTitle">{{headTitle}}</section>
    
    <slot name="changecity"></slot>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'HeadTop',
  props: ['headTitle', 'goBack', 'signinUp'],
  mounted() {
    //获取用户信息
    this.getUserInfo();
  },
  computed: {
    ...mapState([//获取用户信息
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([//在组件中分发 Action
      'getUserInfo'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/mixin';

.header-top{
  background-color: $blue;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  @include wh(100%, 1.95rem);

  .header-top__login{
    right: .55rem;
    @include sc(.65rem, #fff);
    @include ct;
    .header-top__login--login{
      color: #fff;
    }
    .header-top__login--avatar{
      fill: #fff;//svg 填充色
      @include wh(.8rem, .8rem);
    }
  }
  .header-top__title{
    @include center;
    width: 50%;
    color: #fff;
    text-align: center;
    @include sc(0.8rem, #fff);
    text-align: center;
    font-weight: bold;
  }
  .header-top__goback{
    left: 0.4rem;
    @include wh(0.6rem, 1rem);
    line-height: 2.5rem;
    margin-left: .4rem;
  }
}
</style>
