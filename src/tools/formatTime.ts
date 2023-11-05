import moment from "moment";

export function formatTotalMin(totalMin: string) {
  const timeParts = totalMin.split(":");
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  const formattedTime = `${hours}h  ${minutes}m `;
  return formattedTime;
}

export function formatTime(date: string): string {
  return moment(date).format("YYYY/MM/DD hh:mm a");
}

export function formatTimeSpan(date: string): string {
  return moment(date).format("hh:mm:ss");
}
