export interface VisitReq {
  id: number;
  startTime: string;
  endTime: string;
  customerName: string;
  visitType: string;
  notes: string;
  timeShift: string;
  totalMin: string;
  price: number;
  invoiceId: number|null;
  representatives: [];
  companions: [  {
    firstName: "string",
    lastName: "string",
    identityNo: "string",
    identityType: 0,
    jobTitle: "string"
  }];
}
