import { createApp,ref,computed } from 'vue'
import { createPinia } from 'pinia'
import { defineStore } from 'pinia'



export const useCounterStore = defineStore('counter', () => {


const Services =ref([
  {
    id:'U1',
    name:'استضافة مكانية (U1)',
    amountOfPower:'6امبير- 230 فولت',
    AddamountOfPower:'',
    AcpPort:'1',
    Dns:'(rDNS&DNS)1',
    monthlyVistsShare:'2',
    pricePerYear:'2000'
  },
  {
    id:'U2',
    name:'استضافة مكانية (U2)',
    amountOfPower:'10امبير- 230 فولت',
    AddamountOfPower:'',
    AcpPort:'2',
    Dns:'(rDNS&DNS)2',
    monthlyVistsShare:'2',
    pricePerYear:'3400'
  },
  {
    id:'Full Rack',
    name:' استضافة  الخزانة(Full Rack)',
    amountOfPower:'32امبير- 230 فولت',
    AddamountOfPower:'32امبير- 230 فولت',
    AcpPort:'12 منف> اضافي  12 منف> اساسي',
    Dns:'(rDNS&DNS)12',
    monthlyVistsShare:'10',
    pricePerYear:'22000'
  },
  {
    id:'Cabinet 2',
    name:'غرف مخصصة لعدد 2 Cabinet',
    amountOfPower:'28 امبير ,230 فولت رئيسية عدد 2',
    AddamountOfPower:'32امبير- 230 فولت',
    AcpPort:'',
    Dns:'(rDNS&DNS)13',
    monthlyVistsShare:'15',
    pricePerYear:'46000'
  }, 
  {
    id:'Cabinet 4',
    name:'غرف مخصصة لعدد 4 Cabinet',
    amountOfPower:'28 امبير ,230 فولت رئيسية عدد 3',
    AddamountOfPower:'32امبير- 230 فولت',
    AcpPort:'',
    Dns:'(rDNS&DNS)29',
    monthlyVistsShare:'25',
    pricePerYear:'89000',
  }
])

function deletCard(){
    Services.value.slice()
}



return{Services,deletCard}
  })
  