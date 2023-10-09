<script setup lang="ts">
import {
  computed,
  reactive,
  ref,
  type PropType,
  onUnmounted,
  watch,
  onMounted,
  onBeforeUnmount,
  toRefs,
} from "vue";
import { useToast } from "primevue/usetoast";
import BackButton from "@/components/BackButton.vue";
import { email, helpers, minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { isLibyanPhoneNumber, validateText } from "@/tools/validations";
import { useCustomersStore } from "@/stores/customers";
import { customersApi } from "@/api/customers";
import DeleteCustomer from "../../../components/DeleteButton.vue";

const actEdit = ref(true);
const loading = ref(false);
const store = useCustomersStore();
const props = defineProps<{ customer: any }>();
const emit = defineEmits(["getCustomers"]);
const hide1 = ref(false);
const hide2 = ref(false);
const screenWidth = ref(window.innerWidth);
const koko = ref("koko");

console.log("props.customer", props.customer);


const customer = reactive({
  id: props.customer.id,
  name: props.customer.name,
  email: props.customer.email,
  primaryPhone: props.customer.primaryPhone,
  secondaryPhone: props.customer.secondaryPhone,
  address: props.customer.address,
  status: props.customer.status,
  files: [
    {
      docType: props.customer.files[0]?.fileType,
      file: props.customer.files[0]?.fileName ||  props.customer.files[0]?.id,
      id: props.customer.files[0]?.id,
    },
    {
      docType: props.customer.files[1]?.fileType,
      file: props.customer.files[1]?.fileName ||  props.customer.files[1]?.id,
      id: props.customer.files[1]?.id,
    },
  ],
  subsicrptions: [],
});

const toast = useToast();

const docTypes = [
  { value: "1", text: "بطاقة شخصية" },
  { value: "2", text: "رخصة من الشركة" },
];

onMounted(() => {
  // if (props.customer.files[1]?.docType) {
  //   customer.files[1].docType = props.customer.files[1].docType;
  // }
});
// Function to handle file upload

const triggerFileInput = (index: any) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf, .doc, .docx, .jpg, .jpeg, .png";
  input.addEventListener("change", (event) => handleFileChange(event, index));
  input.click();
};

const handleFileChange = (event: any, index: any) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    // customer.files[index].file = selectedFile.name;
    customer.files[index].file = selectedFile; // Store the file object
    if (selectedFile) {
      customer.files[index].file = selectedFile;
      hide1.value = index === 0; // Only set hide1 if the first file was selected
      hide2.value = index === 1; // Only set hide2 if the second file was selected
    }
  }
};

const displayedFileName = computed(() => {
  return customer.files.map((file) =>
    file.file ? file.file.name : "No file selected"
  );
});

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", updateScreenWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScreenWidth);
});

watch(
  () => customer.files,
  (newFiles) => {
    for (let i = 0; i < newFiles.length; i++) {
      displayedFileName.value[i] = newFiles[i].file
        ? newFiles[i].file.name
        : "No file selected";
    }
  }
);
const onFormSubmit = async () => {
  const result = await v$.value.$validate();

  const formData = new FormData();

  formData.append("name", customer.name);
  formData.append("email", customer.email);
  formData.append("primaryPhone", customer.primaryPhone);
  formData.append("secondaryPhone", customer.secondaryPhone);
  formData.append("address", customer.address);
  formData.append("status", customer.status);
  // Append the first file as FormFile
  if (customer.files[0].file instanceof File) {
    formData.append(
      "FirstFile.File",
      customer.files[0].file,
      customer.files[0].file.name
    );
    formData.append("FirstFile.DocType", customer.files[0].docType.toString());
  }

  // Append the second file if needed
  if (customer.files[1] && customer.files[1].file instanceof File) {
    formData.append(
      "SecondFile.File",
      customer.files[1].file,
      customer.files[1].file.name
    );
    formData.append("SecondFile.DocType", customer.files[1].docType.toString());
  }

  // formData.append("subsicrptions", customer.subsicrptions);

  const formDataObject: { [key: string]: string } = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value.toString();
  });

  console.log("formData:", formDataObject);
  if (result) {
    customersApi
      .edit(props.customer.id, formData)
      .then((response) => {
        toast.add({
          severity: "success",
          summary: "رسالة تأكيد",
          detail: response.data.msg,
          life: 3000,
        });
        actEdit.value = true;
        emit("getCustomers");
      })
      .catch(() => {
        toast.add({
          severity: "error",
          summary: "خطأ",
          detail: "",
          life: 3000,
        });
      });
  } else {
    toast.add({
      severity: "error",
      summary: "رسالة خطأ",
      detail: "يرجى تعبئة الحقول",
      life: 3000,
    });
  }
};

const isDisabled = ref(true);
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("الحقل مطلوب", required),
      validateText: helpers.withMessage(
        ", حروف عربيه او انجليزيه فقط",
        validateText
      ),
      minLength: helpers.withMessage(
        "يجب أن يحتوي على الأقل 3 أحرف",
        minLength(3)
      ),
    },
    email: {
      required: helpers.withMessage("الحقل مطلوب", required),
      email: helpers.withMessage(" ليس عنوان بريد إلكتروني صالح", email),
    },
    address: { required: helpers.withMessage("الحقل مطلوب", required) },
    primaryPhone: {
      required: helpers.withMessage("الحقل مطلوب", required),
      isLibyanPhoneNumber: helpers.withMessage(
        " , ليس رقم ليبي صالح",
        isLibyanPhoneNumber
      ),
    },
  };
});
const v$ = useVuelidate(rules, customer);

const fileUrl = ref<string | null>(null);

const downloadFile = async (id: any, fileId: string) => {
  try {
    const response = await customersApi.getDocument(id, fileId);

    if (response) {
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "downloaded_file.png"; // Set the desired downloaded filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } else {
      console.error("Invalid file response");
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "حدث خطأ أثناء تحميل الملف",
      life: 3000,
    });
  }
};
</script>

<template>
  <div>
    <Card>
      <template #title>
        البيانات الشخصية

        <BackButton style="float: left" />

        <div v-if="customer.status === 5">
          <div class="warning-message">
            <div class="warning-message-icon"></div>
            <div class="warning-message-text">
              هاذا العميل في حالة قفل لا يمكن التعديل او اضافة مخوليين
            </div>
          </div>
        </div>

        <span
          v-else-if="customer.status !== 5"
          style="width: 30px; height: 30px; margin-right: 10px; margin-top: 0px"
        >
          <Button
            @click="actEdit = !actEdit"
            icon=" fa-solid fa-pen"
            text
            rounded
            class="p-button-primary p-button-text"
            v-tooltip.top="{
              value: 'تعديل البيانات الشخصية',
              fitContent: true,
            }"
          />

          <!-- <DeleteCustomer
            :name="props.customer.name"
            :id="props.customer.id"
          ></DeleteCustomer> -->
        </span>
        <Divider />
      </template>
      <template #content>
        <div v-if="loading">
          <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Skeleton
                  :loading="loading"
                  width="100%"
                  height="2rem"
                ></Skeleton>
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Skeleton
                  :loading="loading"
                  width="100%"
                  height="2rem"
                ></Skeleton>
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Skeleton
                  :loading="loading"
                  width="100%"
                  height="2rem"
                ></Skeleton>
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Skeleton
                  :loading="loading"
                  width="100%"
                  height="2rem"
                ></Skeleton>
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Skeleton
                  :loading="loading"
                  width="100%"
                  height="2rem"
                ></Skeleton>
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <Skeleton
                :loading="loading"
                width="100%"
                height="2rem"
              ></Skeleton>
            </div>
          </div>
        </div>
        <div v-else>
          <div>
            <form @submit.prevent="onFormSubmit" :disabled="actEdit">
              <div class="grid p-fluid">
                <div class="field col-12 md:col-6 lg:col-4">
                  <span class="p-float-label">
                    <InputText
                      id="name"
                      type="text"
                      v-model="customer.name"
                      :disabled="actEdit"
                    />
                    <div style="height: 10px">
                      <span
                        v-for="error in v$.name.$errors"
                        :key="error.$uid"
                        style="color: red; font-weight: bold; font-size: small"
                      >
                        {{ error.$message }}</span
                      >
                    </div>

                    <label for="name">اسم </label>
                  </span>
                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                  <span class="p-float-label">
                    <InputText
                      id="email"
                      type="text"
                      v-model="customer.email"
                      :disabled="actEdit"
                    />
                    <label for="email">البريد الإلكتروني</label>
                    <div style="height: 10px">
                      <span
                        v-for="error in v$.email.$errors"
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
                    <InputText
                      id="address"
                      type="text"
                      v-model="customer.address"
                      :disabled="actEdit"
                    />
                    <label for="address">العنوان</label>
                    <div style="height: 10px">
                      <span
                        v-for="error in v$.address.$errors"
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
                    <InputMask
                      id="phoneNum1"
                      v-model="customer.primaryPhone"
                      mask="+218999999999"
                      style="direction: ltr; text-align: end"
                      :disabled="actEdit"
                    />
                    <label for="phoneNum1">رقم هاتف 1</label>
                    <div style="height: 10px">
                      <span
                        v-for="error in v$.primaryPhone.$errors"
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
                    <InputMask
                      id="secondaryPhone"
                      v-model="customer.secondaryPhone"
                      mask="+218999999999"
                      style="direction: ltr; text-align: end"
                      :disabled="actEdit"
                    />
                    <label for="secondaryPhone">رقم هاتف 2</label>
                  </span>
                </div>
              </div>
              <div for="files" style="margin-bottom: 2rem">الملفات</div>
              <div class="grid p-fluid">
                <div class="field col-4 md:col-4 lg:col-4">
                  <span class="p-float-label">
                    <InputText
                      v-if="!hide1"
                      class="p-inputtext p-component"
                      v-model="customer.files[0].file"
                      :disabled="true"
                    />

                    <InputText
                      v-else
                      class="p-inputtext p-component"
                      v-model="customer.files[0].file"
                      :value="displayedFileName[0]"
                      :disabled="true"
                    />
                    <label for="secondaryPhone">تعريف شخصي</label>
                  </span>
                </div>

                <div
                  class="file-actions field col-4 md:col-4 lg:col-4"
                  v-if="screenWidth >= 768"
                >
                  <Button
                    @click="downloadFile(customer.id, customer.files[0].id)"
                    icon="fa-solid fa-download"
                    class="p-button-text p-button-info"
                  >
                    تحميل
                  </Button>

                  <Button
                    v-if="!actEdit"
                    icon="fa-solid fa-upload"
                    class="p-button-text p-button-info -2"
                    @click="triggerFileInput(0)"
                  >
                    رفع ملف
                  </Button>
                </div>

                <div
                  class="file-actions inline-block field col-4 md:col-4 lg:col-4"
                  v-else
                >
                  <Button
                    @click="downloadFile(customer.id, customer.files[0].id)"
                    icon="fa-solid fa-download"
                    class="p-button-icon-only p-button-info"
                    text
                    v-tooltip.top="{
                      value: 'تحميل',
                      fitContent: true,
                    }"
                  />

                  <Button
                    v-if="!actEdit"
                    icon="fa-solid fa-upload"
                    class="p-button-icon-only p-button-info"
                    text
                    @click="triggerFileInput(0)"
                    v-tooltip.top="{
                      value: 'رفع ملف',
                      fitContent: true,
                    }"
                  >
                  </Button>
                </div>
              </div>
              <div class="grid p-fluid">
                <div class="field col-4 md:col-4 lg:col-4">
                  <span class="p-float-label">
                    <InputText
                      v-if="!hide2"
                      class="p-inputtext p-component"
                      v-model="customer.files[1].file"
                      :disabled="true"
                    />

                    <InputText
                      v-else
                      class="p-inputtext p-component"
                      v-model="customer.files[1].file"
                      :value="displayedFileName[1]"
                      :disabled="true"
                    />
                    <label for="fileName">تخويل من الشركة</label>
                  </span>
                </div>

                <div
                  class="file-actions field col-4 md:col-4 lg:col-4"
                  v-if="screenWidth >= 768"
                >
                  <Button
                    @click="downloadFile(customer.id, customer.files[1].id)"
                    icon="fa-solid fa-download"
                    class="p-button-text p-button-info"
                  >
                    تحميل
                  </Button>

                  <Button
                    v-if="!actEdit"
                    icon="fa-solid fa-upload"
                    class="p-button-text p-button-info -2"
                    @click="triggerFileInput(1)"
                  >
                    رفع ملف
                  </Button>
                </div>
                <div
                  class="file-actions inline-block field col-4 md:col-4 lg:col-4"
                  v-else
                >
                  <Button
                    @click="downloadFile(customer.id, customer.files[1].id)"
                    icon="fa-solid fa-download"
                    class="p-button-icon-only p-button-info"
                    text
                    v-tooltip.top="{
                      value: 'تحميل',
                      fitContent: true,
                    }"
                  />

                  <Button
                    v-if="!actEdit"
                    icon="fa-solid fa-upload"
                    class="p-button-icon-only p-button-info"
                    text
                    @click="triggerFileInput(1)"
                    v-tooltip.top="{
                      value: 'رفع ملف',
                      fitContent: true,
                    }"
                  >
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div v-if="!actEdit">
            <Button
              @click="onFormSubmit"
              icon="fa-solid fa-check"
              label="تعديل"
            />
            <Button
              @click="actEdit = !actEdit"
              icon="fa-solid fa-ban"
              label="إلغاء التعديل"
              class="p-button-danger"
              style="margin-right: 0.5em"
            />
          </div>
          <Toast position="bottom-left" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.file-input {
  display: flex;
  align-items: center;
  width: 100%;
}
/* Style the file info section */
.file-info {
  flex: 1;
  display: flex;
  align-items: center;
}

/* Style the file actions section */
.file-actions {
  display: flex;
  gap: 0.5rem;
}

/* Adjust the styling of the download and view buttons */
.p-button-text {
  background-color: transparent;
  border: none;
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  padding: 0;
  min-width: auto;
  font-size: small;
  align-items: center;
}

.p-button-text:hover {
  text-decoration: underline;
}

.file-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem; /* Adjust the spacing between file items */
}

/* Adjust the file item styles */
.file-item {
  display: flex;
  align-items: center;
}

/* Style the file list */
.file-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.custom-dropdown {
  min-width: 120px; /* Set your desired minimum width */
  max-width: 200px; /* Set your desired maximum width */
}

@media (max-width: 768px) {
  /* Adjust the breakpoint as needed */
  .custom-dropdown {
    max-width: 50%; /* Allow the dropdown to take full width on smaller screens */
  }
}
</style>
