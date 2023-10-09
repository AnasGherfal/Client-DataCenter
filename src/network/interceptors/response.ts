import axios, { AxiosResponse } from "axios";
import { authApi } from '../../api/auth';

export function onResponse(response: AxiosResponse) {
  return response;
}

export async function onError(error: any) {
  if (error.response?.status === 401) {
    // sholud be removed when implement refresh token
    localStorage.clear();
    location.href = "/Login";
    // should refresh token
    // await authApi.refreshToken()
    // axios.request(error.config).catch(async (responseError) => {
    //   if (responseError?.response?.status === 401) {
    //     localStorage.clear();
    //     location.href = "/Login";
    //   }
    // });
  }

  return Promise.reject(error);
}
