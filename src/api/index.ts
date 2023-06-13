import request from "@/utils/request";

/* 登录接口 */
const loginUrl = '/dapp/index';

// 入口
export const checkUser = (data: object) => {
  return request({
    url: loginUrl + '/checkUser',
    data,
    method: 'POST'
  })
}