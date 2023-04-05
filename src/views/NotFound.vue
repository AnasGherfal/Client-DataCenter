<script setup lang="ts" >
import router from '@/router';


const goHome =() =>{
    router.push('/')

}

</script>


<template>
  <div class="not-found">
    <div class="not-found__wrapper">
      <h1 class="not-found__title">404</h1>
      <p class="not-found__subtitle">Oops! Page not found</p>
      <p class="not-found__message">The page you're looking for doesn't seem to exist.</p>
      <button class="not-found__button" @click="goHome">Go back to home</button>
    </div>
  </div>
  </template>
  
  
  <style scoped>
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    background-color: #f2f2f2;
  }
  
  .not-found__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    padding: 4rem;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  
  .not-found__title {
    font-size: 10rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #2b2b2b;
    letter-spacing: -10px;
  }
  
  .not-found__subtitle {
    font-size: 3rem;
    margin-bottom: 2rem;
    color: #2b2b2b;
  }
  
  .not-found__message {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #2b2b2b;
  }
  
  .not-found__button {
    padding: 1rem 2rem;
    border: none;
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
  </style>