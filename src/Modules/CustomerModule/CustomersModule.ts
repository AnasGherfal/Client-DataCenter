export interface Customer {
    id?: number;
    status?: number;
    name: string;
    email: string;
    address: string;
    primaryPhone: string;
    secondaryPhone: string;
    files: [{
      file: File |any;
      docType: number;
    }];


}