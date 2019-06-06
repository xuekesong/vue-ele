<template>
  <div class="search">
    <head-top head-title="搜索" goBack="true"></head-top>
    <form class="search-form">
      <input class="search-form__ipt" type="search" name="search" placeholder="请输入商家或美食名称" v-model="searchValue" @input="checkInput">
      <input type="submit" value="提交" class="search-form__btn" @click.prevent="searchTarget">
    </form>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
import HeadTop from '@/components/header/Header'
import footGuide from '@/components/footer/FootGuide'
import {searchRestaurant} from '@/service/getData'
import {getStore, setStore} from '@/config/mUtils'

export default {
  data() {
    return{
      searchValue: '',
      showHistory: true,//是否显示历史记录，只有在返回搜索结果后隐藏
      restaurantList: [],//搜索返回的结果
      emptyResult: false,//搜索结果为空时显示
      geohash: '',//msite 页面传递过来的地址信息
      emptyResult: false,//搜索结果为空时显示
      searchHistory: [],//搜索历史记录
    }
  },
  components: {
    HeadTop,
    footGuide
  },
  mounted() {
    this.geohash = this.$route.params.geohash;
    //获取搜索历史记录
    if (getStore('searchHistory')) {
      this.searchHistory = JSON.parse(getStore('searchHistory'));
    }
  },
  methods: {
    async searchTarget() {//点击提交按钮，搜索结果并显示，同时将搜索内容存入历史
      if (!this.searchValue) return;
      //隐藏历史记录
      this.showHistory = false;
      //获取搜索结果
      this.restaurantList = await searchRestaurant(this.geohash, this.searchValue);
      this.emptyResult = !this.restaurantList.length;
      /**
       * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
       * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
       */
      let history = getStore('searchHistory');
      if (history) {
        let checkrepeat = false;
        this.searchHistory = JOSN.parse(history),
        this.searchHistory.forEach(item => {
          if (item == this.searchValue) {
            checkrepeat = true;
          }
        })
        if (!checkrepeat) {
          this.searchHistory.push(this.searchValue);
        }
      } else {
        this.searchHistory.push(this.searchValue);
      }
      setStore('searchHistory', this.searchHistory);
    },
    checkInput() {
      if (this.searchValue.length == 0) {
        this.showHistory = true;//显示历史记录
        this.restaurantList = [];//清空搜索结果
        this.emptyResult = false;//隐藏搜索为空提示
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search{
  padding: 1.95rem 0;
  .search-form{
    padding: .5rem;
    display: flex;
    background-color: #fff;
    .search-form__ipt{
      flex: 4;
      border: .025rem solid #e4e4e4;
      font-size: .65rem;
      color: #333;
      border-radius: .125rem;
      background-color: #f2f2f2;
      font-weight: bold;
      padding: 0 .25rem;
      height: 1.5rem;
      outline: none;
    }
    .search-form__btn{
      flex: 1;
      border: 0.025rem solid #3190e8;
      margin-left: .2rem;
      font-size: 0.65rem;
      color: #fff;
      border-radius: 0.125rem;
      background-color: #3190e8;
      font-weight: bold;
      padding: 0 0.25rem;
      outline: none;
    }
  }
}
</style>
