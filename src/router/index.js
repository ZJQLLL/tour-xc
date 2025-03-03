import Layout from '@/pages/Layout' //等价于 src/pages/Layout
import Login from '@/pages/Login'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import {AuthRoute} from '@/components/AuthRoute'
import Home from '@/pages/Home'
import Article from '@/pages/Article'
import Publish from '@/pages/Publish'


// 配置路由

const router = createBrowserRouter([
  {
    path:"/",
    element: <AuthRoute><Layout/></AuthRoute>,
    children:[
      {
        path:'home',
        element:<Home />
      },
      {
        path:'article',
        element:<Article />
      },
      {
        path:'publish',
        element:<Publish />
      },
    ]

  },
  {
    path:"/login",
    element:<Login/>

  }

])
export default router