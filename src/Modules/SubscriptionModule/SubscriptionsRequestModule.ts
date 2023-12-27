export interface Subscription {
  serviceId: null,
  customerId: Customer | null ,
  startDate: string,
  endDate: string,
  contractNumber:string,
  contractDate: string,
  file:  File | null,
}

interface Customer {
  id: number;
  // Other properties...
}