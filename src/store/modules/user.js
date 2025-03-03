// 和用户相关的状态管理
import { createSlice } from "@reduxjs/toolkit";
import { request } from "@/utils";
// createSlice 自动生成Reducer 函数 和 Action Creators
const userStore = createSlice({
  name:"user",
  // 数据状态
  initialState:{
    // 后端返回的类型是什么，这里就写什么，是string，就写空串
    token:''
  },
  // 同步修改方法
  reducers:{
    setToken(state,action){
      state.token = action.payload
    }
  }
})

// 解构出action Creater

const {setToken} = userStore.actions

// 获取reducer函数

const userReducer = userStore.reducer

// 异步方法 完成登录获取token
const fetchLogin =(loginForm)=>{
  return async (dispatch)=>{
    // 发送异步请求
    const res =await request.post('/authorizations',loginForm)
    // 提交同步action进行token存入
    dispatch(setToken(res.data.token))
  }
}

export {fetchLogin,setToken}
export default userReducer