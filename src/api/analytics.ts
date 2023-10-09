import { useHttpClient } from "../network/httpClient";

const httpClient = useHttpClient();

export const analyticsApi = {
  DashboardCounters: async function () {
    const response = await httpClient.get(`/Analytics/Dashboard-Counters`);
    return response;
  },
};
