<template>
  <div class="city">
    <head-top :head-title="cityname" go-back="true">
      <router-link to="/home" slot="changecity" class="change_city">切换城市</router-link>
    </head-top>
    <!-- v-on:submit.prevent 只有修饰符 -->
    <form class="city-form" v-on:submit.prevent>
      <input type="search" name="city" class="city-form__search" placeholder="输入学校、商务楼、地址" required v-model="inputValue">
      <input type="submit" name="submit" value="提交" class="city-form__btn" @click="subFun">
    </form>
    <p v-if="historytitle" class="city-search">搜索历史</p>
    <ul class="city-getpois">
      <li class="city-getpois__li" v-for="item,index in placelist" :key="index" @click="nextpage(index, item.geohash)">
        <h4 class="city-getpois__li--name ellipsis">{{item.name}}</h4>
        <p class="city-getpois__li--address ellipsis">{{item.address}}</p>
      </li>
    </ul>
    <footer class="city-clear" v-if="historytitle && placelist.length" @click="clearAll">清空所有</footer>
    <div class="city-result" v-if="placeNone">很抱歉！无搜索结果</div>
  </div>
</template>

<script>
import HeadTop from '@/components/header/Header'
import {currentcity, searchplace} from '@/service/getData'
import {getStore, removeStore, setStore} from '@/config/mUtils'

export default {
  data() {
    return {
      cityid: '',//当前城市id
      cityname: '',//当前城市名字
      inputValue: '',//搜索地址
      historytitle: true,//默认显示搜索历史头部，点击搜索后隐藏
      placelist: [],//搜索城市列表
      placeNone: false, // 搜索无结果，显示提示信息
      placeHistory:[], // 历史搜索记录
    }
  },
  components: {
    HeadTop
  },
  mounted() {
    this.cityid = this.$route.params.cityid;
    currentcity(this.cityid).then(res => {
      this.cityname = res.name;
    })
    this.initData();
  },
  methods: {
    initData() {
      //获取搜索历史记录
      if (getStore('placeHistory')) {
        this.placelist = JSON.parse(getStore('placeHistory'));
      } else {
        this.placelist = [];
      }
    },
    subFun() {//开始搜索
      if (this.inputValue) {//输入值不为空时才发送消息
        searchplace(this.cityid, this.inputValue).then(res => {
          this.placelist = res;
          this.historytitle = false;
          this.placeNone = res.length ? false: true;
        })
      }
    },
    clearAll() {
      removeStore('placeHistory');
      this.initData();
    },
    //点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
    //如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
    nextpage(index, geohash) {
      let history = getStore('placeHistory');
      let choosePlace = this.placelist[index];
      if (history) {
        let checkrepeat = false;
        this.placeHistory = JSON.parse(history);
        this.placeHistory.forEach(item => {
          if (item.geohash == geohash) {
            checkrepeat = true;
          }
        })
        if (!checkrepeat) {
          this.placeHistory.push(choosePlace);
        }
      } else {
        this.placeHistory.push(choosePlace);
      }
      setStore('placeHistory', this.placeHistory);
      this.$router.push({
        path: '/msite',
        query: {
          geohash
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/style/mixin';

.city{
  padding-top: 2.35rem;
  .city-search{
    border-top: 1px solid $bc;
    border-bottom: 1px solid $bc;
    padding-left: 0.5rem;
    @include font(0.475rem, 0.8rem);
  }
  .city-clear{
    @include sc(0.7rem, #666);
    text-align: center;
    line-height: 2rem;
    background-color: #fff;
  }
  .city-result{
    margin: 0 auto;
    @include font(0.65rem, 1.75rem);
    color: #333;
    background-color: #fff;
    text-indent: 0.5rem;
  }
}
.change_city{
  right: 0.4rem;
  @include sc(0.6rem, #fff);
  @include ct;
}
.city-form{
  background-color: #fff;
  border-top: 1px solid $bc;
  border-bottom: 1px solid $bc;
  padding-top: .4rem;
  width: 100%;
  .city-form__search, .city-form__btn{
    width: 90%;
    margin: 0 auto;
    display: block;
    border: 1px solid #e4e4e4;
    padding: 0 .3rem;
    color: #333;
    font-size: .65rem;
    height: 1.4rem;
    border-radius: .1rem;
    margin-bottom: .4rem;
    outline: none;
  }
  .city-form__btn{
    background-color: #3190e8;
    color: #fff;
  }
}
.city-getpois{
  background-color: #fff;
  border-top: 1px solid $bc;
  .city-getpois__li{
    margin: 0 auto;
    padding-top: .65rem;
    border-bottom: 1px solid $bc;
    .city-getpois__li--name{
      margin: 0 auto .35rem;
      width: 90%;
      @include sc(.65rem, #333);
    }
    .city-getpois__li--address{
      width: 90%;
      margin: 0 auto .55rem;
      @include sc(.45rem, #999);
    }
  }
}
</style>
