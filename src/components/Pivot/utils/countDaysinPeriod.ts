export function countDaysInPeriod(
  startDate?: Date | string | null,
  endDate?: Date | string | null,
) {
  if (startDate && endDate) {
    // Chuyển đổi thời gian thành milliseconds
    const oneDay = 24 * 60 * 60 * 1000; // Số milliseconds trong một ngày

    // Lấy thời điểm bắt đầu và kết thúc dưới dạng milliseconds
    const startMillis = new Date(startDate).getTime();
    const endMillis = new Date(endDate).getTime();

    // Tính số ngày trong đoạn thời gian
    const daysInPeriod = Math.round(Math.abs((startMillis - endMillis) / oneDay)) + 1;

    return daysInPeriod;
  }
  return 0;
}
