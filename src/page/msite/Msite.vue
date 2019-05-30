<template>
  <div class="msite">
    <head-top signin-up="msite">
      <router-link :to="'/search/geohash'" class="msite-search" slot="search">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none"/>
          <line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2"/>
        </svg>
      </router-link>
      <router-link to="/home" slot="msite-title" class="msite-title">
				<span class="msite-title__text ellipsis">{{msiteTitle}}</span>
			</router-link>
    </head-top>
    <nav class="msite-nav">
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="(item, index) in foodTypes" :key="index" class="msite-nav__container">
          <router-link :to="{path: '/food', query: {geohash, title: foodItem.title, restaurant_category_id: getCategoryId(foodItem.link)}}" v-for="foodItem in item" :key="foodItem.id" class="msite-nav__container--link">
            <figure>
              <img :src="imgBaseUrl + foodItem.image_url" >
              <figcaption>{{foodItem.title}}</figcaption>
            </figure>
          </router-link>
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>
    </nav>
    <div class="msite-shop">
      <header class="msite-shop__header">
        <svg class="msite-shop__header--icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
        </svg>
        <span class="msite-shop__header--name">附近商家</span>
      </header>
      <shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
import HeadTop from '@/components/header/Header'
import {msiteFoodTypes} from '@/service/getData'
import {cityGuess, msiteAddress} from '@/service/getData'
import {mapMutations} from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import ShopList from '@/components/common/ShopList'
import footGuide from '@/components/footer/FootGuide'
import 'swiper/dist/css/swiper.css'

export default {
  data() {
    return {
      msiteTitle: '请选择地址...',//页面头部标题
      foodTypes: [],//食品分类列表
      geohash: '',//city页面传递过来的地址geohash
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        }
      },
      imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
      hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
    }
  },
  components: {
    HeadTop,
    swiper,
    swiperSlide,
    ShopList,
    footGuide
  },
  async beforeMount() {
    if (!this.$route.query.geohash) {
      const address = await cityGuess();
      this.geohash = address.latitude + ',' + address.longitude;
    } else {
      this.geohash = this.$route.query.geohash;
    }
    //保存geohash 到 vuex
    this.SAVE_GEOHASH(this.geohash);
    //获取位置信息
    let _res = await msiteAddress(this.geohash);
    this.msiteTitle = _res.name;
    //记录当前经度纬度
    this.RECORD_ADDRESS(_res);
    this.hasGetData = true;
  },
  mounted() {
    //获取导航食品类型列表
    msiteFoodTypes(this.geohash).then(res => {
      let resLength = res.length;
      let resArr = [...res];//返回一个新的数组
      let foodArr = [];
      for (let i = 0, j = 0; i < resLength; i += 8, j++) {
        foodArr[j] = resArr.splice(0, 8);
      }
      this.foodTypes = foodArr;
    }).then(() => {
      return this.$refs.mySwiper.swiper;
    })
  },
  methods: {
    getCategoryId(url) {//解码url地址，求去restaurant_category_id值
      let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
      if (/restaurant_category_id/gi.test(urlData)) {
        return JSON.parse(urlData).restaurant_category_id.id;
      }
      return '';
    },
    ...mapMutations([
      'SAVE_GEOHASH', 'RECORD_ADDRESS'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import 'src/style/mixin';
.msite-search{
  left: .8rem;
  @include wh(.9rem, .9rem);
  @include ct;
}
.msite-title{
  @include center;
  width: 50%;
  color: #fff;
  text-align: center;
  margin-left: -0.5rem;
  .msite-title__text{
    @include sc(0.8rem, #fff);
    text-align: center;
    display: block;
  }
}
.msite-nav{
  padding-top: 2.1rem;
  background-color: #fff;
  border-bottom: 0.025rem solid $bc;
  height: 10.6rem;
  .msite-nav__container{
    display: flex;
    flex-wrap: wrap;
    .msite-nav__container--link{
      width: 25%;
      padding: .3rem 0;
      @include fj(center);
      figure{
        img{
          margin-bottom: .3rem;
          @include wh(1.8rem, 1.8rem);
        }
        figcaption{
          text-align: center;
          @include sc(.55rem, #666);
        }
      }
    }
  }
}
.swiper-container{
  height: 100%;
  padding-bottom: .6rem;
}
.msite-shop{
  margin-top: .4rem;
  border-top: 0.025rem solid $bc;
  background-color: #fff;
  .msite-shop__header{
    .msite-shop__header--icon{
      fill: #999;
      margin-left: 0.6rem;
      vertical-align: middle;
      @include wh(0.6rem, 0.6rem);
    }
    .msite-shop__header--name{
      color: #999;
			@include font(0.55rem, 1.6rem);
    }
  }
}
</style>
