<template>
  <NavBar title="奖池" :showLeft="false" />
  <view class="container">
    <view class="item d-flex align-items-center justify-between" v-for="item in listOfPrizePools">
      <view>LV{{ item.level }}奖池</view>
      <view class="button" :class="item.nums > 0 ? 'availableForPickup' : ''"
        @click="item.nums > 0 ? availableForPickup(item) : ''">
        领取
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getLevelBonus, receiveReward } from "@/api"
import { reactive, onMounted } from 'vue'
let listOfPrizePools: any = reactive([])
const getBonusList = async () => {
  const data = await getLevelBonus()
  listOfPrizePools.push(...data)
  console.log('🚀 ~ file: draw.vue:20 ~ getBonusList ~ listOfPrizePools:', listOfPrizePools)
}
const availableForPickup = async (item: any) => {
  const params = {
    pool_id: item.id
  }
  try {
    const data = await receiveReward(params)
    uni.showToast({
      title: '领取成功',
      icon: 'none'
    })
    listOfPrizePools = []
    getBonusList()

  } catch (error) {

  }
}
onMounted(() => {
  getBonusList()
})
</script>

<style lang="scss">
.container {
  padding: 50rpx 30rpx;

  .item {
    padding: 30rpx;
    background: #FFFFFF10;
    margin-bottom: 50rpx;
    color: #fff;
    font-weight: bold;
  }

  .button {
    padding: 10rpx 20rpx;
    background: #787C8B;
  }

  .availableForPickup {
    background: linear-gradient(180deg, #234ADB 0%, #4269FA 100%);
  }
}
</style>