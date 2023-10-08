export interface Customer {
    id?: string;
    status?: number;
    name: string;
    email: string;
    address: string;
    city:string;
    primaryPhone: string;
    secondaryPhone: string;
    files: [{
      file: File |any;
      fileType: number;
    },
    {
    file: File |any;
    fileType: number;
    }
      ];



}