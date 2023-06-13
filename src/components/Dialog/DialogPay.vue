<template>
  <view class="dialog-content" v-if="hasVerification">
    <view class="dialog-mask">
      <view class="dialog-bg-box d-flex flex-cloumn justify-between">
        <view class="">
          <view class="title text-center">
            <slot name="title">邀请码</slot>
          </view>
          <view class="inner-box" @click="showkeyboard = true">
            <view class="text-center fill-in">
              <slot name="main-title">请先填写您邀请人的ID号</slot>
            </view>
            <view v-if="invite" class="d-flex align-items-center justify-around sole">
              <view v-for="index of 6" :key="index" class="item d-flex align-items-center justify-center">
                <view class="dialog-input" readonly="readonly">
                  <!-- {{ index }} -->
                  {{ value[index - 1] }}
                </view>
              </view>
              <view class="identify">
                <u-input placeholder="请输入内容" border="surround" v-model="value" maxlength=6 :disabled="true"></u-input>
              </view>
            </view>
            <view v-else>
              <slot name='content'></slot>
            </view>
          </view>
        </view>
        <view class="d-flex align-content-center justify-around button">
          <view class="cancel d-flex align-content-center justify-center" @click="$emit('update:hasVerification', false)">
            取消
          </view>
          <view class="confirm d-flex align-content-center justify-center" @click="confirmIdentify">确定</view>
        </view>
      </view>
    </view>
    <u-keyboard mode="number" :dotDisabled="true" :show="showkeyboard" :showTips="false" :overlay="false"
      @cancel="showkeyboard = false" @change="valChange" @confirm="confirmIdentify" @backspace="backIdentify">
    </u-keyboard>
  </view>
</template>

<script lang="ts">
export default {
  props: {
    hasVerification: {
      type: Boolean,
      default: false
    },
    invite: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      // invitationCode: '',
      modalInput: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: ''
      }, // 密码键盘
      showkeyboard: false,
      value: ''
    }
  },
  methods: {
    // 按键被点击(点击退格键不会触发此事件)
    valChange(val: string) {
      // 将每次按键的值拼接到value变量中，注意+=写法
      this.value.length < 6 ? this.value += val : ''
    },
    confirmIdentify() {
      this.value.length == 6 ? this.$emit("confirmIdentify", this.value) : ''
      // this.$emit("confirmIdentify")
    },
    backIdentify() {
      if (this.value.length) {
        this.value = this.value.slice(0, -1);
      }
      console.log(this.value, "this.value")
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  .dialog-mask {
    position: fixed;
    z-index: 99;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);

    .dialog-bg-box {
      background: url('@/static/image/background.png');
      background-size: cover;
      width: 90vw;
      height: 33vh;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      .title {
        color: #FFFFFF;
        font-size: 60rpx;
        font-weight: bold;
        text-shadow: 0px 3px 0px #144196;
        margin-top: 40rpx;
        letter-spacing: 20rpx;
        font-family: Alimama ShuHeiTi-Bold, Alimama ShuHeiTi;
      }

      .inner-box {
        padding: 0 30rpx;

        .fill-in {
          color: #f9fbfe;
          font-size: 40rpx;
          margin-top: 20rpx;
          letter-spacing: 5rpx;
          margin-bottom: 30rpx;
        }

        .item {
          // background: linear-gradient(360deg, #FEFCFD 0%, #F3E0D2 100%);
          // box-shadow: -4px 4px 11px 1px rgba(19, 58, 182, 1);
          border-radius: 9px 9px 9px 9px;
          background: linear-gradient(360deg, #FEFCFD 0%, #F3E0D2 100%);
          // box-shadow: -4px 4px 11px 1px rgba(203, 129, 16, 1);
          width: 11vw;
          height: 11vw;
          font-size: 40rpx;
        }


      }

      .button {
        margin-bottom: 30rpx;
        padding: 0 20rpx;
        color: #1249BB;

        view {
          width: 250rpx;
          // width: 48%;
          // background: linear-gradient(360deg, #C7EAFF 0%, #EEF8FF 100%);
          height: 80rpx;
          color: #fff;
          // box-shadow: 0px 3px 0px 1px rgba(125, 172, 249, 1);
          border-radius: 11px 11px 11px 11px;
        }

        .cancel {
          // box-shadow: 0px 3px 0px 1px rgba(203, 129, 16, 1);
          color: #1249BB;
          // background: linear-gradient(326deg, #D7AE73 0%, #DBC395 100%);
          opacity: 0.8;
          background: linear-gradient(360deg, #C7EAFF 0%, #EEF8FF 100%);
        }

        .confirm {
          border-radius: 11px 11px 11px 11px;
          // box-shadow: 0px 3px 0px 1px rgba(203, 129, 16, 1);
          color: #1249BB;
          // background: linear-gradient(360deg, #DABF8F 0%, #C5780E 100%);
          background: linear-gradient(360deg, #C7EAFF 0%, #EEF8FF 100%);
        }
      }

      .sole {
        position: relative;

        .identify {
          position: absolute;
          width: 100%;
          opacity: 0;
        }
      }

    }
  }
}
</style>
