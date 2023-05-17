import httpClient from ".";
import type { Subscription } from "@/Models/SubscriptionModel/SubscriptionsModels";

export const subscription = {
    create: async function (subscription: Subscription) {
        const response = await httpClient.post(`/subscription`, subscription);
        return response;
    },
    renew: async function (id: number | null) {
        const response = await httpClient.put(`/subscription/${id}/Renew`);
        return response;
    },
    edit: async function (id: number,service: Service) {
        const response = await httpClient.put(`/Service?id=${id}`, service);
        return response;
    },
};