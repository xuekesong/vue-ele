<template>
  <header class="header-top">
    <slot name="logo"></slot>
    <router-link :to="userInfo ? '/profile': '/login'" class="header-top__login">
      <svg class="header-top__login--avatar" v-if="userInfo">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
      </svg>
      <span class="header-top__login--login" v-else>登录|注册</span>
    </router-link>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'HeadTop',
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
}
</style>
