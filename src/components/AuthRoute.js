// 封装高阶组件


import {getToken} from '@/utils'
import {Navigate} from 'react-router-dom'

// 核心逻辑：有token 正常跳转 无token 去登录
export function AuthRoute({children}){
  const token = getToken()
  if(token){
    return <>{children}</>
  }
  else{
    return <Navigate to={'/login'} replace/>
  }
}