<template>
    <div class="grid"> 
        <div  v-for="servic in store.Services"
          :key="servic.id" class="col-12 md:col-6 lg:col-4">
            <div class="bg-green-50 shadow-2 p-3 border-round">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-green-700 font-medium mb-3 font-semibold">{{ servic.name }}</span>
                        <div class="text-green-700 font-medium text-xl">{{ servic.pricePerYear }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-green-500 border-round" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-bolt text-green-50 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ servic.Dns }}</span>
                <span class="text-500">......</span>
            </div>
        </div>
        </div>
        </template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/packages'

const store = useCounterStore()

</script>