// 封装用于文章数据的获取

import request from '@/utils/request'

// 导出一个方法
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}

// 不喜欢
export function disLikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}
