import { COMMAS_REGEX } from "constants/index";
import replace from "lodash/replace";
import numeral from "numeral";

// ----------------------------------------------------------------------

export function fCurrency(number: string | number) {
  return numeral(number).format(Number.isInteger(number) ? "$0,0" : "$0,0.00");
}

export function fPercent(number: string | number) {
  return numeral(number).format("0.0%");
}

export function fPercentOmitDecimal(number: string | number) {
  return numeral(number).format("0%");
}

export function fNumber(number: string | number = 0) {
  return numeral(number).format();
}

export function fShortenNumber(number: string | number) {
  return replace(numeral(number).format("0.00a"), ".00", "");
}

export function fData(number: string | number) {
  return numeral(number).format("0.0 b");
}

export function fCurrency2(value: string | number, attach?: string) {
  return (value && `${value.toLocaleString("vi-VI")}${attach || ""}`) || value;
}

export const fValueVnd = (value: number, hideAttach?: boolean) => {
  return `${Math.trunc(value)?.toString().replace(COMMAS_REGEX, ",") || 0}${
    hideAttach ? "" : " ₫"
  }`;
};

export function isArraySubset(subset: any[], array: any[]) {
  return subset.every((value) => array.includes(value));
}

export function formatFloatToString(value: string | number = 0) {
  return parseFloat(value.toString());
}

function checkDecimalLength(input: string | number = "") {
  // Chuyển đầu vào thành số
  const num = parseFloat(input?.toString() || "0");

  // Nếu không phải số hợp lệ, trả về false
  if (isNaN(num)) {
    return 0;
  }
  // Lấy phần thập phân của số
  const decimalPart = input?.toString()?.split(".")?.[1];

  return decimalPart?.length || 0;
}

export const fFloatToString = (value: string | number = 0, prefix?: number) => {
  const fValue = value || 0;
  return prefix && checkDecimalLength(fValue) >= prefix
    ? parseFloat(fValue.toString()).toFixed(prefix)
    : parseFloat(fValue.toString());
};

export const fFloatPrefix =
  (prefix?: number) =>
  (value: string | number = 0) => {
    return prefix && checkDecimalLength(value) >= prefix
      ? parseFloat(value.toString()).toFixed(prefix)
      : value?.toString();
  };
