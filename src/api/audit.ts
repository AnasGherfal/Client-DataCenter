import type { ResponseAdminModel } from "@/Modules/AdminModule/AdminModuleResponse";
import {httpClient} from "./index";
import {isAuthorized, getToken} from "@/auth"

const token = getToken();
export const audit = {
  get: async function (pageNumber: number, pageSize: number) {
    const response = await httpClient.get(`/Audits?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
      headers: {
          Authorization:` bearer ${token}`,
      }
    });
    return response;
  },
  // getById: async function (id: any) {
  //   const response = await httpClient.get(`/Admins/${id}`);
  //   return response;
  // },

};
