<template>
  <view>
    <NavBar title="我的团队"></NavBar>
    <view class="section">
      <view class="performance">
        <view class="headline">
          团队业绩
        </view>
        <view class="number">
          1758696.0000
        </view>
        <view class="people d-flex align-items-center justify-around">
          <view class='flex-1'>直推人数<text class="white number">100000</text></view>
          <view class='flex-1'>团队人数<text class="white number">10000</text></view>
        </view>
      </view>
      <view class="group-size">
        <view class="title">
          团队人数
        </view>
        <view class="wrapper ">
          <view class="item d-flex gary">
            <view class="first text-center">序号</view>
            <view class="second text-center">账号</view>
            <view class="thirdly text-center">个人业绩</view>
            <view class="fourthly text-right">团队业绩</view>
          </view>
          <u-list @scrolltolower="scrolltolower" height='650rpx'>
            <view class="list d-flex" v-for="(item, index) in listData" :key="index">
              <view class="first text-center">{{ index + 1 }}</view>
              <view class="second text-center">{{ item.user_id }}</view>
              <view class="thirdly text-center">{{ item.self_achievement }}</view>
              <view class="fourthly text-right">{{ item.team_achievement }}</view>
            </view>
            <!-- <u-divider :text="$t('basic.noMore')" v-if="hasMore"></u-divider> -->
          </u-list>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
const listData: any = reactive([])
function scrolltolower() {
  console.log('scrolltolower')
}
</script>

<style lang="scss" scoped>
.section {
  padding: 30rpx;

  .white {
    color: #fff;
  }

  .gary {
    color: #b3b3b3;
  }

  .performance {
    background: linear-gradient(138deg, #3A55C3 0%, #C70163 100%);
    padding: 36rpx 36rpx 40rpx;
    border-radius: 3px 3px 3px 3px;
    color: #c6d2fc;

    .headline {}

    >.number {
      color: #fff;
      font-size: 55rpx;
    }

    .people {
      margin-top: 30rpx;
      font-size: 30rpx;

      view {
        width: 50%;

        .number {
          margin-left: 10rpx;
          font-size: 35rpx;
        }
      }
    }
  }

  .group-size {
    margin-top: 60rpx;

    .title {
      font-size: 36rpx;
      margin-bottom: 30rpx;
      color: #FFFFFF;
    }

    .wrapper {
      border: 1px solid #70707030;
      padding: 40rpx;
      background-color: #ffffff10;

      .first {
        width: 10%;
      }

      .second {
        width: 35%;
      }

      .thirdly {
        width: 27%;
      }

      .fourthly {
        width: 27%;
      }

      .list {
        margin-top: 30rpx;
      }
    }
  }
}
</style>
