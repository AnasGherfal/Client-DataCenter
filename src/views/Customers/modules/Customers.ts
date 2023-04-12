export interface Customer {
    name: string;
    email: string;
    address: string;
    primaryPhone: string;
    secondaryPhone: string;
    file?: File | null;
  }