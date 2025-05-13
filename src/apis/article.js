// 封装和文章相关的接口函数
import { request } from "@/utils";



// Article

// 1、获取频道列表
export function getChannelAPI(){
  return request({
    url:'/channels',
    method:'GET',
  
  })
}



// 3、获取文章列表

export function getArticleListAPI(params){
  return request({
    url:"/get_review_list",
    method:'GET',
    params
  })
}

// 删除文章
export function delArticleAPI(id) {
  return request({
    url: `/delete_note`,
    method: 'DELETE',
    data:{id}
  })
}

// 审核通过文章
export function approveArticleAPI(id) {
  return request({
    url: `/approve_note`,
    method: 'POST',
    data: { id },
    headers: {
      'Content-Type': 'application/json' // 通常不需要，axios会自动设置
    }
  })
}


// 审核拒绝文章
export function rejectArticleAPI(id, reason) {
  return request({
    url: `/reject_note`,
    method: 'POST',
    data: { id, reason },
    headers: {
      'Content-Type': 'application/json' // 通常不需要，axios会自动设置
    }
  })
}


//Publish


// 获取文章详情
export function getArticleById(id){
  return request({
    url:`/mp/articles/${id}`,
    
  })
}

// 2、提交文章表单
export function createArticleAPI(data){
  return request({
    url:'/mp/articles?draft=false',
    method:'POST',
    data
  })
}

