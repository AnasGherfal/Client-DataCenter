import type { Customer } from "../Modules/CustomerModule/CustomersModule";
import {secondHttpClient} from "./index";

export const loginApi = {


  create: async function (credentials: any){
    const response = await secondHttpClient.post(`/Login`, credentials);
    return response;
  },
}
