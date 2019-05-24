import { GET_USERINFO } from './mutation-types'
import { getUser } from '../service/getData'

export default {
  //async 就是 Generator 函数的语法糖
  //async 函数自带执行器，表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果
  //async 函数的返回值是 Promise 对象，可以用 then 方法指定下一步的操作
  //async 函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而 await 命令就是内部 then 命令的语法糖
  async getUserInfo({
    commit,
    state
  }) {
    let res = await getUser();
    commit(GET_USERINFO, res);
  }
}