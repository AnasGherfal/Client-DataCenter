export interface Representatives {
  firstName: string;
  lastName: string;
  identityNo: string;
  email: string;
  phoneNo: string;
  identityType: number | null;
  customerId: number | null;
  RepresentationDocument: File | null;
  IdentityDocuments: File | null;
}
