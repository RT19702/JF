import env from '@/utils/env'
import { getToken } from './auth'

// 判断当前环境
const baseUrl = process.env.NODE_ENV === 'development'
  // 如果是开发环境，则使用env.js中的开发环境地址
  ? env.devBaseUrl
  // 如果是生产环境，则使用env.js中的生产环境地址
  : env.prodBaseUrl

function request<T extends string | AnyObject | ArrayBuffer | undefined>({ url, data = {}, method = "GET" }: { url: string, data?: T, method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | undefined }) {
  return new Promise<any>((resolve, reject) => {
    uni.request({
      url: baseUrl + url,
      data,
      method,
      header: {
        'TOKEN': getToken()
      },
      success: (res) => {
        const respone: any = res.data
        if (respone.code === 0 || respone.code === 2) {
          resolve(respone.data)
        } else {
          if (respone.msg !== '' && respone.msg !== '用户信息不存在' && respone.msg !== '无效推荐码') {
            uni.showToast({
              title: respone.msg,
              icon: "none"
            })
          }
          reject(respone)
        }
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        uni.hideLoading()
      }
    })
  })
}

export default request;
