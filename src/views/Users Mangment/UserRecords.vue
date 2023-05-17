<script setup lang="ts">
import AddBotton from "@/components/AddBotton.vue";
import LockButton from "@/components/LockButton.vue";
import { useUserStor } from "@/stores/user";

const stor = useUserStor();
</script>

<template>
  <RouterView></RouterView>

  <div v-if="$route.path === '/UsersRecord'">
    <card>
      <template #title>
        سجل المستخدمين
        <AddBotton name-button="اضافة عميل" rout-name="/UsersRecord/AddUser" />

        <Divider />
      </template>
      <template #content>
        <DataTable
          ref="dt"
          :value="stor.userData"
          dataKey="id"
          :paginator="true"
          :rows="5"
          paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل"
          responsiveLayout="scroll"
        >
          <Column
            field="fullName"
            header="اسم الموظف"
            style="min-width: 10rem"
            class="font-bold"
          ></Column>

          <Column
            field="empId"
            header="الرقم الوظيفي"
            style="min-width: 10rem"
          ></Column>

          <Column
            field="email"
            header="البريد الإلكتروني"
            style="min-width: 10rem"
          ></Column>

          <Column style="min-width: 3rem">
            <template #body="slotProps">

              <LockButton
                typeLock="Customers"
                :id="slotProps.data.id"
                :name="slotProps.data.name"
                :status="slotProps.data.status"
                @getdata="store.getCustomers"
              />
              
              <RouterLink
                :key="slotProps.data.id"
                :to="'/UsersRecord/UsersProfile/' + slotProps.data.id"
                style="text-decoration: none"
              >
                <Button
                  icon="fa-solid fa-circle-info"
                  severity="info"
                  text
                  rounded
                  v-tooltip="{ value: 'التفاصيل', fitContent: true }"
                />
              </RouterLink>
            </template>
          </Column>
        </DataTable>
      </template>
    </card>
  </div>
</template>

<style></style>
