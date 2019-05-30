<template>
  <div class="shoplist">
    <ul v-load-more="loaderMore" class="shoplist-ul" v-if="shopListArr.length" type="1">
      <router-link :to="{path: 'shop', query: {geohash, id: item.id}}" v-for="item in shopListArr" tag="li" :key="item.id" class="shoplist-ul__li">
        <img :src="imgBaseUrl + item.image_path" class="shoplist-ul__li--icon">
        <hgroup class="shoplist-ul__li--detail">
          <header class="shoplist-ul__li--detail--header">
            <h4 :class="item.is_premium ? 'premium' : ''" class="shoplist-ul__li--detail--header--title ellipsis">{{item.name}}</h4>
            <ul class="shoplist-ul__li--detail--header--icon">
              <li v-for="iconItem in item.supports" :key="iconItem.id" class="shoplist-ul__li--detail--header--icon--single">{{iconItem.icon_name}}</li>
            </ul>
          </header>
          <h5 class="shoplist-ul__li--detail--rating">
            <section class="rating_order_num_left">
							<section class="rating_section">
								<rating-star :rating='item.rating'></rating-star>
								<span class="rating_num">{{item.rating}}</span>
							</section>
							<section class="order_section">
								月售{{item.recent_order_num}}单
							</section>
						</section>
						<section class="rating_order_num_right">
							<span class="delivery_style delivery_left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
							<span class="delivery_style delivery_right" v-if="zhunshi(item.supports)">准时达</span>
						</section>
          </h5>
          <h5 class="fee_distance">
						<p class="fee">
							¥{{item.float_minimum_order_amount}}起送
							<span class="segmentation">/</span>
							{{item.piecewise_agent_fee.tips}}
						</p>
						<p class="distance_time">
							<span v-if="Number(item.distance)">{{item.distance > 1000? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}}
								<span class="segmentation">/</span>
							</span>
							<span v-else>{{item.distance}}</span>
							<span class="segmentation">/</span>
							<span class="order_time">{{item.order_lead_time}}</span>
						</p>
					</h5>
        </hgroup>
      </router-link>
    </ul>
    <ul v-else class="animation_opactiy">
			<li class="list_back_li" v-for="item in 10" :key="item">
				<img src="../../images/shopback.svg" class="list_back_svg">
			</li>
		</ul>
		<p v-if="touchend" class="empty_data">没有更多了</p>
		<aside class="return_top" @click="backTop" v-if="showBackStatus">
			<svg class="back_top_svg">
				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
			</svg>
		</aside>
		<div ref="abc" style="background-color: red;"></div>
		<transition name="loading">
			<loading v-show="showLoading"></loading>
		</transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {shopList} from '@/service/getData'
import {showBack, animate} from '@/config/mUtils'
import RatingStar from './RatingStar'
import Loading from './Loading'
import {loadMore, getImgPath} from './mixin'

export default {
  props: ['restaurantCategoryId', 'restaurantCategoryIds', 'sortByType', 'deliveryMode', 'supportIds', 'confirmSelect', 'geohash'],
  data() {
    return {
      shopListArr: [],//店铺列表数据
      offset: 0,//批次加载店铺列表，每次加载20个 limit = 20
      touchend: false,//没有更多数据
      showLoading: true,//显示加载动画
      showBackStatus: false,//显示返回顶部按钮
      imgBaseUrl: '/img/',
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
    }
  },
  computed: {
    ...mapState([
      'latitude', 'longitude'
    ])
  },
  mounted() {
    this.initData();
  },
  components: {
    RatingStar,
    Loading
  },
  watch: {
    //监听父级传来的restaurantCategoryIds，当值发生变化的时候重新获取餐馆数据，作用于排序和筛选
		restaurantCategoryIds: function (value){
			this.listenPropChange();
		},
		//监听父级传来的排序方式
		sortByType: function (value){
			this.listenPropChange();
		},
		//监听父级的确认按钮是否被点击，并且返回一个自定义事件通知父级，已经接收到数据，此时父级才可以清除已选状态
		confirmSelect: function (value){
			this.listenPropChange();
		}
  },
  mixins: [loadMore, getImgPath],
  methods: {
    async initData() {
      //获取数据
      let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
      this.shopListArr = [...res];
      if (res.length < 20) {
        this.touchend = true;
      }
      this.hideLoading();
      //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
      showBack(status => {
        this.showBackStatus = status;
      })
    },
    hideLoading() {
      this.showLoading = false;
    },
    zhunshi(supports) {
      let zhunStatus;
      if ((supports instanceof Array) && supports.length) {
 				supports.forEach(item => {
 					if (item.icon_name === '准') {
 						zhunStatus = true;
 					}
 				})
			}else{
				zhunStatus = false;
			}
			return zhunStatus;
    },
    backTop() {//返回顶部
      animate(document.body, {scrollTop: '0'}, 400,'ease-out');
    },
    async loaderMore() {//到达底部加载更多数据
      if (this.touchend) {
        console.log('1')
        return;
      }
      //防止重复请求
      if (this.preventRepeatReuqest) {
        return;
      }
      this.showLoading = true;
      this.preventRepeatReuqest = true;

      //数据的定位加20位
      this.offset += 20;
      let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
      this.hideLoading();
      this.shopListArr = [...this.shopListArr, ...res];
      //当获取数据小于20，说明没有更多数据，不需要再次请求数据
      if (res.length < 20) {
        this.touchend = true;
        return;
      }
      this.preventRepeatReuqest = false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/style/mixin';
.shoplist{
  margin-bottom: 2rem;
  background-color: #fff;
}
.shoplist-ul__li{
  display: flex;
  border-bottom: .025rem solid #f1f1f1;
  padding: .7rem .4rem;
  .shoplist-ul__li--icon{
    @include wh(2.7rem, 2.7rem);
		display: block;
		margin-right: 0.4rem;
  }
  .shoplist-ul__li--detail{
    flex: auto;
    .shoplist-ul__li--detail--header{
      @include fj;
      align-items: center;
      .shoplist-ul__li--detail--header--title{
        width: 8.5rem;
				color: #333;
				padding-top: .01rem;
				@include font(0.65rem, 0.65rem, 'PingFangSC-Regular');
				font-weight: 700;
      }
      .premium::before{
				content: '品牌';
				display: inline-block;
				font-size: 0.5rem;
				line-height: .6rem;
				color: #333;
				background-color: #ffd930;
				padding: 0 0.1rem;
				border-radius: 0.1rem;
				margin-right: 0.2rem;
			}
      .shoplist-ul__li--detail--header--icon{
        display: flex;
        transform: scale(.8);
        margin-right: -.3rem;
        .shoplist-ul__li--detail--header--icon--single{
          @include sc(0.5rem, #999);
					border: 0.025rem solid #f1f1f1;
					padding: 0 0.04rem;
					border-radius: 0.08rem;
					margin-left: 0.05rem;
        }
      }
    }
    .shoplist-ul__li--detail--rating{
      @include fj(space-between);
			height: 0.6rem;
			margin-top: 0.52rem;
      .rating_order_num_left{
				@include fj(flex-start);
				.rating_section{
					display: flex;
					.rating_num{
						@include sc(0.4rem, #ff6000);
						margin: 0 0.2rem;
					}
				}
				.order_section{
					transform: scale(.8);
					margin-left: -0.2rem;
					@include sc(0.4rem, #666);
				}
			}
			.rating_order_num_right{
				display: flex;
				align-items: center;
				transform: scale(.7);
				min-width: 5rem;
				justify-content: flex-end;
				margin-right: -0.8rem;
				.delivery_style{
					font-size: 0.4rem;
					padding: 0.04rem 0.08rem 0;
					border-radius: 0.08rem;
					margin-left: 0.08rem;
					border: 1px;
				}
				.delivery_left{
					color: #fff;
					background-color: $blue;
					border: 0.025rem solid $blue;
				}
				.delivery_right{
					color: $blue;
					border: 0.025rem solid $blue;
				}
			}
    }
  }
  .fee_distance{
    margin-top: 0.52rem;
    @include fj;
    @include sc(0.5rem, #333);
    .fee{
      transform: scale(.9);
      @include sc(0.5rem, #666);
    }
    .distance_time{
      transform: scale(.9);
      span{
        color: #999;
      }
      .order_time{
        color: $blue;
      }
      .segmentation{
        color: #ccc;
      }
    }
  }
}
</style>
