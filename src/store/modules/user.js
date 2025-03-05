// 和用户相关的状态管理
import { createSlice } from "@reduxjs/toolkit";
import { removeToken} from "@/utils";
import {setToken as _setToken ,getToken} from '@/utils'
import { loginAPI,getProfileAPI } from "@/apis/user";
// createSlice 自动生成Reducer 函数 和 Action Creators
const userStore = createSlice({
  name:"user",
  // 数据状态
  initialState:{
    // 后端返回的类型是什么，这里就写什么，是string，就写空串
    token: getToken()||'',
    userInfo:{}
  },
  // 同步修改方法
  reducers:{
    setToken(state,action){
      state.token = action.payload
      // localstorage存一份
      _setToken(action.payload)

    },
    setUserInfo(state,action){
      state.userInfo = action.payload
    },
    clearUserInfo(state){
      state.token = ''
      state.userInfo={}
      removeToken()
    }
  }
})

// 解构出action Creater

const {setToken,setUserInfo,clearUserInfo} = userStore.actions

// 获取reducer函数

const userReducer = userStore.reducer

// 异步方法 完成登录获取token
const fetchLogin =(loginForm)=>{
  return async (dispatch)=>{
    // 发送异步请求
    const res =await loginAPI(loginForm)
    // 提交同步action进行token存入
    dispatch(setToken(res.data.token))
  }
}
// 异步方法 获取个人用户信息
const fetchUserInfo =()=>{
  return async (dispatch)=>{
    // 发送异步请求
    const res = await getProfileAPI()
    dispatch(setUserInfo(res.data))
  }
}

export {fetchLogin,fetchUserInfo,clearUserInfo,setToken}
export default userReducer