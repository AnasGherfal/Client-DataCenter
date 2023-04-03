import { ref, computed, reactive, onMounted, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"
import useVuelidate from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import CustomerForm from '@/components/Customers/CustomerForm.vue';
import router from '@/router';
import { useToast } from 'primevue/usetoast';


export const useCustomersStore = defineStore('customer', () => {

  const customers = ref();
  const data = ref()
  const loading = ref(false);

  const state = reactive({
    name: "" as string,
    email: "",
    primaryPhone: '',
    secondaryPhone: '',
    address: '',
    file: '',


})

function getdata(){
   axios.get("https://localhost:7003/api/Customers")
  .then(function (response) {
    customers.value = response.data.content

    console.log(customers)
  })
  .catch(function (error) {
    console.log(error)
  })
  .finally(function () {
  });

 }

  onMounted(async () => {
    await getdata();

  })



  const rules = computed(() => {
    return {
        name: { required: helpers.withMessage('الاسم مطلوب', required) },
        email: { required: helpers.withMessage('الايميل مطلوب', required), email: helpers.withMessage(' ليس عنوان بريد إلكتروني صالح', email) },
        address: { required: helpers.withMessage('العنوان مطلوب', required) },
        primaryPhone: { required: helpers.withMessage('الحقل مطلوب', required), isLibyanPhoneNumber: helpers.withMessage(' , ليس رقم ليبي صالح', isLibyanPhoneNumber) },
    }
})

function isLibyanPhoneNumber(input: string): boolean {
  const phoneRegex = /^(?:\+?218)(?:(?:91|92|94|95)\d{7})$/;
  return phoneRegex.test(input);
}
  const v$ = useVuelidate(rules, state);

  async function submitForm()  {
        const result = await v$.value.$validate();

            if (result) {
        loading.value = true;
        setTimeout(() => {

            loading.value = false;
            router.go(-1)

        }, 500);

        await axios.post("https://localhost:7003/api/Customers", state)
                .then(function (response) {
             
                  console.log(state)
                    customers.value.push(state)
                    console.log(response)
                    getdata();
                  })
                .catch(function (error) {
                    console.log(error)
                })
              } else {
                        console.log("empty")
                    }

  }



  const rotName = ref()
  const deleteCustomersDialog = ref(false)

    
  function getid(index: {}) {
    rotName.value = index;
    console.log(rotName.value.name)
    deleteCustomersDialog.value=true
}
const toast = useToast();

const deleteCustomer = () => {
console.log(rotName.value)
axios.delete('https://localhost:7003/api/Customers/'+rotName.value.id )
.then(response => {
 console.log(response)
 router.replace
 toast.add({ severity: 'success', summary: 'Confirmed', detail: response.data.msg, life: 3000 });
 deleteCustomersDialog.value = false

});

}
  


  return {  customers, state, data, submitForm, v$, loading,getdata }

})
