<template>
  <view class="nav-bar">
    <view class="nav-bar-left" @click="onLeftClick">
      <slot name="left" v-if="showLeft">
        <u-icon name="arrow-left" color="#fff" size="20" bold="true"></u-icon>
      </slot>
    </view>
    <view class="nav-bar-content">
      <view class="nav-bar-title">
        {{ title }}
      </view>
    </view>
    <view class="nav-bar-right">
      <slot name="right" v-if="showRight"></slot>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  props: {
    showLeft: {
      type: Boolean,
      default: true,
    },
    showRight: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
    },
  },
  methods: {
    onLeftClick() {
      let canNavBack = getCurrentPages();
      if (canNavBack && canNavBack.length > 1) {
        uni.navigateBack();
      } else {
        history.back();
      }
    },
  },
};
</script>

<style scoped>
.nav-bar {
  /* position: fixed; */
  /* padding: 15rpx 0; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  height: 88rpx;
  margin: 0 auto;
}

.nav-bar-left,
.nav-bar-right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
}

.nav-bar-content {
  display: flex;
  flex-grow: 1;
  justify-content: center;
}

.nav-bar-title {
  font-size: 40rpx;
  /* font-weight: bold; */
  text-align: center;
  color: #ffffff;
  font-family: ZiZhiQuXiMaiTi;
}

.nav-bar-right {
  color: #fff;
}
</style>
