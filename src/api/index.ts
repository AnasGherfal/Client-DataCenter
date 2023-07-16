import axios, { type CreateAxiosDefaults } from "axios";

const config: CreateAxiosDefaults = {
  baseURL: "https://localhost:7003/api/",
};

const httpClient = axios.create(config);

// Add interceptor to set authorization token
httpClient.interceptors.request.use((config) => {
  const isAuthorized = localStorage.getItem("isAuthorized");
  if (isAuthorized) {
    config.headers.Authorization = `Bearer ${isAuthorized}`;
    console.log(config)
  }
  return config;
});

const secondConfig: CreateAxiosDefaults = {
  baseURL: "https://localhost:7030/v1.0/management/",
};

const secondHttpClient = axios.create(secondConfig);

// Add interceptor to set authorization token
secondHttpClient.interceptors.request.use((config) => {
  const isAuthorized = localStorage.getItem("isAuthorized");
  if (isAuthorized) {
    config.headers.Authorization = `Bearer ${isAuthorized}`;
  }
  return config;
});

export { httpClient, secondHttpClient };
