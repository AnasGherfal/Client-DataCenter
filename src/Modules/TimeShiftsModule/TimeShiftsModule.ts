export interface VisitHours {
  day: string | null;
  date: string | null;
  startTime: string;
  endTime: string;
  priceForFirstHour: number | null;
  priceForRemainingHours: number | null;
}
