const TokenKey = 'token';
const AccountKey = 'account';
const AddressKey = 'address';

// 获取钱包账户
export function getAccount() {
  return uni.getStorageSync(AccountKey)
}

// 设置钱包账户
export function setAccount(account: any) {
  return uni.setStorageSync(AccountKey, account)
}

// 获取钱包地址
export function getAddress() {
  return uni.getStorageSync(AddressKey)
}

// 设置钱包地址
export function setAddress(address: string) {
  return uni.setStorageSync(AddressKey, address)
}

// 获取Token
export function getToken() {
  return uni.getStorageSync(TokenKey)
}

// 设置Token
export function setToken(token: string) {
  return uni.setStorageSync(TokenKey, token)
}

// 全部移除
export function removeAll() {
  uni.clearStorage();
}