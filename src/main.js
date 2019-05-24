// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'//routes不可取名字为routers，关键字会影响页面的展示
import store from './store/index.js'
import FastClick from 'fastclick'
import './config/rem'

Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);//解决移动端点击事件300ms延迟
  }, false)
}

Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {//滚动行为,只支持在 history.pushState 的浏览器中可用，return 期望滚动到哪个的位置 scrollBehavior 方法接收 to 和 from 路由对象，第三个参数 savedPosition 当且仅当 popstate 导航（通过浏览器的 前进/后退 按钮触发）时才可用
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
})

new Vue({
  router,
  store
}).$mount('#app')