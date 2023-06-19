<template>
  <NavBar title="DAPP" :showLeft="false" />
  <DialogPay v-model:hasVerification="inviteParameter.hasVerification" :invite="inviteParameter.invite"
    @confirmIdentify="userConfirm" />
  <view class="container">
    <view class="banner">
      <u-swiper height="340rpx" :list="swiperList"></u-swiper>
    </view>
    <view class="icon-list d-flex justify-between">
      <view v-for="item in iconList" @click="routeEvent(item)">
        <view class="d-flex justify-center">
          <u-image :showLoading="true" :src="item.image" width="55px" height="55px"></u-image>
        </view>
        <view class="text text-center">{{ item.title }}</view>
      </view>
    </view>
    <view class="section-impawn">
      <view class="title text-center">质押</view>
      <view class="impawn">
        <view class="title">质押数量</view>
        <view class="input">
          <u-input placeholder="请输入您需要质押HONGBAO的数量" border="none" color="#fff" v-model="impawnVal"></u-input>
        </view>
        <view class="text">本次质押价值{{ ((impawnVal * systemInfo.fgxz_fwdb) * 1).toFixed(3) || 0 }}YUAN</view>
        <view class="text">本次质押需消耗：{{ ((impawnVal * systemInfo.fgxz_fwdb) * (0.15)).toFixed(3) || 0 }}MENPIAO</view>
      </view>
      <view class="button">
        <u-button text="提交" color="#3c63f4" size="large" @click="stakingSubmission"></u-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Web3 from 'web3'
import { Account } from '@/common/web3/webMethods'
import { checkUser, addUser, pledge, getConfigInfo } from '@/api'
import * as auth from '@/utils/auth'
import { ref, onMounted, reactive } from 'vue'

interface IconItem {
  title: string
  image: string
  route: string
}

interface InviteParameter {
  hasVerification: boolean
  invite: boolean
}

interface SystemInfo {
  fgxz_fwdb: number
}

const iconList: IconItem[] = reactive([
  {
    title: 'SWAP',
    image: '/static/image/withdraw.png',
    route: '',
  },
  {
    title: '推广',
    image: '/static/image/recharge.png',
    route: '/pages/invite/invite',
  },
  {
    title: '我的团队',
    image: '../../static/image/promotion.png',
    route: '/pages/team/team',
  },
])

const inviteParameter: InviteParameter = reactive({
  hasVerification: false,
  invite: true,
})

const impawnVal = ref<number | ''>('')

const swiperList = ref(['../../static/image/banner.png'])

const invitationCode = ref('')

const systemInfo: SystemInfo = reactive({
  fgxz_fwdb: 0,
})

async function init() {
  try {
    uni.showLoading({ title: '授权中...', mask: true })
    const web3 = new Web3((window as any).ethereum)
    await Account.init(web3)
    await Account.addCToken('YUAN', 'MENPIAO', 'HONGBAO', 'LANBAO')
    auth.setAccount({ address: Account.address })
    await getData()
  } catch (error) {
    console.log('🚀 ~ file: home.vue:97 ~ init ~ error:', error)
    uni.hideLoading()
    uni.showToast({
      title: '授权失败',
      icon: 'none',
    })
  }
}

async function getData() {
  const address = auth.getAccount().address
  if (address) {
    const params = {
      address: address,
    }
    try {
      const res = await checkUser(params)
      auth.setToken(res._token)
      await getSystemInfo()
    } catch (error) {
      if (invitationCode.value) {
        await userConfirm(invitationCode.value)
      } else {
        inviteParameter.hasVerification = true
      }
    }
  }
}

async function userConfirm(val: string) {
  const params = {
    address: auth.getAccount().address,
    invite_code: val,
  }
  try {
    const res = await addUser(params)
    inviteParameter.hasVerification = false
    uni.showToast({
      title: '绑定成功',
      icon: 'none',
    })
  } catch (error: any) {
    uni.showToast({
      title: error.msg,
      icon: 'none',
    })
    console.error('Error:', error)
  }
}

async function stakingSubmission() {
  const params = {
    nums: impawnVal.value,
  }
  uni.showLoading({ title: '提交中...', mask: true })
  try {
    await pledge(params)
    uni.showToast({
      title: '质押成功',
      icon: 'none',
    })
  } catch (error) {
    impawnVal.value = ''
  }
}

async function getSystemInfo() {
  const data = await getConfigInfo()
  systemInfo.fgxz_fwdb = data.fgxz_fwdb
}

function routeEvent(item: IconItem): void {
  if (item.route) {
    uni.navigateTo({
      url: item.route,
    })
  } else {
    uni.showToast({
      title: '暂未开放',
      icon: 'none',
    })
  }
}

onMounted(async () => {
  await init()
  if (window.location.search) {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const regex = /\d+/g
    const numbers = code?.match(regex)
    invitationCode.value = numbers?.[0] || ''
  }
})
</script>


<style lang="scss">
.container {
  padding: 0 30rpx;
}

.banner {
  margin-top: 30rpx;
}

.icon-list {
  color: #fff;
  margin: 60rpx 0;
  padding: 0 70rpx;

  .text {
    margin-top: 15rpx;
    font-size: 26rpx;
  }
}

.section-impawn {
  >.title {
    background: url('@/static/image/title_back.png');
    background-size: cover;
    width: 90px;
    height: 29px;
    color: #fff;
    font-size: 35rpx;
    font-weight: 400;
  }

  .impawn {
    margin-top: 30px;
    padding: 30rpx 20rpx;
    border-radius: 2px;
    background: #FFFFFF10;

    .title {
      color: #fff;
    }

    .input {
      background: #242531;
      padding: 30rpx;
      margin-top: 30rpx;
    }

    .text {
      margin-top: 20rpx;
      color: #99999f;
      font-size: 14px;
      margin-left: 30rpx;
    }
  }

  .button {
    margin-top: 60rpx;
  }
}
</style>