// 导入API配置文件
import env from './env.js'

// 目标公链简称，默认值：BSC，可选：BSC/BSCT，比如，需要使用币安智能链则为BSC
var CHAIN_NAME_SYMBOL = 'BSC'

/**
 * 当需要把此API集成到项目中时，
 * 需要安装npm install web3 bignumber.js
 * 取消下方的导入注释
 */
// 导入web3Js库
// import Web3 from 'web3'
// 导入大数计算库
import BigNumber from 'bignumber.js'

/**
 * 当前账户
 */
const Account = (() => {
	return {
		address: '',
		token: {
			// 原生代币简称
			symbol: env[CHAIN_NAME_SYMBOL].chain.nativeCurrency.symbol,
			// 原生代币精度
			decimals: env[CHAIN_NAME_SYMBOL].chain.nativeCurrency.decimals,
			// 原生代币余额
			balance: ''
		},
		cTokens: {},
		// 初始化账户
		async init(web3Instance) {
			// 赋值web3实例
			this.web3 = web3Instance
			await this._updateAddress()
			await this.updateBalance()
			// 添加监听函数，并改变函数内部this指向为当前实例
			window.ethereum.on('accountsChanged', this._accountsChangedListener.bind(this))
		},
		// 监听已连接DApp的账户改变
		async _accountsChangedListener(accounts) {
			[this.address] = accounts
			// 更新原生代币余额
			await this.updateBalance()
			// 更新所有智能合约代币余额
			for (const cTokenSymbol in this.cTokens) {
				// 更新${cTokenSymbol}代币余额
				await this.cTokens[cTokenSymbol].updateCBalance()
			}
			this.formatOutput()
		},
		// 格式化当前账户代币输出
		formatOutput() {
			let formatText = ''
			for (const cTokenSymbol in this.cTokens) {
				// 拼接格式化文本
				formatText += `\n\t${cTokenSymbol}代币：${this.cTokens[cTokenSymbol].balance}`
			}
			console.log(`账户(${this.address}):\n\t原生代币：${this.token.balance} ${this.token.symbol}${formatText}`)
		},
		// 添加合约代币并初始化代币
		async addCToken(symbol) {
			this.cTokens[symbol] = new CToken(this.web3, symbol)
			await this.cTokens[symbol].init()
		},
		// 更新账户钱包地址
		async _updateAddress() {
			[this.address] = await this.web3.eth.getAccounts()
		},
		// 更新原生代币余额
		async updateBalance() {
			const weiToken = await this.web3.eth.getBalance(this.address)
			this.token.balance = new BigNumber(weiToken).div(new BigNumber(Math.pow(10, this.token.decimals))).toString()
		},
		// 原生代币转账
		async transfer(recAccount, sendNum) {
			if (Number(sendNum) > Number(this.token.balance)) {
				alert(`账户${this.token.symbol}余额不足，无法转账`)
				return false
			}
			const weiNum = new BigNumber(sendNum).times(new BigNumber(Math.pow(10, this.token.decimals))).toString()
			await this.web3.eth.sendTransaction({
				from: this.address,
				to: recAccount,
				value: weiNum
			})
				.on('transactionHash', this._hashListener.bind(this, ...arguments))
				.on('receipt', this._receiptListener.bind(this))
				.on('error', console.error)
		},
		// 监听到transactionHash以后，输出交易hash到控制台并给出交易查询地址
		_hashListener(recAccount, sendNum, hash) {
			console.log(`交易ID：${hash}\n原生代币转移：From(${this.address}) => To(${recAccount}) For ${sendNum} ${this.token.symbol}\n该笔交易查询地址：${env[CHAIN_NAME_SYMBOL].chain.blockExplorerUrls}/tx/${hash}`)
		},
		// 监听到请求接收以后，更新原生代币余额并格式化当前账户代币输出
		async _receiptListener(receipt) {
			await this.updateBalance()
			Account.formatOutput()
		}
	}
})()



/**
 * 合约代币
 */
function CToken(web3Instance, symbol) {
	return {
		// 赋值web3实例
		web3: web3Instance,
		// 合约代币简称
		symbol: symbol,
		// 合约代币精度
		decimals: '',
		// 合约代币余额
		balance: '',
		// 合约代币方法
		methods: null,
		// 合约代币初始化
		async init() {
			this._setContractMethods()
			this.decimals = Number(await this.methods.decimals().call())
			await this.updateCBalance()
		},
		// 设置智能合约代币方法
		_setContractMethods() {
			const cToken = env[CHAIN_NAME_SYMBOL][this.symbol]
			// 获取BSCTest-BNB合约转账方法
			const contractMethods = new this.web3.eth.Contract(
				cToken.abi,
				cToken.address
			).methods
			this.methods = contractMethods
		},
		// 更新智能合约代币余额
		async updateCBalance() {
			const weiBalance = await this.methods.balanceOf(Account.address).call()
			const balance = new BigNumber(weiBalance).div(new BigNumber(Math.pow(10, this.decimals))).toString()
			this.balance = balance
		},
		// 智能合约代币转账
		async cTransfer(recAccount, sendNum) {
			if (Number(sendNum) > Number(this.balance)) {
				alert('账户余额不足，无法转账')
				return false
			}
			const weiNum = new BigNumber(sendNum).times(new BigNumber(Math.pow(10, this.decimals)))
			await this.methods.transfer(recAccount, weiNum).send({ from: Account.address })
				.on('transactionHash', this._hashListener.bind(this, ...arguments))
				.on('receipt', this._receiptListener.bind(this))
				.on('error', console.error)
		},
		// 监听到transactionHash以后，输出交易hash到控制台并给出交易查询地址
		_hashListener(recAccount, sendNum, hash) {
			console.log(`交易ID：${hash}\n合约代币转移：From(${Account.address}) => To(${recAccount}) For ${sendNum} ${this.symbol}\n该笔交易查询地址：${env[CHAIN_NAME_SYMBOL].chain.blockExplorerUrls}/tx/${hash}`)
		},
		// 监听到请求接收以后，更新原生代币余额、智能合约代币余额，格式化当前账户代币输出
		async _receiptListener(receipt) {
			await this.updateCBalance()
			// 因为转账需要耗费小额的原生代币作为矿工费用，所以需要转账合约代币后需要更新原生代币余额
			await Account.updateBalance()
			Account.formatOutput()
		}
	}
}



/**
 * 识别终端类型
 */
const Terminal = (() => {
	const userAgent = window.navigator.userAgent
	return {
		// 桌面端
		isPc: window.screen.width > window.screen.height,
		// 移动端
		isMobile: /Android|iPhone|iPad/.test(userAgent) && (window.screen.width < window.screen.height),
		// 是否为Android
		isAndroid: /Android/.test(userAgent) && (window.screen.width < window.screen.height),
		// 是否为iPhone
		isIPhone: /iPhone/.test(userAgent) && (window.screen.width < window.screen.height),
		// 是否iPad
		isIPad: /iPad/.test(userAgent) && (window.screen.width < window.screen.height)
	}
})()



/**
 * 切换网络
 */
async function changeNetwork(chainNameSymbol = 'BSC') {
	// 请求
	const request = window.ethereum.request
	// 需要使用的链ID
	const targetChainId = env[chainNameSymbol].chain.chainId
	// 获取当前链ID
	const chainId = await request({ method: 'eth_chainId' })
	// 当前链ID不是目标链则弹窗提示
	if (chainId !== targetChainId) {
		if (confirm(`当前DApp只支持${env[chainNameSymbol].name}，是否切换到${env[chainNameSymbol].name}？`)) {
			try {
				// 切换到目标链
				await request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: targetChainId }]
				})
				return Promise.resolve()
			} catch (e) {
				switch (e.code) {
					case 4902:
						if (confirm(`检测到${env[chainNameSymbol].name}不存在，是否创建并切换到${env[chainNameSymbol].name}？`)) {
							try {
								// 创建目标链
								await request({
									method: "wallet_addEthereumChain",
									params: [env[chainNameSymbol].chain],
								})
							} catch (e) {
								if (e.code === -32602) {
									alert(`当前DApp只支持${env[chainNameSymbol].name}`)
								} else if (e.code === -32002) {
									alert('请求已存在，等待用户确认...')
								}
							}
						}
						break
					case -32002:
						alert('请求已存在，等待用户确认...')
						break
					default:
						;
				}
				return Promise.reject(e)
			}
		} else {
			return Promise.reject()
		}
	}
}



/**
 * 检测环境、切换到目标链（币安测试链或币安链）并连接dapp
 */
async function check() {
	if (typeof window.ethereum === 'undefined') {
		alert('请安装钱包')
		return false
	} else {
		// 使用TokenPocket钱包安卓钱包客户端
		if (window.ethereum.isTokenPocket && Terminal.isAndroid) {
			try {
				/**
				 * 此处的注释代码是使用了TP官方SDK，是TP安卓钱包APP专用，苹果APP不兼容
				 */
				// // 挂载TP钱包api，需要安装npm install tp-js-sdk
				// window.$tp = require('tp-js-sdk');

				// // 设置Dapp全屏运行
				// window.$tp.fullScreen({
				//     fullScreen: 1
				// });

				// await window.$tp.getCurrentWallet().then(res => {
				// 	if (res.data.blockchain !== 'bsc') {
				// 		throw new Error('chain not support');
				// 	}
				// });
			} catch (e) {
				alert('当前Dapp只支持币安智能链，请选择币安智能链！')
				await window.$tp.getWallet({ walletTypes: ['bsc'], switch: true }).then(res => {
					if (!res.result) {
						window.$tp.close()
					}
				})
			}
			// 使用MetaMask或TokenPocket钱包客户端
		} else if (window.ethereum.isTokenPocket || window.ethereum.isMetaMask) {
			try {
				// 切换网络
				await changeNetwork(CHAIN_NAME_SYMBOL)
				// 钱包连接dapp应用
				await window.ethereum.request({ method: 'eth_requestAccounts' })
			} catch (e) {
				if (e.code === -32002) {
					alert('请求已存在，等待用户确认...')
				}
				return false
			}
		}
	}
	return true
}



export {
	env,
	CHAIN_NAME_SYMBOL,
	Account,
	check
}