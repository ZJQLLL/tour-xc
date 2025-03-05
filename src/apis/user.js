// 用户相关请求
import { request } from "@/utils";
// 1、登录请求,返回值是一个Promise
export function loginAPI(formData){
  return request({
    url:'/authorizations',
    method:'POST',
    data:formData

  })
}
// 2、获取用户信息

export function getProfileAPI(formData){
  return request({
    url:'/user/profile',
    method:'GET',
  })
}