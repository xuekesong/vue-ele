import App from '../App'
//require.ensure动态加载依赖的唯一方法，可以在模块执行时才运行代码，只有在满足某些条件时才加载依赖项
const home = r => require.ensure([], () => r(require('@/page/home/Home')), 'home')

export default [
  {
    path: '/',
    component: App,//顶层路由，对应index.html
    children: [//二级路由，对应App.vue
      {
        path: '',
        redirect: '/home'
      },
      {
        path: '/home',
        component: home
      }
    ]
  }
]
