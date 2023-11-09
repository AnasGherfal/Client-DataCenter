export interface Representatives {
  id:string
  firstName: string;
  lastName: string;
  identityNo: string;
  email: string;
  phoneNo: string;
  identityType: number | null;
  customerId: number | null;
  RepresentationDocument: File | null;
  IdentityDocuments: File | null;
  type: number | null,
  from: string,
  to: string
}
