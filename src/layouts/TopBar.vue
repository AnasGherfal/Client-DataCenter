<script lang="ts" setup>
import IconGroup from "./TopBarIcons.vue";
import Divider from "primevue/divider";
</script>

<template>
  <div
    class="topbar scalein animation-duration-1000 fixed z-5 flex align-items-center"
    style="
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
      width: 100%;
      height: 75px;
      padding: 20px;
    "
  >
    <a href="/">
      <div>
        <img
          alt="logo"
          src="../assets/pics/LTT-logo.png "
          height="40"
          style="margin-right: 0px; --fa-animation-iteration-count: 5"
          class="logo fa-bounce"
        />
      </div>
    </a>

    <div
      style="
        font-size: 20px;
        font-weight: 800;
        width: 257px;
        height: 40px;
        margin-right: 10px;
        margin-top: -20px;
      "
    >
      <a href="/" style="text-decoration: none; color: black">
        <p>ليبيا للاتصالات والتقنية</p>
      </a>
    </div>

    <Divider layout="vertical" />

    <!-- <IconGroup style="margin-right:calc(100% - 29rem);" /> -->
    <IconGroup style="margin-right: auto" />
  </div>
</template>

<style scoped>
p {
  color: var(--primary-color);
}

@media screen and (max-width: 500px) {
  p {
    display: none;
  }
}
</style>
