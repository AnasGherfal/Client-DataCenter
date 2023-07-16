<script lang="ts" setup>
import { useCustomersStore } from "@/stores/customers";
import { useInvoicesStore } from "@/stores/invoices";
import type { InvoiceResponde } from "@/Modules/Invoices/InvoicesRespondeModule";
import { invoiceApi } from "@/api/invoice";
import BackButton from "@/components/BackButton.vue";
import { computed, reactive, ref, watch } from "vue";
import { helpers, minValue, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { subscriptionApi } from "@/api/subscriptions";

const customerStore = useCustomersStore();
const invoicesStore = useInvoicesStore();
const customerselect = ref();
const loading = ref(false);
const minDate = ref(new Date());

const invoices: InvoiceResponde = reactive({
  date: "2023-06-11T09:12:09.303Z",
  description: "",
  invoiceNo: "",
  startDate: "",
  endDate: "",
  subscriptionId: 0,
});

const rules = computed(() => {
  return {
    subscriptionId: { required: helpers.withMessage(" الحقل مطلوب", required) },
    startDate: { required: helpers.withMessage("  الحقل مطلوب", required) },
    endDate: {
      required: helpers.withMessage(" الحقل مطلوب", required),
      minValue: helpers.withMessage(
        "تاريخ انتهاء الزياره يجب ان يكون بعد تاريخ البدايه",
        minValue(invoices.startDate)
      ),
    },
    description: {
      required: helpers.withMessage("  الحقل مطلوب", required),
    },
  };
});

const v$ = useVuelidate(rules, invoices);
const toast = useToast();

const subscriptions = ref();
const customerSubscriptions = ref();
const filteredCustomer = ref();

watch(customerselect, async (newValue) => {
  if (newValue) {
    try {
      loading.value = true;

      const subscriptionResponse = await subscriptionApi.get();
      subscriptions.value = subscriptionResponse.data.content.filter(
        (subscription: any) => subscription.customerName === newValue.name
      );
      customerSubscriptions.value = subscriptions.value;
      loading.value = false;
    } catch (error) {
      console.error("Error fetching subs:", error);
    }
  }
});

const search = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCustomer.value = [...customerStore.customers];
    } else {
      filteredCustomer.value = customerStore.customers.filter(
        (users: { name: String }) => {
          return users.name.toLowerCase().startsWith(event.query.toLowerCase());
        }
      );
    }
  }, 250);
};

const submitForm = async () => {
  const result = await v$.value.$validate();

  if (result) {
    // Extract subscription IDs
    const subscriptionIds = subscriptions.value.map((sub: any) => sub.id);
    // Modify the visit object to include only the subscription IDs
    const subscriptionId =
      subscriptionIds.length > 0 ? subscriptionIds[0] : null; // Take the first subscription ID from the array

    const data = reactive({
      date: "2023-06-11T09:12:09.303Z",
      startDate: invoices.startDate,
      endDate: invoices.endDate,
      description: invoices.description,
      subscriptionId: subscriptionId,
      invoiceNo: invoices.invoiceNo,
    });

    console.log(data)
    invoiceApi
      .create(data)
      .then(function (response) {
        toast.add({
          severity: "success",
          summary: "تمت الاضافه",
          detail: response.data.msg,
          life: 3000,
        });
        console.log(data)


        console.log(response);
        invoicesStore.getInvoices();
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    console.log("not valid");
  }
};

const resetForm = () => {
  customerselect.value = "";
  invoices.description = "";
  invoices.startDate = "";
  invoices.endDate = "";
  invoices.subscriptionId = 0;
  invoices.invoiceNo = "";
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
                  v-model="invoices.startDate"
                  dateFormat="yy/mm/dd"
                  selectionMode="single"
                  :showButtonBar="true"
                  :manualInput="false"
                />
                <label for="startDate">تاريخ بداية الاشتراك</label>
                <div style="height: 2px">
                  <error
                    v-for="error in v$.startDate.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Calendar
                  inputId="endDate"
                  v-model="invoices.endDate"
                  dateFormat="yy/mm/dd"
                  selectionMode="single"
                  :minDate="invoices.startDate"
                  :showButtonBar="true"
                  :manualInput="false"
                />
                <label for="endtDate">تاريخ انتهاء الاشتراك</label>
                <div style="height: 2px">
                  <error
                    v-for="error in v$.endDate.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
                  >
                </div>
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <MultiSelect
                  id="subscriptionType"
                  v-model="invoices.subscriptionId"
                  :options="customerSubscriptions"
                  optionLabel="serviceName"
                  placeholder="اختر الاشتراك"
                  emptyMessage="هاذا العميل ليس لديه اشتراكات"
                  :selectionLimit="1"

                />
                <label for="subscriptionType">اشتراكات</label>
                <div style="height: 2px">
                  <error
                    v-for="error in v$.subscriptionId.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <InputText v-model="invoices.invoiceNo" rows="5" cols="77" />
                <label for="notes"> invoiceNo</label>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Textarea v-model="invoices.description" rows="5" cols="77" />
                <label for="notes"> التفاصيل</label>
              </span>
            </div>
          </div>
          <Button
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
