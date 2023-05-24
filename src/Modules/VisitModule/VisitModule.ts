import type { Representatives } from "../CustomerModule/RepresentativesModule/Representatives";
import type { companions } from "./companionsModule";

export interface Visit {
    expectedStartTime:string,
    expectedEndTime:string,
    startTime:string,
    endTime:string,
    notes:string,
    visitTypeId: number | null,
    invoiceId: number | null,
    subscriptionId: number | null,
    companions:companions[]|null,
    representives:Representatives[]|null
  }