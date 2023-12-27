import { defineStore } from "pinia";
import { ref } from "vue";

export const useSharedStore = defineStore("Shared", () => {
  const statuses = ref([
    { value: 1, label: "نشط" },
    { value: 2, label: "مقيد" },
    { value: 3, label: "طلب" },
    { value: 4, label: "مرفوض" },
    { value: 5, label: "ملغي" },
  ]);

  const getSeverity = (status: any) => {
    switch (trans(status)) {
      case "نشط":
        return "success";

      case "مقيد":
        return "danger";
      case "طلب":
        return "warning";
      case "مرفوض":
        return "secondary";
      case "ملغي":
        return "help";
    }
  };

  const trans = (value: string) => {
    if (value == "1") return "نشط";
    else if (value == "2") return "مقيد";
    else if (value == "3") return "طلب";
    else if (value == "4") return "مرفوض";
    else if (value == "5") return "ملغي";
  };

  const getSelectedStatusLabel = (value: any) => {
    const status = statuses.value.find((s) => s.value === value);
    return status ? status.label : "";
  };

  const hasPermission = (permissions: number[], permissionToCheck: number) => {
    // Iterate through each individual permission bit in permissionToCheck
    for (let i = 0; i < permissions.length; i++) {
      const permissionBit = permissions[i];
      // Check if the user has this specific permission bit
      if ((permissionToCheck & permissionBit) === permissionBit) {
        return true; // User has this permission bit
      }
    }
    return false; // User doesn't have any of the specified permission bits
  };

  return {
    getSeverity,
    getSelectedStatusLabel,
    hasPermission,
  };
});
