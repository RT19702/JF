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
import Web3 from 'web3';
import {
  env,
  CHAIN_NAME_SYMBOL,
  check,
  Account,
} from '@/common/web3/web3API';
import { checkUser, addUser, pledge, getConfigInfo } from '@/api';
import * as auth from '@/utils/auth';
import { ref, onMounted, reactive } from 'vue'
import type { Ref } from 'vue';

const iconList = reactive([
  {
    title: 'SWAP',
    image: '../../static/image/withdraw.png',
    route: '',
  },
  {
    title: '推广',
    image: '../../static/image/recharge.png',
    route: '/pages/invite/invite',
  },
  {
    title: '我的团队',
    image: '../../static/image/promotion.png',
    route: '/pages/team/team',
  },
])
// 邀请码弹框参数
const inviteParameter = reactive({
  hasVerification: false,
  invite: true,
})
// 质押数量
const impawnVal: Ref<number | any> = ref('');

// 轮播图
const swiperList = ref([
  '../../static/image/banner.png'
])

// 邀请码
const invitationCode = ref('')

// 系统信息
const systemInfo = reactive({
  fgxz_fwdb: 0,
});

// web3初始化
async function init() {
  // 检测环境、切换到币安测试链并连接dapp
  try {
    uni.showLoading({ title: '授权中...', mask: true });
    // 创建web3实例
    const web3 = new Web3((window as any).ethereum);
    await Account.init(web3);
    await Account.addCToken('USDT');
    auth.setAccount({ address: Account.address, balance: Account.cTokens['USDT'].balance });
    getData();
  } catch (e: any) {
    console.error(e);
    switch (e.code) {
      case -32000:
        alert(`${env[CHAIN_NAME_SYMBOL].name}的JSON-RPC接口异常`);
        break;
      default:
        // 处理其他错误
        break;
    }
  }
  /* if (await check()) {
    try {
      uni.showLoading({ title: '授权中...', mask: true });
      // 创建web3实例
      const web3 = new Web3((window as any).ethereum);
      await Account.init(web3);
      await Account.addCToken('USDT');
      auth.setAccount({ address: Account.address, balance: Account.cTokens['USDT'].balance });
      getData();
    } catch (e: any) {
      console.error(e);
      switch (e.code) {
        case -32000:
          alert(`${env[CHAIN_NAME_SYMBOL].name}的JSON-RPC接口异常`);
          break;
        default:
          // 处理其他错误
          break;
      }
    }
  } */
}
// 检测用户是否授权
async function getData() {
  const address = auth.getAccount().address;
  //const address = '0x87cCF11BdE7adAb72BC92ECb8187ffe6cE8Fa012';
  if (address) {
    const params = {
      address: address,
    };
    try {
      const res = await checkUser(params);
      auth.setToken(res._token);
      getSystemInfo();
    } catch (error) {
      if (invitationCode.value) {
        userConfirm(invitationCode.value)
      } else {
        inviteParameter.hasVerification = true;
      }
    }
  }
}
// 新增用户
async function userConfirm(val: string) {
  const params = {
    address: auth.getAccount().address,
    invite_code: val,
  };
  try {
    const res = await addUser(params);
    inviteParameter.hasVerification = false;
    uni.showToast({
      title: '绑定成功',
      icon: 'none',
    });
  } catch (error: any) {
    uni.showToast({
      title: error.msg,
      icon: 'none',
    });
    console.error('Error:', error);
  }
}
// 质押提交
function stakingSubmission() {
  const params = {
    nums: impawnVal.value,
  }
  uni.showLoading({ title: '提交中...', mask: true });
  pledge(params).then(res => {
    uni.showToast({
      title: '质押成功',
      icon: 'none',
    });
  }).catch(err => {
    impawnVal.value = '';
  })
}
// 获取系统信息
async function getSystemInfo() {
  const data = await getConfigInfo();
  systemInfo.fgxz_fwdb = data.fgxz_fwdb;
}


function routeEvent(item: { route: string }): void {
  if (item.route) {
    uni.navigateTo({
      url: item.route,
    });
  } else {
    uni.showToast({
      title: '暂未开放',
      icon: 'none',
    });
  }
}

onMounted(() => {
  init();
  //getData()
  if (window.location.search) {
    // 获取页面URL参数中的代码
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    // 在代码中查找数字
    const regex = /\d+/g;
    const numbers = code?.match(regex);
    invitationCode.value = numbers[0]
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