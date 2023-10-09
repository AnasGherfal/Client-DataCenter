import type { Representatives } from "../CustomerModule/RepresentativesModule/Representatives";
import type { Companions } from "./companionsModule";


export interface Visit {
  expectedStartTime: string;
  expectedEndTime: string;
  companions: Companions[];

  visitType:number;
  subscriptionId: number|null;
  representatives:Representatives[];
  notes: string;



}
