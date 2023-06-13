<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import "uview-plus/index.scss";
@import "@/static/css/theme.css";

page,
html,
body {
  height: 100%;
  background-image: url('./static/image/background.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #242531;
}
</style>
