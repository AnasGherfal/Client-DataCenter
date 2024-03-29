import axios, { type AxiosInstance } from "axios";
import { onRequest } from "./interceptors/request";
import { onError, onResponse } from "./interceptors/response";
import config from "@/config";

let httpClient: AxiosInstance;

function _createHttpClient(): void {
    httpClient = axios.create({
        baseURL: "v1.0/management",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    httpClient.interceptors.request.use(onRequest);

    httpClient.interceptors.response.use(onResponse, onError);
}

export function useHttpClient() {
    if (!httpClient) {
        _createHttpClient();
    }

    return httpClient;
}
