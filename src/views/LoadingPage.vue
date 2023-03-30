<template>
  <div class="loading-page">
    <div class="loader"></div>
  </div>
</template>

<style>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.loader {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 6px solid #3498db;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>