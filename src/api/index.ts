import request from "@/utils/request";

const loginUrl = '/dapp/index';
const userUrl = '/dapp/user';
const apiUrl = '/dapp/api';

// 入口
export const checkUser = (data: object) => {
  return request({
    url: loginUrl + '/checkUser',
    data,
    method: 'POST'
  })
}

// 质押
export const pledge = (data: object) => {
  return request({
    url: userUrl + '/pledge_submit',
    data,
    method: 'POST'
  })
}

// 邀请链接
export const invite = (data: object) => {
  return request({
    url: apiUrl + '/getInvitedCode',
    data,
    method: 'POST'
  })
}

// 新增用户
export const addUser = (data: object) => {
  return request({
    url: loginUrl + '/userInc',
    data,
    method: 'POST'
  })
}

// 邀请链接
export const getInvite = () => {
  return request({
    url: apiUrl + '/getInvitedCode',
    method: 'POST'
  })
}

// 获取系统信息
export const getConfigInfo = () => {
  return request({
    url: apiUrl + '/getConfigInfo',
    method: 'POST'
  })
}