import { ref, computed, reactive, onMounted, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"
import useVuelidate from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import CustomerForm from '@/components/Customers/CustomerForm.vue';
import router from '@/router';
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

  onMounted(async () => {
    await axios.get("https://localhost:7003/api/Customers")
      .then(function (response) {
        customers.value = response.data.content

        console.log(customers)
      })
      .catch(function (error) {
        console.log(error)
      })
      .finally(function () {
      });

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

            loading.value = false;
            router.go(-1)


        await axios.post("https://localhost:7003/api/Customers", state)
                .then(function (response) {
             
                  console.log(state)
                    customers.value.push(state)
                    console.log(response)    
    
                })
                .catch(function (error) {
                    console.log(error)
                }).finally(function (){
               

                })
              } else {
                        console.log("empty")
                    }

         
  }

    
  
  


  return {  customers, state, data, submitForm, v$, loading }

})
