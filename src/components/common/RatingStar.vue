<template>
  <div class="rating">
    <section class="rating-star">
      <svg class="rating-star__fill" v-for="num in 5" :key="num">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#star"></use>
      </svg>
    </section>
    <div :style="'width:' + rating*2/5 + 'rem'" class="rating-overflow">
      <section class="rating-overflow__container" >
        <svg  class="rating-overflow__container--fill" v-for="num in 5" :key="num">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#star"></use>
        </svg>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: ['rating']
}
</script>

<style lang="scss" scoped>
@import '../../style/mixin';
.rating{
  position: relative;
  top: .2rem;
  @include wh(2rem, .4rem);
  .rating-star, .rating-overflow__container{
    position: absolute;
    display: flex;
    width: 2rem;
    height: 0.4rem;
    top: -0.02rem;
    left: -0.02rem;
    .rating-star__fill{
      fill: #d1d1d1;
    }
    .rating-overflow__container--fill{
      fill: #ff9a0d;
    }
  }
  .rating-overflow{
    overflow: hidden;
    position: relative;
    height: 100%;
  }
}
</style>
