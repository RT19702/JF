<template>
  <NavBar title="DAPP" :showLeft="false" />
  <view class="container">
    <view class="banner">
      <u-swiper height="340rpx"></u-swiper>
    </view>
    <view class="icon-list d-flex justify-between">
      <view v-for="item in iconList">
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
          <u-input placeholder="请输入您需要质押HONGBAO的数量" border="none" color="#fff"></u-input>
        </view>
        <view class="text">本次质押需消耗：0.00MENPIAO</view>
      </view>
      <view class="button">
        <u-button text="提交" color="#3c63f4" size="large"></u-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Web3 from 'web3';
import {
  env,
  CHAIN_NAME_SYMBOL,
  check,
  Account,
} from '@/common/web3/web3API';
import { checkUser } from '@/api';
import * as auth from '@/utils/auth';

export default {
  data() {
    return {
      iconList: [
        {
          title: 'SWAP',
          image: '/static/image/icons/withdraw.png',
        },
        {
          title: '推广',
          image: '/static/image/icons/recharge.png',
        },
        {
          title: '我的团队',
          image: '/static/image/icons/promotion.png',
        },
      ],
    };
  },
  methods: {
    // web3初始化
    async init() {
      // 检测环境、切换到币安测试链并连接dapp
      if (await check()) {
        try {
          uni.showLoading({ title: '授权中...', mask: true });
          // 创建web3实例
          const web3 = new Web3((window as any).ethereum);
          await Account.init(web3);
          await Account.addCToken('USDT');
          auth.setAccount({ address: Account.address, balance: Account.cTokens['USDT'].balance });
          this.checkUser();
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
      }
    },
    // 检测用户是否授权
    async checkUser() {
      const address = auth.getAccount().address;
      if (address) {
        const params = {
          address: address,
        };
        try {
          const res = await checkUser(params);
          console.log('Response:', res);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    },
  },
  mounted() {
    this.init();
  },
};

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