/**
 * tự sinh ra các ngày nằm giữa startDate và endDate
 * @param startDate
 * @param endDate
 * @returns Date[]
 */
export function generateDateArray(
  startDate?: Date | string | null,
  endDate?: Date | string | null,
) {
  if (startDate && endDate) {
    const dateArray = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }
  return [];
}
