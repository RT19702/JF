<template>
  <view>
    <NavBar title="质押" :showLeft="false"></NavBar>
    <view class="section">
      <view class="performance">
        <view class="headline">
          质押总额
        </view>
        <view class="number">
          {{ stakingData.total_pledge }}
        </view>
        <view class="people d-flex align-items-center justify-around">
          <view class='flex-1'>有效期总额<text class="white number">{{ stakingData.effective_pledge }}</text></view>
          <view class='flex-1 text-right'>待分红<text class="white number">{{ stakingData.pending_dividends }}</text></view>
        </view>
        <view class="people d-flex align-items-center justify-around">
          <view class='flex-1'>可撤押总额<text class="white number">{{ stakingData.kcy_yxzy }}</text></view>
          <view class='flex-1 text-right'>已分红<text class="white number">{{ stakingData.dividend_paid }}</text></view>
        </view>
      </view>
      <view class="staking-list">
        <view class="title text-center">质押列表</view>
        <view class="content">
          <view class="d-flex head">
            <view>序号</view>
            <view>质押时间</view>
            <view>质押价值</view>
            <view>是否有效</view>
          </view>
          <u-list @scrolltolower="getPledgeListMethod" height="650rpx">
            <view class="item d-flex" v-for="(item, index) in stakingList.list" :key="item.id">
              <view>{{ index + 1 }}</view>
              <view>{{ item.creat_time.substring(0, 10) }}</view>
              <view>{{ item.fgxz_val_fwdb }}</view>
              <view :style="{ color: (item.start === 1 ? '#31EC7C' : '#FF0054') }">{{ item.start === 1 ? '是' : '否' }}
              </view>
              <view @click="quash(item)">{{ item.start === 1 ? '撤销' : '' }}</view>
            </view>
          </u-list>
        </view>
      </view>
      <u-modal :show="show" title="提示" :showCancelButton="true" @cancel="show = false" @confirm="confirmQuash">
        <view class="slot-content">
          <rich-text :nodes="content"></rich-text>
        </view>
      </u-modal>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getPledge, getPledgeList, cancelPledge } from "@/api"
import { ref, onMounted, reactive } from "vue"
const stakingData = reactive({
  total_pledge: 0,
  effective_pledge: 0,
  kcy_yxzy: 0,
  pending_dividends: 0,
  dividend_paid: 0
})
const stakingList = reactive({
  page: 1,
  list: [] as any[]
})
const show = ref(false)
const content = '是否撤销质押？'
const quashId = ref(null)
const getPleadeMethod = async () => {
  const res = await getPledge()
  Object.assign(stakingData, res)
}
const getPledgeListMethod = async () => {
  const params = {
    page: stakingList.page
  }
  try {
    const res = await getPledgeList(params)
    if (res.list_data && res.list_data.length > 0) {
      stakingList.page++
      stakingList.list = stakingList.list.concat(res.list_data)
    }
  } catch (err) {
    console.log(err)
  }
}
const quash = (item: any) => {
  show.value = true
  quashId.value = item.id
}
const confirmQuash = async () => {
  const params = {
    pledge_id: quashId.value
  }
  try {
    const res = await cancelPledge(params)
    show.value = false
    stakingList.list = []
    stakingList.page = 1
    getPledgeListMethod()
  } catch (err) {
    console.log(err)
  }
}
onMounted(async () => {
  getPleadeMethod()
  getPledgeListMethod()
})
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

  .empty {
    width: 100%;
    padding: 25rpx;
    color: #c8c8ca;
  }

  .performance {
    background: linear-gradient(138deg, #3A55C3 0%, #C70163 100%);
    padding: 36rpx 36rpx 40rpx;
    border-radius: 3px 3px 3px 3px;
    color: #c6d2fc;

    .headline {}

    >.number {
      color: #fff;
      font-size: 50rpx;
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
}

.staking-list {
  margin-top: 60rpx;

  >.title {
    background: url('@/static/image/title_back.png');
    background-size: cover;
    width: 90px;
    height: 29px;
    color: #fff;
    font-size: 35rpx;
    font-weight: 400;
  }

  .content {
    margin-top: 40rpx;
    background-color: #ffffff10;
    padding: 30rpx 20rpx;

    .head {
      color: #95969e;

      view {
        &:nth-child(1) {
          width: 15%;
        }

        &:nth-child(2) {
          width: 30%;
        }

        &:nth-child(3) {
          width: 20%;
        }

        &:nth-child(4) {
          width: 20%;
        }
      }
    }

    .item {
      margin-top: 40rpx;
      color: #Fff;

      view {
        &:nth-child(1) {
          width: 15%;
        }

        &:nth-child(2) {
          width: 30%;
        }

        &:nth-child(3) {
          width: 20%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &:nth-child(4) {
          width: 20%;
          text-align: center;
        }

        &:nth-child(5) {
          width: 15%;
          color: #007BD9;
          text-align: center;
        }
      }
    }
  }
}
</style>