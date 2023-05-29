export interface Invoice {
    id: number;
    status: number;
    date: string;
    description: string;
    invoiceNo: string;
    startDate: string;
    endDate: string;
    isPaid:boolean;
    subscriptionId: number;
    visits: [];

  }