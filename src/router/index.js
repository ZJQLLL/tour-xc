import Layout from '@/pages/Layout' //等价于 src/pages/Layout
import Login from '@/pages/Login'
import {createBrowserRouter} from 'react-router-dom'
import {AuthRoute} from '@/components/AuthRoute'
import Article from '@/pages/Article'
import { Suspense } from 'react'
// 实现路由懒加载
// // 1、lazy函数对组件进行导入

// const Home = lazy(()=>import('@/pages/Home'))
// const Article = lazy(()=>import('@/pages/Article'))
// const Publish = lazy(()=>import('@/pages/Publish'))


// 配置路由

const router = createBrowserRouter([
  {
    path:"/",
    element: <AuthRoute><Layout/></AuthRoute>,
    children:[
      {
        path:'article',
        element:<Suspense fallback={'加载中'}><Article /></Suspense>
      },
    ]

  },
  {
    path:"/login",
    element:<Login/>

  }

])
export default router