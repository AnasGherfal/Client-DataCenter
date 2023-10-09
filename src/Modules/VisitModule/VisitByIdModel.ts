

export interface VisitModelRepresentatives {
  firstName: string;
  lastName: string;
  identityNo: string;
  identityType: number;
}

export interface VisitModelCompanions {
  firstName: string;
  lastName: string;
  identityNo: string;
  identityType: number;
  jobTitle: string;
}

export interface VisitModel {
  id: string;
  customer: string;
  service: string;
  expectedStartTime: string;
  expectedEndTime: string;
  startTime: string;
  endTime: string;
  totalTime: string;
  visitPrice: number;
  notes: string;
  visitType: number;
  isPaid: true;
  createdOn: string;
  representatives: VisitModelRepresentatives[];
  companions: VisitModelCompanions[];
  visitStatus: string;
}
