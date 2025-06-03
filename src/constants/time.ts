import { ALL_OPTION } from "constants/index";
import { LABEL } from "./label";

export const yyyy_MM_dd = "yyyy-MM-dd";
export const YYYY_MM_DD = "YYYY-MM-DD";
export const YYYY_MM_DD_HH_mm_ss = "YYYY-MM-DD HH:mm:ss";
export const DD_MM = "MM-DD";
export const DD_MM_YYYY = "DD/MM/YYYY";
export const DD_MM_YYYY_HH_mm_ss = "DD-MM-YYYY-HH:mm:ss";
export const HH_mm_DD_MM_YYYY = "HH:mm DD/MM/YYYY";
export const HH_mm_ss_DD_MM_YYYY = "HH:mm:ss DD/MM/YYYY";
export const DD_MM_YYYY_HH_mm = "DD/MM/YYYY HH:mm";

export const RANGE_DATE_OPTIONS = [
  { ...ALL_OPTION },
  { label: LABEL.TODAY, value: 0, haveToday: true },
  { label: LABEL.YESTERDAY, value: 1, haveToday: false },
  { label: LABEL.THREE_DAYS_AGO, value: 3, haveToday: false },
  { label: LABEL.SEVEN_DAYS_AGO, value: 7, haveToday: false },
  { label: LABEL.FOURTEEN_DAYS_AGO, value: 14, haveToday: false },
  { label: LABEL.THIRTY_DAYS_AGO, value: 30, haveToday: false },
  { label: LABEL.NINETY_DAYS_AGO, value: 90, haveToday: false },
  { label: LABEL.LAST_MONTH, value: -2, haveToday: false },
  { label: LABEL.THIS_MONTH, value: -1, haveToday: true },
  { label: LABEL.THREE_DAYS_AGO_AND_TODAY, value: 4, haveToday: true },
  { label: LABEL.SEVEN_DAYS_AGO_AND_TODAY, value: 8, haveToday: true },
  { label: LABEL.FOURTEEN_DAYS_AGO_AND_TODAY, value: 15, haveToday: true },
  { label: LABEL.THIRTY_DAYS_AGO_AND_TODAY, value: 31, haveToday: true },
  { label: LABEL.NINETY_DAYS_AGO_AND_TODAY, value: 91, haveToday: true },
  { label: LABEL.CUSTOM, value: "custom_date" },
];

export const RANGE_MONTH_OPTIONS = [
  { ...ALL_OPTION },
  { label: LABEL.JANUARY, value: 1 },
  { label: LABEL.FEBRUARY, value: 2 },
  { label: LABEL.MARCH, value: 3 },
  { label: LABEL.APRIL, value: 4 },
  { label: LABEL.MAY, value: 5 },
  { label: LABEL.JUNE, value: 6 },
  { label: LABEL.JULY, value: 7 },
  { label: LABEL.AUGUST, value: 8 },
  { label: LABEL.SEPTEMPER, value: 9 },
  { label: LABEL.OCTOBER, value: 10 },
  { label: LABEL.NOVEMBER, value: 11 },
  { label: LABEL.DECEMBER, value: 12 },
  { label: LABEL.CUSTOM, value: "custom_date" },
];
