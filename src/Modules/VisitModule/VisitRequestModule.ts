export interface Visit {
  startTime: string;
  endTime: string;
  customerName: string;
  visitType: string;
  notes: string;
  timeShift: string;
  totalMin: string;
  price: number;
  invoiceId: number;
  representives: [];
  companions: [];
}
