export function formatTotalMin(totalMin: string) {
  const timeParts = totalMin.split(":");
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  const formattedTime = `${hours}h  ${minutes}m `;
  return formattedTime;
}
