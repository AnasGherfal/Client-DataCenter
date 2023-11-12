<script lang="ts" setup>
import { useCustomersStore } from "@/stores/customers";
import { useInvoicesStore } from "@/stores/invoices";
import type { InvoiceResponde } from "@/Modules/Invoices/InvoicesRespondeModule";
import { invoiceApi } from "@/api/invoice";
import BackButton from "@/components/BackButton.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { helpers, minValue, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { subscriptionApi } from "@/api/subscriptions";
import router from "@/router";
import moment from "moment";
import { customersApi } from "@/api/customers";

const customerStore = useCustomersStore();
const invoicesStore = useInvoicesStore();
const customerselect = ref();
const loading = ref(false);
const customerSelected = ref(false); // Flag to track whether a customer is selected
const customers = ref([]);

const invoices = reactive({
  Notes: "",
  IncludeVisitsFrom: "",
  IncludeVisitsTo: "",
  CustomerId: null as any,
});

const rules = computed(() => {
  return {
    IncludeVisitsFrom: { required: helpers.withMessage("  الحقل مطلوب", required) },
    IncludeVisitsTo: {
      required: helpers.withMessage(" الحقل مطلوب", required),
      minValue: helpers.withMessage(
        "تاريخ انتهاء الزياره يجب ان يكون بعد تاريخ البدايه",
        minValue(invoices.IncludeVisitsFrom)
      ),
    },
  };
});

const v$ = useVuelidate(rules, invoices);
const toast = useToast();

const startDate = ref(new Date());
const endDate = ref(new Date());

const date = new Date(moment(invoices.IncludeVisitsFrom).format("hh:mm a"));
const minDate = ref(date);

const updateEndDate = () => {
  if (startDate.value > endDate.value) {
    endDate.value = startDate.value;
  }
};
const subscriptions = ref();
const customerSubscriptions = ref();
const filteredCustomer = ref();

onMounted(() => {
  getCustomers();
});

watch(customerselect, (value) => {
  if (value) {
    getSubscriptions(value.id);
  }
});

const submitForm = async () => {
  const result = await v$.value.$validate();

  if (result) {
    const formData = new FormData();
    formData.append("CustomerId", customerselect.value.id);
    formData.append(
      "IncludeVisitsFrom",
      moment(invoices.IncludeVisitsFrom).format("YYYY-MM-DD HH:mm:ss")
    );
    formData.append(
      "IncludeVisitsTo",
      moment(invoices.IncludeVisitsTo).format("YYYY-MM-DD HH:mm:ss")
    );
    formData.append("Notes", invoices.Notes);

    for (const [key, value] of formData.entries()) {
  console.log(`${key}: ${value}`);
}
 

    invoiceApi
      .create(formData)
      .then(function (response) {
        toast.add({
          severity: "success",
          summary: "تمت الاضافه",
          detail: response.data.msg,
          life: 3000,
        });
        router.go(-1);
      })
      .catch(function (error) {
        toast.add({
          severity: "error",
          summary: "رسالة فشل",
          detail: error.response.data.msg || "هنالك مشكلة في الوصول",
          life: 3000,
        });
      });
  } else {
    console.log("not valid");
  }
};

const resetForm = () => {
  customerselect.value = "";
  invoices.Notes = "";
  invoices.IncludeVisitsFrom = "";
  invoices.IncludeVisitsTo = "";
  invoices.CustomerId = null;
};

async function getCustomers() {
  await customersApi
    .get(1, 1000, "")
    .then(function (response) {
      customers.value = response.data.content;
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

const getSubscriptions = (id: string) => {
  subscriptionApi
    .get(1, 50, id)
    .then(function (response) {
      customerSubscriptions.value = response.data.content;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const search = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCustomer.value = [...customers.value];
    } else {
      filteredCustomer.value = customers.value.filter(
        (users: { name: String }) => {
          return users.name.toLowerCase().startsWith(event.query.toLowerCase());
        }
      );
    }
  }, 250);
};
</script>

<template>
  <div>
    <Card>
      <template #title>
        إضافة فاتورة
        <BackButton style="float: left" />

        <Divider layout="horizontal" />
      </template>

      <template #content>
        <form @submit.prevent="submitForm">
          <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <AutoComplete
                  v-model="customerselect"
                  optionLabel="name"
                  :suggestions="filteredCustomer"
                  @complete="search"
                />
                <label for="customerName">العملاء</label>
                <!-- <div style="height: 2px">
                  <error
                    v-for="error in v$.customerId.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
                  >
                </div> -->
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Calendar
                  inputId="startDate"
                  v-model="invoices.IncludeVisitsFrom"
                  dateFormat="yy/mm/dd"
                  selectionMode="single"
                  :showButtonBar="true"
                  :manualInput="false"
                  @change="updateEndDate"
                />
                <label for="startDate">تاريخ بداية </label>
                <div style="height: 2px">
                  <span
                    v-for="error in v$.IncludeVisitsFrom.$errors"
                    :key="error.$uid"
                    style="color: red; font-weight: bold; font-size: small"
                  >
                    {{ error.$message }}</span
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Calendar
                  inputId="endDate"
                  v-model="invoices.IncludeVisitsTo"
                  dateFormat="yy/mm/dd"
                  selectionMode="single"
                  :minDate="startDate"
                  :showButtonBar="true"
                  :manualInput="false"
                />
                <label for="endtDate">تاريخ انتهاء </label>
                <div style="height: 2px">
                  <span
                    v-for="error in v$.IncludeVisitsTo.$errors"
                    :key="error.$uid"
                    style="color: red; font-weight: bold; font-size: small"
                  >
                    {{ error.$message }}</span
                  >
                </div>
              </span>
            </div>
      

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Textarea v-model="invoices.Notes" rows="5" cols="77" />
                <label for="notes"> التفاصيل</label>
              </span>
            </div>
          </div>
          <Button
          @click="submitForm"
            class="p-button-primry"
            icon="fa-solid fa-plus"
            label="إضافة"
            type="submit"
            :loading="loading"
          />
          <Button
            @click="resetForm"
            icon="fa-solid fa-delete-left"
            label="مسح"
            class="p-button-danger"
            style="margin-right: 0.5em"
          />
          <Toast position="bottom-right" />
        </form>
      </template>
    </Card>
  </div>
</template>
