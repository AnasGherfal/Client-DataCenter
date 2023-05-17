<script setup lang="ts">
import router from "@/router";

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div id="main">
    <div class="fof">
      <h1>404</h1>
      <h2>الصفحة غير موجودة!</h2>
      <h3>يبدو أن الصفحة التي تبحث عنها غير موجودة</h3>
      <Button
        class="not-found__button"
        @click="goHome"
        label="اذهب للصفحه الرئيسية"
      ></Button>
    </div>
  </div>
</template>

<style scoped>
/* Center the contents vertically and horizontally */
* {
  transition: all 0.6s;
}

html {
  height: 100%;
}

body {
  font-family: "Lato", sans-serif;
  color: #888;
  margin: 0;
}

#main {
  display: table;
  width: 100%;
  text-align: center;
}

.fof {
  display: table-cell;
  vertical-align: middle;
}

.fof h1 {
  font-size: 100px;
  display: inline-block;
  padding-right: 12px;
  animation: type 0.5s alternate infinite;
  margin-bottom: 10px;
}

.fof h2 {
  font-size: 50px;
  padding-right: 12px;
  margin-bottom: 10px;
}

.not-found__button {
  padding: 1rem 2rem;
  border-radius: 4px;
  background-color: #2255ff;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s ease-in-out;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.not-found__button:hover {
  background-color: #183fbb;
}

@keyframes type {
  from {
    box-shadow: inset -3px 0px 0px #888;
  }
  to {
    box-shadow: inset -3px 0px 0px transparent;
  }
}
</style>
