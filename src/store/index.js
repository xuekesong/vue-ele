import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,//用户信息
  },
  getters,//是为了初步获取和简单处理state里面的数据（这里的简单处理不能改变 state 里面的数据），Vue 的视图是由数据驱动的，也就是说 state 里面的数据是动态变化的，在 Vuex 中 store 数据改变的唯一方法就是 mutation
  mutations,//里面装着一些改变数据方法的集合，将数据逻辑方法全部放在 mutation 里面，使得数据和视图分离
  actions
})