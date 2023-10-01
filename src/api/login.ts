import type { Customer } from "../Modules/CustomerModule/CustomersModule";
import {httpClient} from "./index";

export const loginApi = {


  create: async function (credentials: any){
    const response = await httpClient.post(`/Login`, credentials);
    return response;
  },
}
