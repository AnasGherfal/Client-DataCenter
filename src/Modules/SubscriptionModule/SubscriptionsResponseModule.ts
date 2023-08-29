export interface SubscriptionRespons {
    id:string|null,
    status:number|null,
    serviceName:string ,
    customerName: string ,
    startDate:string,
    endDate:string,
    subscriptionFileId:null|number,
    daysRemaining: number,
    monthlyVisits:number,
    visits:[]
    file:{fileName: string, docType:string, id:string}

  }