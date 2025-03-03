import Layout from '@/pages/Layout' //等价于 src/pages/Layout
import Login from '@/pages/Login'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
// 配置路由

const router = createBrowserRouter([
  {
    path:"/",
    element:<Layout/>

  },
  {
    path:"/login",
    element:<Login/>

  }

])
export default router