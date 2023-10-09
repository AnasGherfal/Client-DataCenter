export interface VisitHours {
  day: string;
  startTime: string;
  endTime: string;
  date: string;
  priceForFirstHour: number | null;
  priceForRemainingHours: number | null;
}
