import request from "@/utils/request"

const loginUrl = '/dapp/index'
const userUrl = '/dapp/user'
const apiUrl = '/dapp/api'

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

// 货币流水
export const getCoinFlow = (data: object) => {
  return request({
    url: userUrl + '/CurrencyDetails',
    data,
    method: 'POST'
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: apiUrl + '/getUserInfo',
    method: 'POST'
  })
}

// 获取团队信息
export const getTeam = (data: object) => {
  return request({
    url: apiUrl + '/getTeam',
    data,
    method: 'POST'
  })
}

// 质押数据
export const getPledge = () => {
  return request({
    url: userUrl + '/pledge_info',
    method: 'POST'
  })
}

// 质押列表
export const getPledgeList = (data: object) => {
  return request({
    url: userUrl + '/pledge_list',
    data,
    method: 'POST'
  })
}

// 撤销质押
export const cancelPledge = (data: object) => {
  return request({
    url: userUrl + '/RevokPledge',
    data,
    method: 'POST'
  })
}

// 等级分红池  列表
export const getLevelBonus = () => {
  return request({
    url: userUrl + '/LevelRewardCollection',
    method: 'POST'
  })
}

// 领取等级分红
export const receiveReward = (data: object) => {
  return request({
    url: userUrl + '/receiveReward',
    data,
    method: 'POST'
  })
}

// 转账
export const transfer = (data: object) => {
  return request({
    url: apiUrl + '/userTransfer',
    data,
    method: 'POST'
  })
}
// 提币
export const withdraw = (data: object) => {
  return request({
    url: apiUrl + '/withdrawal',
    data,
    method: 'POST'
  })
}
// 充值回调
export const rechargeCallBack = (data: object) => {
  return request({
    url: userUrl + '/RechargeCallback',
    data,
    method: 'POST'
  })
}
// 充值
export const rechargePay = (data: object) => {
  return request({
    url: userUrl + '/recharge_new',
    data,
    method: 'POST'
  })
}