// 用户相关请求
import { request } from "@/utils";
// 1、登录请求,返回值是一个Promise
export function loginAPI(formData) {
  return request({
    url: '/login',
    method: 'POST',
    data: formData

  })
}
// 2、获取用户信息

export function getProfileAPI() {
  return request({
    url: '/get_user_info',
    method: 'GET',
  })
}