<template>
  <NavBar :title="typeTitle"></NavBar>
  <view class="container">
    <!-- 转账 -->
    <view v-if="type === 'transfer'">
      <view class="item d-flex justify-between">
        <view>转账类型</view>
        <view class="d-flex align-items-center" @click="transferShow = true">
          <text class="priamry-color">{{ transferType }}</text>
          <text><u-icon name="arrow-right" color="#fff"></u-icon></text>
        </view>
      </view>
      <view class="item d-flex justify-between">
        <view>对方账号</view>
        <view>
          <u-input placeholder="请输入" border="none" inputAlign="right" color="#fff" v-model="account"></u-input>
        </view>
      </view>
      <view class="item">
        <!-- <text class="balance">{{ transferType }}余额：100.00</text> -->
        <view>转账数量</view>
        <view class="input">
          <u-input placeholder="请输入" border="none" color="#fff" v-model="amount"></u-input>
        </view>
      </view>
    </view>
    <!-- 提现 -->
    <view v-else-if="type === 'withdrawals'">
      <view class="item">
        <view class="d-flex justify-between">
          <view>提币类型</view>
          <view class="d-flex align-items-center" @click="transferShow = true">
            <text class="priamry-color">{{ transferType }}</text>
            <text><u-icon name="arrow-right" color="#fff"></u-icon></text>
          </view>
        </view>
        <view class="input">
          <u-input placeholder="请输入" border="none" color="#fff" v-model="amount"></u-input>
        </view>
      </view>
    </view>
    <!-- 充值 -->
    <view v-else>
      <view class="item">
        <view class="d-flex justify-between">
          <view>充值类型</view>
          <view class="d-flex align-items-center" @click="transferShow = true">
            <text class="priamry-color">{{ transferType }}</text>
            <text><u-icon name="arrow-right" color="#fff"></u-icon></text>
          </view>
        </view>
        <view class="input">
          <u-input placeholder="请输入" border="none" color="#fff" v-model="amount"></u-input>
        </view>
      </view>
    </view>
    <!-- 兌換 -->
    <view class="submit">
      <u-button text="提交" color="linear-gradient(315deg, #234ADB 0%, #4269FA 100%)" size="large" @click="submitConfirm"
        throttleTime="1500"></u-button>
    </view>
    <u-picker :show="transferShow" :columns="columns" @confirm="confirmType" @cancel="transferShow = false"></u-picker>
  </view>
</template>

<script lang="ts">
import { transfer, withdraw, rechargeCallBack, rechargePay } from "@/api"
import { onLoad } from "@dcloudio/uni-app"
import { reactive, ref, toRefs, computed } from "vue"
import { Account } from '@/common/web3/webMethods'
import Contracts from "@/web3.confing"

interface TransactionInformation {
  amount: string
  account: string
}

interface AnyObject {
  [key: string]: any
}

export default {
  setup() {
    const type = ref<string | null>(null)
    const redemptionType = ref(1)
    const transferType = ref<string>('MENPIAO')
    const transactionInformation = reactive<TransactionInformation>({
      amount: '',
      account: ''
    })
    const transferShow = ref<boolean>(false)
    const typeTitle = computed(() => {
      switch (type.value) {
        case 'transfer':
          return '转账'
        case 'withdrawals':
          return '提现'
        case 'recharge':
          return '充值'
        default:
          return ''
      }
    })
    const columns = [
      ['MENPIAO', 'HONGBAO', 'LANBAO']
    ]
    const confirmType = (e: { value: string[] }) => {
      transferType.value = e.value[0]
      transferShow.value = false
    }
    const submitConfirm = () => {
      switch (type.value) {
        case 'transfer':
          userTransfers()
          break
        case 'withdrawals':
          withdrawals()
          break
        case 'recharge':
          recharge()
          break
        default:
          break
      }
    }
    const userTransfers = () => {
      const { amount, account } = transactionInformation
      const params = {
        other_user: account,
        type: transferType.value,
        amount
      }
      transfer(params)
        .then(() => {
          transactionInformation.amount = ''
          transactionInformation.account = ''
          uni.showToast({
            title: '转账成功',
            icon: 'none'
          })
        })
        .catch(err => {
          console.log('🚀 ~ file: transfer.vue:145 ~ userTransfers ~ err:', err)
        })
    }
    const withdrawals = () => {
      const { amount } = transactionInformation
      const params = {
        amount,
        type: transferType.value,
      }
      withdraw(params).then(() => {
        transactionInformation.amount = ''
        uni.showToast({
          title: '提现成功',
          icon: 'none'
        })
      })
    }
    const recharge = () => {
      const { amount } = transactionInformation
      const params = {
        amount,
        type: transferType.value,
      }
      rechargePay(params).then(respone => {
        const { order_sn } = respone
        uni.showLoading({
          title: '交易中',
          mask: true
        })
        try {
          Account.cTokens[transferType.value].cTransfer(Contracts.DEPOSIT, amount, (hash: string) => {
            const params = {
              order_sn,
              hash
            }
            rechargeCallBack(params).then(() => {
              transactionInformation.amount = ''
              uni.showToast({
                title: '充值成功',
                icon: 'none'
              })
            })
          })
        } catch (error) {
          uni.showToast({
            title: '交易失败',
            icon: 'none'
          })
        }
      })
    }
    onLoad((query?: AnyObject) => {
      type.value = query?.type
    })
    return {
      ...toRefs(transactionInformation),
      type,
      typeTitle,
      redemptionType,
      transferType,
      transferShow,
      columns,
      confirmType,
      submitConfirm
    }
  }
}
</script>


<style lang="scss">
.priamry-color {
  color: #31EC7C;
}

.container {
  padding: 60rpx 25rpx;

  .item {
    padding: 30rpx 20rpx;
    color: #FFFFFF;
    background-color: #ffffff20;
    margin-bottom: 30rpx;

    .round-box {
      font-size: 12px;

      .round {
        width: 30rpx;
        height: 30rpx;
        border-radius: 50%;
        border: 1px solid #aea2b4;
        position: relative;
      }

      .text {
        margin-left: 10rpx;
      }

      >view {
        &:nth-child(2) {
          margin-left: 10rpx;
        }
      }

      .active {
        color: #31EC7C;

        .round {
          border: 1px solid #31EC7C;

          &::after {
            position: absolute;
            width: 12rpx;
            height: 12rpx;
            border-radius: 50%;
            background-color: #31EC7C;
            content: '';
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }

    .balance {
      font-size: 12px;
      margin-left: 30rpx;
      color: #31EC7C;
    }

    .input {
      margin-top: 25rpx;
    }
  }

  .premium {
    color: #cdcdcd;
    font-size: 14px;
    margin-left: 20rpx;
  }

  .submit {
    margin-top: 90rpx;
  }
}
</style>