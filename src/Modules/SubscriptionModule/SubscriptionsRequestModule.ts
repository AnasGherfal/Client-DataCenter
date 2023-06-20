export interface Subscription {
    serviceId: any|null,
    customerId:  number,
    startDate:string,
    endDate:string,
    file: {
      file: File|null|any;
      docType: number|any;
    };

  }