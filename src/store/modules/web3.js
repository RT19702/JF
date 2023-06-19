import web3 from 'web3'
import BigNumber from 'bignumber.js'
import {
  removeToken,
  getAddress,
  setAddress,
  removeAddress
} from '@/utils/auth'
//
const USDT = require('@/common/ABI/usdt.json')
const SET = require('@/common/ABI/set.json')

const state = {
  web3: {},
  defaultAccount: '', // 以太坊账户地址
  balanceOf_usdt: BigNumber(0),
  disconnect: false
}

const actions = {
  // 用户dapp签名
  sign() {
    return this.state.web3.web3.eth.personal.sign('sign this Dapp!', this.state.web3.defaultAccount)
  },
  async init({ commit }) {
    // window.ethereum 对象的属性和方法只在用户安装并授权了MetaMask或其他兼容的以太坊钱包时才可用
    if (!window.ethereum) {
      return uni.$showToast('Please Connect Your Wallet')
    }
    try {
      if (!window.ethereum) {
        uni.$showToast('Please Connect Your Wallet')
        return
      }
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{
            chainId: '0x38',
          }]
        })
        let accounts = await ethereum.request({
          method: 'eth_requestAccounts'
        })
        let _web3 = new web3(window.ethereum)
        let defaultAccount = accounts[0]
        commit('update', {
          web3: _web3,
          defaultAccount
        })
        // 存储钱包地址
        if (!getAddress()) {
          setAddress(defaultAccount)
        } else {
          const addressKey = getAddress()
          if (addressKey != defaultAccount) {
            removeAddress()
            removeToken()
          }
        }
        this.dispatch('web3/getBalanceOfUsdt')
      } catch (err) {
        console.error(err)
      }
    } catch (err) {
      console.log(err)
      return Promise.resolve()
    };
  },
  // 获取钱包USDT余额
  getBalanceOfUsdt({
    commit,
    state
  }) {
    const {
      defaultAccount,
      web3
    } = state
    const {
      balanceOf
    } = new web3.eth.Contract(
      USDT.abi,
      USDT.address
    ).methods
    balanceOf(defaultAccount).call().then(res => {
      const balanceOf_usdt = BigNumber(res)
      commit('update', {
        balanceOf_usdt
      })
    }).catch((e) => {
      console.log(e)
    })
  },
  transfer(context, {
    amount,
    to
  }) {
    const {
      defaultAccount,
      web3
    } = state
    const {
      transfer
    } = new web3.eth.Contract(
      USDT.abi,
      USDT.address
    ).methods
    return transfer(to, amount).send({
      from: defaultAccount
    })
  },
  // 进行BNB原生代币支付
  transferBnb(context, {
    amount,
    to
  }) {
    const {
      defaultAccount,
      web3
    } = state
    return new Promise((resolve, reject) => {
      web3.eth.sendTransaction({
        from: defaultAccount,
        to,
        value: web3.utils.toWei(amount.toString(), 'ether')
      })
        .once('transactionHash', (hash) => {
          console.log(`Transaction hash: ${hash}`)
        })
        .once('receipt', (receipt) => {
          console.log(`Transaction receipt: ${receipt}`)
          resolve(receipt)
        })
        .once('error', (error) => {
          console.error(`Transaction error: ${error}`)
          reject(error)
        })
    })
  },
  // 进行SET代币支付
  transferSet(context, {
    amount,
    to
  }) {
    const {
      defaultAccount,
      web3
    } = state
    const {
      transfer
    } = new web3.eth.Contract(
      SET.abi,
      SET.address
    ).methods
    return transfer(to, amount).send({
      from: defaultAccount
    })
  },
}

const mutations = {
  update(state, payload) {
    Object.keys(payload).forEach(key => {
      state[key] = payload[key]
    })
  },
  disconnect(state) {
    state.disconnect = true
  }
}

export default {
  namespaced: true, // namespaced: true 的方式使其成为带命名空间的模块。保证在变量名一样的时候，添加一个父级名拼接。
  actions,
  mutations,
  state
}
