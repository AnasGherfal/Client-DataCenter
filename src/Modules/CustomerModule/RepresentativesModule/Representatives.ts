export interface Representatives {
    firstName: string;
    lastName: string;
    identityNo: string;
    email: string;
    phoneNo: string;
    identityType: number|null;
    customerId:number |null;
    firstFile: {
      file: File|null,
      docType: number,
    },
    secondFile: {
      file: File|null,
      docType: number,
    },
  }