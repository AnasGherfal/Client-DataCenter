export interface Customer {
    id?: string;
    status?: number;
    name: string;
    email: string;
    address: string;
    primaryPhone: string;
    secondaryPhone: string;
    files: [{
      file: File |any;
      docType: number;
    },
    {
    file: File |any;
    docType: number;
    }
      ];
    subsicrptions: string


}