<script setup lang="ts">
import { ref } from 'vue';
import Password from 'primevue/password';

const hello=ref()
</script>

<template>
    <!-- <div style="padding: 4rem;">
    <div style="width: 90%;
    background-color: #ffffff;
    border-radius: 1rem;
    ">
<img  src="../assets/pics/OO72AM0.jpg" style="display: inline;
 width: 50%;
 height:101%;
 border-top-right-radius: 1rem ;
 border-end-start-radius:1rem ;"/>

<div  style="display: inline-block;float: left;
padding: 0rem;
margin-left: 30px;
height: 90%;
width: 40%;
">
<img class="LTT" src="../assets/pics/LTT-logo.png" height="80"  alt="LTT">
<h2>مرحبا بك مجددا !</h2>
<p>نظام ادارة الزيارات الخاص بمركز الخدمات يرجى ادخال البريد الإلكتروني وكلمة المرور </p>
<div class="grid p-fluid ">
                        <div class="field col-12 md:col-12 lg:col-12">
<span class="p-float-label">
                        <InputText style="width: 100%; height: 40px;" id="address" type="text" v-model="hello" />
                        <label for="address">البريد الالكتروني</label>
                    </span>
</div>
<div class="field col-12 md:col-12 lg:col-12">

      <span  class="p-float-label">
      <Password v-model="hello" :feedback="false" toggleMask style="width:100%; height: 40px;"/>
      <label style="margin-right: 30px;" for="address">كلمة المرور</label> 
</span>
</div>
</div>
<Button class="p-button-primry mt-3" style="width: 100%;" label="تسجيل دخول" type="submit" :loading="loading"/>
</div>
    </div>
</div> -->

<div id="backg">
<div  class="surface-card p-4 shadow-2 border-round w-full ">

    <div class="text-center mb-5">
        <img src="../assets/pics/LTT-logo.png" alt="Image" height="90" class="mb-3">
        <div class="text-900  text-3xl font-medium mb-3">مرحبا بك مجددا !</div>
        <span class="text-600 font-medium line-height-3">نظام ادارة الزيارات الخاص بمركز الخدمات يرجى ادخال البريد الإلكتروني وكلمة المرور </span>
    </div>

    <div class="grid p-fluid ">
                        <div class="field col-12 md:col-12 lg:col-12">
<span class="p-float-label">
                        <InputText style="width: 100%; height: 40px;" id="address" type="text" v-model="hello" />
                        <label for="address">البريد الالكتروني</label>
                    </span>
</div>
<div class="field col-12 md:col-12 lg:col-12">

      <span  class="p-float-label">
      <Password v-model="hello" :feedback="false" toggleMask style="width:100%; height: 40px;"/>
      <label style="margin-right: 30px;" for="address">كلمة المرور</label> 
</span>
</div>
</div>
<Button class="p-button-primry mt-3" style="width: 100%;" label="تسجيل دخول" type="submit" :loading="loading"/>
</div>
</div>


</template>


<style scoped>
#backg{
    background: linear-gradient(45deg, hsla(204, 59%, 51%, 1) 0%, hsla(204, 100%, 91%, 1) 51%, hsla(0, 0%, 100%, 1) 100%);        padding-left:25%;
            padding-right: 25%;
            padding-top: 5%;
            padding-bottom: 5%;
}
h2{
    color: #1643a0;
    text-align: center;
    margin-bottom: 0;
    margin-top: 0;
}
p{
    color: gray;
    text-align: center;
    margin-top: 0;
    margin-bottom: 30px;
}
.p-input-icon-right > i:last-of-type {
  right: 10.8rem;
  color: black;
}
.LTT{
    width: 80px;
    margin-right: 50%;
}
</style>
<style>

</style>