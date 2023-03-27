<template>
    <div class="loading">
      <div class="spinner"></div>
    </div>
  </template>
  
  <style>
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    animation: spin 1s infinite linear;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>