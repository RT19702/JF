<template>
  <NavBar :showLeft="false" />
  <view class="container">
    <view class="d-flex head-userinfo">
      <view class="image">
        <!-- <u-image :showLoading="true" src="" width="58px" height="58px" radius="15"></u-image> -->
      </view>
      <view class="user">
        <view class="user-name">{{ userInfo.level_name }}</view>
        <view class="user-id d-flex align-items-center">ID：{{ userInfo.user_id }} <view class="copy" @click="copy">复制
          </view>
        </view>
      </view>
    </view>
    <view class="staking-data d-flex justify-between text-center">
      <view>
        <view class="number">{{ userInfo.effective_pledge }}</view>
        <view class="text">个人</view>
        <view class="text">有效质押</view>
      </view>
      <view>
        <view class="number">{{ userInfo.zt_pledge }}</view>
        <view class="text">直推</view>
        <view class="text">有效质押</view>
      </view>
      <view>
        <view class="number">{{ userInfo.seven_pledge }}</view>
        <view class="text">下级</view>
        <view class="text">有效质押</view>
      </view>
    </view>
    <view class="balance-data">
      <view class="d-flex justify-between text-center">
        <view>
          <view class="number">{{ userInfo.MENPIAO.toFixed(2) }}</view>
          <view class="text">MENPIAO余额</view>
        </view>
        <view>
          <view class="number">{{ userInfo.HONGBAO.toFixed(2) }}</view>
          <view class="text">HONGBAO余额</view>
        </view>
        <view>
          <view class="number">{{ userInfo.LANBAO.toFixed(2) }}</view>
          <view class="text">LANBAO余额</view>
        </view>
      </view>
      <view class="button d-flex align-items-center">
        <view class="item d-flex align-items-center" @click="routeHopping('withdrawals')">
          <u-image :showLoading="true" src="@/static/image/icons/deposit.png" width="17px" height="15px"></u-image>
          <text>提现</text>
        </view>
        <view class="item d-flex align-items-center recharge" @click="routeHopping('recharge')">
          <!-- <view class="item d-flex align-items-center recharge" @click="routeHopping('recharge')"> -->
          <u-image :showLoading="true" src="@/static/image/icons/recharge.png" width="17px" height="15px"></u-image>
          <text>充值</text>
        </view>
        <view class="item d-flex align-items-center recharge" @click="routeHopping('transfer')">
          <u-image :showLoading="true" src="@/static/image/icons/transfer.png" width="17px" height="15px"></u-image>
          <text>转账</text>
        </view>
      </view>
    </view>
    <view class="details">
      <view class="tab-details d-flex align-items-center">
        <view :class="detailParames.type === 1 ? 'active' : ''" @click="toggleDetail(1)">MENPIAO明细
        </view>
        <view :class="detailParames.type === 3 ? 'active' : ''" @click="toggleDetail(3)">HONGBAO明细
        </view>
        <view :class="detailParames.type === 4 ? 'active' : ''" @click="toggleDetail(4)">LANBAO明细
        </view>
      </view>
      <view class="content">
        <u-list @scrolltolower="getCoinFlowList" height="600rpx">
          <view class="item d-flex align-items-center justify-between" v-for="item in detailParames.list" :key="item.id">
            <view>
              <view class="text">{{ item.desc }}</view>
              <view class="time">{{ item.addtime }}</view>
            </view>
            <view class="price" :style="{ color: (item.adds > 0 ? 'green' : '') || (item.reduce > 0 ? 'red' : '') }">
              <text>{{ item.adds > 0 ? '+' : '' }}{{ item.reduce > 0 ? '-' : '' }}</text>
              <text>{{ item.adds > 0 ? item.adds : item.reduce }}</text>
            </view>
          </view>
        </u-list>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getUserInfo, getCoinFlow } from "@/api"
import { reactive, onMounted, toRefs, computed, watch } from "vue"
import {
  onShow
} from "@dcloudio/uni-app"
const userInfo: any = reactive({
  user_id: "",
  level_name: "",
  effective_pledge: 0,
  zt_pledge: 0,
  seven_pledge: 0,
  MENPIAO: 0,
  HONGBAO: 0,
  LANBAO: 0
})
const copy = () => {
  uni.setClipboardData({
    data: userInfo.user_id,
    success: function () {
      uni.showToast({
        title: "复制成功",
        icon: "none"
      })
    }
  })
}
const detailParames = reactive({
  type: 1,
  page: 1,
  list: [] as any[]
})

const getUser = async () => {
  try {
    const response = await getUserInfo()
    Object.assign(userInfo, toRefs(response))
    console.log('🚀 ~ file: mine.vue:92 ~ getUser ~ userInfo:', userInfo)
  } catch (error) {
    console.error('Failed to get user info:', error)
  }
}
// 货币流水
const getCoinFlowList = async () => {
  const params = {
    type: detailParames.type,
    page: detailParames.page
  }
  try {
    const response = await getCoinFlow(params)
    if (response.list_data && response.list_data.length > 0) {
      detailParames.page++
      detailParames.list = [...detailParames.list, ...response.list_data]
    }
  } catch (error) {
    console.error('Failed to get user info:', error)
  }
}

const notYet = () => {
  uni.showToast({
    title: "暂未开放",
    icon: "none"
  })
}

const routeHopping = (type: string) => {
  uni.navigateTo({
    url: "/pages/transfer/transfer?type=" + type
  })
}

const toggleDetail = (type: number) => {
  detailParames.type = type
  detailParames.page = 1
  detailParames.list = []
  getCoinFlowList()
}

onMounted(() => {
  getCoinFlowList()
})
onShow(() => {
  getUser()
})
</script>

<style lang="scss">
.container {
  padding: 30rpx 30rpx 150rpx;
}

.head-userinfo {
  .image {
    width: 58px;
    height: 58px;
    background: linear-gradient(138deg, #3A55C3 0%, #C70163 100%);
    border-radius: 20px;
  }

  .user {
    color: #fff;
    margin-left: 20rpx;

    &-name {
      font-size: 40rpx;
      font-weight: bold;
    }

    &-id {
      margin-top: 10rpx;
      font-size: 12px;

      .copy {
        margin-left: 10rpx;
        border-radius: 2px;
        padding: 3rpx 10rpx;
        background: linear-gradient(180deg, #234ADB 0%, #4269FA 100%);
      }
    }
  }
}

.staking-data,
.balance-data {
  background: linear-gradient(138deg, #3A55C3 0%, #C70163 100%);
  padding: 40rpx 30rpx;
  border-radius: 5px 5px 0px 0px;
  color: #c4cced;
  margin-top: 40rpx;

  .number {
    color: #FFFFFF;
    font-weight: 500;
    font-size: 40rpx;
  }

  .text {
    margin-top: 10rpx;
  }
}

.balance-data {
  padding: 60rpx 30rpx;
  background: #FFFFFF10;
  position: relative;

  .text {
    font-size: 26rpx;
  }

  .button {
    position: absolute;
    bottom: -15%;
    left: 50%;
    transform: translate(-50%);
    width: max-content;

    .item {
      background: linear-gradient(180deg, #234ADB 0%, #4269FA 100%);
      border-radius: 50px;
      padding: 10rpx 40rpx;

      text {
        margin-left: 10rpx;
      }
    }

    .recharge {
      margin-left: 30rpx;
    }
  }
}

.details {
  margin-top: 90rpx;

  .tab-details {
    color: #959499;
    font-weight: bold;

    view {
      margin-right: 40rpx;
    }

    .active {
      font-size: 35rpx;
      color: #FFFFFF;
    }
  }

  .content {
    margin-top: 30rpx;
    background: #FFFFFF10;
    padding: 40rpx 30rpx;

    .item {
      padding-bottom: 30rpx;
      margin-bottom: 30rpx;
      border-bottom: 1px solid #707070;
    }

    .text {
      color: #fff;
    }

    .time {
      margin-top: 10rpx;
      color: #9c9ca0;
    }

    .price {
      font-size: 36rpx;
      font-weight: bold;
    }
  }
}
</style>