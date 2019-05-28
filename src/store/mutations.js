import {
  GET_USERINFO,
  RECORD_USERINFO
} from './mutation-types'
import {setStore} from '../config/mUtils'

export default {
  //获取用户信息存入 vuex
  [GET_USERINFO](state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) return;
    if (!state.login) return;
    if (!info.message) {
      state.userInfo = {...info};
    } else {
      state.userInfo = null;
    }
  },
  //记录用户信息
  [RECORD_USERINFO](state, info) {
    state.userInfo = info;
    state.login = true;
    setStore('user_id', info.user_id);
  }
}