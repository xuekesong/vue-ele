<template>
  <div>
    <head-top>
      <span slot="logo" class="head-logo" @click="reload">ele-self</span>
    </head-top>
    <nav class="city-nav">
      <div class="city-nav__tip">
        <span class="city-nav__tip--title">当前定位城市：</span>
        <span class="city-nav__tip--desc">定位不准确，请在城市列表中选择</span>
      </div>
      <router-link :to="'/city/' + guessCityid" class="city-nav__guess">
        <span class="city-nav__guess--address">{{guessCity}}</span>
        <svg class="city-nav__guess--arrow">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
        </svg>
      </router-link>
    </nav>
    <section class="hot-city">
      <h4 class="hot-city__title">热门城市</h4>
      <ul class="hot-city__list clear">
        <router-link tag="li" class="hot-city__list--li" v-for="item in hotcity" :to="'/city/'+ item.id" :key="item.id">
          {{item.name}}
        </router-link>
      </ul>
    </section>
    <section class="group-city">
      <ul class="group-city__list">
        <li class="group-city__list--single" v-for="(value, key, index) in sortgroupcity" :key="key">
          <h4 class="group-city__list--single--title">{{key}}<span v-if="index == 0">（按字母排序）</span></h4>
          <ul class="group-city__list--single--ul clear">
            <router-link tag="li" v-for="item in value" :to="'/city/' + item.id" :key="item.id" class="group-city__list--single--ul--li">{{item.name}}</router-link>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import HeadTop from '@/components/header/Header'
import { hotcity, groupcity, cityGuess } from '@/service/getData'
export default {
  data() {
    return {
      guessCity: '',//当前城市
      guessCityid: '',//当前城市id
      hotcity: [],//热门城市列表
      groupcity: {}//所有城市列表
    }
  },
  mounted() {
    //获取当前城市
    cityGuess().then(res => {
      this.guessCity = res.name;
      this.guessCityid = res.id;
    })

    //获取热门城市
    hotcity().then(res => {
      this.hotcity = res;
    })

    //获取所有城市
    groupcity().then(res => {
      this.groupcity = res;
    })
  },
  computed: {
    sortgroupcity() {//将获取的数据按照A-Z字母开头排序
      let sortobj = {};
      for (let i = 65; i <= 90; i++) {
        if (this.groupcity[String.fromCharCode(i)]) {//String.fromCharCode(i)返回由指定的UTF-16代码单元序列创建的字符串
          sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)];
        }
      }
      return sortobj;
    }
  },
  components: {
    HeadTop
  },
  methods: {
    reload() {//点击图标刷新页面
      window.location.reload();
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/mixin';
.head-logo{
  left: 0.4rem;
  font-weight: 400;
  @include sc(0.7rem, #fff);
  // @include wh(2.3rem, 0.7rem);
  @include ct;
}
.city-nav{
  padding-top: 2.35rem;
  border-top: 1px solid $bc;
  background-color: #fff;
  margin-bottom: 0.4rem;
  .city-nav__tip{
    @include fj;
    line-height: 1.45rem;
    padding: 0 .45rem;
    .city-nav__tip--title{
      @include sc(.55rem, #666);
    }
    .city-nav__tip--desc{
      font-weight: 900;
      @include sc(.475rem, #9f9f9f);
    }
  }

  .city-nav__guess{
    @include fj;
    align-items: center;
    height: 1.8rem;
    padding: 0 0.45rem;
    border-top: 1px solid $bc;
    border-bottom: 2px solid $bc;
    @include font(0.75rem, 1.8rem);
    .city-nav__guess--arrow{
      @include wh(.6rem, .6rem);
      fill: #999;
    }
    .city-nav__guess--address{
      color: $blue;
    }
  }
}
.hot-city{
  background-color: #fff;
  margin-bottom: .4rem;
  .hot-city__title{
    color: #666;
    font-weight: 400;
    text-indent: .45rem;//首行文本内容之前空置的位置
    border-top: 2px solid $bc;
    border-bottom: 1px solid $bc;
    @include font(0.55rem, 1.45rem, "Helvetica Neue");
    span{
      @include sc(0.475rem, #999);
    }
  }
  .hot-city__list{
    .hot-city__list--li{
      float: left;
      text-align: center;
      color: $blue;
      border-bottom: 0.025rem solid $bc;
      border-right: 0.025rem solid $bc;
      @include wh(25%, 1.75rem);
      @include font(0.6rem, 1.75rem);
    }
    .hot-city__list--li:nth-of-type(4n){
      border-right: none;
    }
  }
}
.group-city{
  width: 100%;
  .group-city__list{
    width: 100%;
    .group-city__list--single{
      margin-bottom: .4rem;
      background-color: #fff;
      border-bottom: 1px solid $bc;
      .group-city__list--single--title{
        color: #666;
        font-weight: 400;
        text-indent: 0.45rem;
        border-top: 2px solid $bc;
        border-bottom: 1px solid $bc;
        @include font(0.55rem, 1.45rem, "Helvetica Neue");
        span{
          @include sc(0.475rem, #999);
        }
      }
      .group-city__list--single--ul{
        width: 100%;
        .group-city__list--single--ul--li{
          color: #666;
          float: left;
          text-align: center;
          color: $blue;
          border-bottom: 0.025rem solid $bc;
          border-right: 0.025rem solid $bc;
          @include wh(25%, 1.75rem);
          @include font(0.6rem, 1.75rem);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:nth-of-type(4n){
            border-right: none;
          }
        }
      }
    }
  }
}
</style>
