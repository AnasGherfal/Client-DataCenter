export interface SubscriptionRespons {
  id: string | null;
  serviceName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: number | null;
  createdOn: string;
}
