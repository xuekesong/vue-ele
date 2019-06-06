import App from '../App'
//require.ensure动态加载依赖的唯一方法，可以在模块执行时才运行代码，只有在满足某些条件时才加载依赖项
const home = r => require.ensure([], () => r(require('@/page/home/Home')), 'home')
const login = r => require.ensure([], () => r(require('@/page/login/Login')), 'login')
const forget = r => require.ensure([], () => r(require('@/page/forget/Forget')), 'forget')
const city = r => require.ensure([], () => r(require('@/page/city/City')), 'city')
const msite = r => require.ensure([], () => r(require('@/page/msite/Msite')), 'msite')
const search = r => require.ensure([], () => r(require('@/page/search/Search')), 'search')

export default [
  {
    path: '/',
    component: App,//顶层路由，对应index.html
    children: [//二级路由，对应App.vue
      {
        path: '',
        redirect: '/home'
      }, {//首页城市列表
        path: '/home',
        component: home
      }, {//登录注册页
        path: '/login',
        component: login
      }, {//修改密码页
        path: '/forget',
        component: forget
      }, {//当前选择城市页
        path: '/city/:cityid',
        component: city
      }, {//所有商铺列表页
        path: '/msite',
        component: msite,
        meta: {
          keepAlive: true
        }
      }, {
        path: '/search/:geohash',
        component: search
      }
    ]
  }
]
