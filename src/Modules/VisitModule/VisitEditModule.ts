export interface VisitEdit {
    startTime: string;
    endTime: string;
    totalMin: string;
    price: number;
    notes: string;
    visitTypeId: string;
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
  