import { DD_MM_YYYY, DD_MM_YYYY_HH_mm_ss, HH_mm_DD_MM_YYYY } from "constants/time";
import { formatDistanceToNow, getTime } from "date-fns";

import dayjs, { Dayjs } from "dayjs";

export const INVALID_DATE = "Invalid date";

export function dateIsValid(date: fDateType) {
  return date ? !Number.isNaN(new Date(dayjs(date).format()).getTime()) : false;
}

export const formatStringToLocalTime = (value: string) => {
  return dayjs(value).format(DD_MM_YYYY_HH_mm_ss);
};

export type fDateType = string | number | null | undefined | Date | Dayjs;
export const fDate = (
  value: fDateType,
  typeFormat: string = DD_MM_YYYY,
): string | null | undefined => {
  const result = value ? dayjs(value).format(typeFormat) : null;
  return result === INVALID_DATE ? value?.toString() : result;
};

export const fDateTime = (
  value: fDateType,
  typeFormat: string = HH_mm_DD_MM_YYYY,
): string | null => {
  const formatValue = value ? dayjs(value).format(typeFormat) : null;
  return formatValue === INVALID_DATE ? null : formatValue;
};

export type timeStringFormatType = "%h" | "%h %m" | "%h %m %s";

export const fMinutesToTimeString = (value: number, format: timeStringFormatType = "%h %m %s") => {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  const seconds = value * 60 - hours * 60 * 60 - minutes * 60;
  switch (format) {
    case "%h":
      return `${hours}h`;
    case "%h %m":
      return `${hours}h ${minutes}m`;
    default:
      return `${hours}h ${minutes}m ${seconds}s`;
  }
};

export const fSecondsToTimeString = (value: number, format: timeStringFormatType = "%h %m %s") => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor(value / 60) % 60;
  const seconds = value - hours * 60 * 60 - minutes * 60;
  switch (format) {
    case "%h":
      return `${hours}h`;
    case "%h %m":
      return `${hours}h ${minutes}m`;
    default:
      return `${hours}h ${minutes}m ${seconds}s`;
  }
};

export const transformDateFilter = (
  days = 1,
  formatString: string,
  haveToday: boolean,
  milestoneDate: number | Date = new Date(),
) => {
  if (Array.isArray(days)) {
    return {
      created_from: days[0],
      created_to: days[1],
    };
  }
  days = Number(days);
  // today
  if (days === 0) {
    return {
      created_from: dayjs(milestoneDate).subtract(0, "day").format(formatString),
      created_to: dayjs(milestoneDate).subtract(0, "day").format(formatString),
    };
  }
  // last n days
  if (days >= 0) {
    return {
      created_from: dayjs(milestoneDate)
        .subtract(haveToday ? days - 1 : days, "day")
        .format(formatString),
      created_to: dayjs(milestoneDate)
        .subtract(haveToday ? 0 : 1, "day")
        .format(formatString),
    };
  }
  if (days === -2) {
    return {
      created_from: dayjs(milestoneDate).startOf("month").subtract(1, "month").format(formatString),
      created_to: dayjs(milestoneDate).endOf("month").subtract(1, "month").format(formatString),
    };
  }
  return {
    created_from: dayjs(milestoneDate).startOf("month").format(formatString),
    created_to: dayjs(new Date()).format(formatString),
  };
};

export const transformMonthFilter = (days = 1, formatString: string) => {
  if (Array.isArray(days)) {
    return {
      created_from: days[0],
      created_to: days[1],
    };
  }
  days = Number(days);

  const month = dayjs().get("month") + 1;

  return {
    created_from:
      month > days
        ? dayjs(new Date())
            .startOf("month")
            .subtract(month - days, "month")
            .format(formatString)
        : dayjs(new Date())
            .startOf("month")
            .subtract(days - month, "month"),
    created_to:
      month > days
        ? dayjs(new Date())
            .endOf("month")
            .subtract(month - days, "month")
        : dayjs(new Date())
            .endOf("month")
            .subtract(days - month, "month"),
  };
};

export const compareDateSelected = (from: string, to: string, value: string | number) => {
  if (value === "all") {
    return {
      date_from: undefined,
      date_to: undefined,
      value,
    };
  }
  return {
    date_from: from,
    date_to: to,
    value: value,
  };
};

export const convertFromDateToTimeStamp = (date: string | Date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};

export const convertFromTimeStampToDate = (date: number) => {
  return fDate(date * 1000);
};

export const timeStampOfStartDate = (date: Date | string) => {
  return Math.floor(new Date(date).setUTCHours(0, 0, 0, 0) / 1000);
};

export const timeStampOfEndDate = (date: Date | string) => {
  return Math.floor(new Date(date).setUTCHours(23, 59, 59, 999) / 1000);
};

export const isDuration = (duration: string) => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(duration);
};

export const formatISOToLocalDateString = (value?: string) => {
  return value?.replace("Z", "") + "+07:00";
};

export function fTimestamp(date: Date | string | number) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date: Date | string | number) {
  return fDateTime(new Date(date), "dd/MM/yyyy hh:mm p");
}

export function fToNow(date: Date | string | number) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
