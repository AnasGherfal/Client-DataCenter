export interface Customer {
  city: string;
  numberOfFiles: 0;
  numberOfSubscriptions: 0;
  numberOfRepresentatives: 0;
  createdOn: string;
  id: string;
  status?: number;
  name: string;
  email: string;
  address: string;
  primaryPhone: string;
  secondaryPhone: string;
  files: [
    {
      file: File | any;
      docType: number;
    },
    {
      file: File | any;
      docType: number;
    }
  ];
  subsicrptions: string;
  representative: [];
}
