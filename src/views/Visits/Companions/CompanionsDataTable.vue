<script lang="ts" setup>
const props = defineProps(["compList"]);

</script>

<template>

<DataTable v-if="compList.length>0" :value="compList">
    <Column field="firstName" header="اسم المرافق"></Column>
    <Column field="lastName" header="اللقب "></Column>
    <Column field="jobTitle" header="صفة المرافق"></Column>
    <Column field="identityType" header="نوع الاثبات"> </Column>
    <Column field="identityNo" header="رقم الاثبات"></Column>
  </DataTable>
</template>