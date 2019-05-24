<template>
  <div>
    <transition name="router-fade" mode="out-in">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </transition>
    <svg-icon></svg-icon>	
  </div>
</template>

<script>
import svgIcon from './components/common/svg'
export default {
  name: 'App',
  components: {
    svgIcon
  }
}
</script>

<style lang="scss">
@import './style/common';
</style>
