import { ALL_OPTION } from "constants/index";
import { RANGE_STEP_DATE_OPTIONS } from "constants/pivot";
import { TSelectOption } from "types/SelectOption";

export const coefficientByDateView = (
  view: TSelectOption = ALL_OPTION,
  rangeDate?: {
    created_from?: string | undefined;
    created_to?: string | undefined;
  },
) => {
  let result = 1;

  let firstDay = rangeDate?.created_from ? new Date(rangeDate?.created_from) : new Date();
  let lastDay = rangeDate?.created_to ? new Date(rangeDate?.created_to) : new Date();

  switch (view.value) {
    case RANGE_STEP_DATE_OPTIONS[0].value:
      result = calculateDaysBetweenDates(firstDay, lastDay);
      break;
    case RANGE_STEP_DATE_OPTIONS[1].value:
      firstDay = new Date(
        firstDay.getFullYear(),
        firstDay.getMonth(),
        firstDay.getDate() - firstDay.getDay() + 1,
      );

      lastDay = new Date(
        lastDay.getFullYear(),
        lastDay.getMonth(),
        lastDay.getDate() - lastDay.getDay() + 7,
      );

      result = calculateWeeksBetweenDates(firstDay, lastDay);
      break;
    case RANGE_STEP_DATE_OPTIONS[2].value:
      firstDay = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);
      lastDay = new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, 0);
      result = calculateMonthsBetweenDates(firstDay, lastDay);
      break;
    case RANGE_STEP_DATE_OPTIONS[3].value:
      result = calculateQuartersBetweenDates(firstDay, lastDay);
      break;
    case RANGE_STEP_DATE_OPTIONS[4].value:
      firstDay = new Date(firstDay.getFullYear(), 0, 1);
      lastDay = new Date(lastDay.getFullYear() + 1, 0, 0);
      result = calculateYearsBetweenDates(firstDay, lastDay);
      break;

    default:
      result = calculateDaysBetweenDates(firstDay, lastDay);
      break;
  }
  return result;
};

export function calculateDaysBetweenDates(
  startDate?: Date | string | null,
  endDate?: Date | string | null,
) {
  if (startDate && endDate) {
    // Chuyển đổi thời gian thành milliseconds
    const oneDay = 24 * 60 * 60 * 1000; // Số milliseconds trong một ngày
    const startMillis = new Date(startDate).getTime();
    const endMillis = new Date(endDate).getTime();

    // Tính số ngày giữa hai ngày
    const daysBetween = Math.round(Math.abs((startMillis - endMillis) / oneDay));

    return daysBetween + 1;
  }
  return 1;
}

export function calculateWeeksBetweenDates(
  startDate?: Date | string | null,
  endDate?: Date | string | null,
) {
  if (startDate && endDate) {
    // Chuyển đổi thời gian thành milliseconds
    const oneDay = 24 * 60 * 60 * 1000; // Số milliseconds trong một ngày
    const startMillis = new Date(startDate).getTime();
    const endMillis = new Date(endDate).getTime();

    // Tính số ngày giữa hai ngày
    const daysBetween = Math.round(Math.abs((startMillis - endMillis) / oneDay));

    // Tính số tuần
    const weeksBetween = Math.ceil(daysBetween / 7);

    return weeksBetween;
  }
  return 1;
}

export function calculateQuartersBetweenDates(
  startDate?: Date | string | null,
  endDate?: Date | string | null,
) {
  if (startDate && endDate) {
    const startQuarter = Math.floor(new Date(startDate).getMonth() / 3) + 1;
    const endQuarter = Math.floor(new Date(endDate).getMonth() / 3) + 1;

    // Tính số quý giữa hai ngày
    const quartersBetween =
      endQuarter -
      startQuarter +
      (new Date(endDate).getFullYear() - new Date(startDate).getFullYear()) * 4;

    return quartersBetween;
  }
  return 1;
}

export function calculateMonthsBetweenDates(
  startDate?: Date | string | null,
  endDate?: Date | string | null,
) {
  if (startDate && endDate) {
    const startYear = new Date(startDate).getFullYear();
    const startMonth = new Date(startDate).getMonth();

    const endYear = new Date(endDate).getFullYear();
    const endMonth = new Date(endDate).getMonth();

    // Tính số tháng giữa hai ngày
    const monthsBetween = (endYear - startYear) * 12 + (endMonth - startMonth);

    return monthsBetween;
  }
  return 1;
}

export function calculateYearsBetweenDates(
  startDate?: Date | string | null,
  endDate?: Date | string | null,
) {
  if (startDate && endDate) {
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    // Tính số năm giữa hai ngày
    const yearsBetween = endYear - startYear;

    return yearsBetween;
  }
  return 1;
}
