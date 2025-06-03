import { ORDER_REPORT_DIMENTIONS } from "constants/order/columns";
import AbstractFilterItem, { Mode, Operator } from "../Filter/AbstractFilterItem";
import FilterSet from "../Filter/FilterSet";
import { AirTableColumnTypes } from "../Filter/types";
import { transformDateFilter } from "utils/date";
import { YYYY_MM_DD } from "constants/time";
import dayjs from "dayjs";
import { findOption } from "utils/option";

export const getFilter = (filter?: FilterSet, filterMetrics?: FilterSet) => {
  const filterSet = [...(filter?.filterSet || []), ...(filterMetrics?.filterSet || [])];
  const filterSelected = filterSet.reduce((prev: any, cur: AbstractFilterItem) => {
    //lấy ra type của filter
    //so sánh type =>>> xử lý theo từng type

    const filterType =
      findOption(ORDER_REPORT_DIMENTIONS, cur?.key, "name")?.filterType ||
      AirTableColumnTypes.NUMBER;

    const key = cur?.key?.includes("__id") ? cur?.key.split("__")[0] : cur?.key || "";
    let value = cur.value;

    if (value) {
      let dateRange;
      switch (cur.operator) {
        case Operator.IS_EMPTY:
          prev.push([key, cur.operator.toLowerCase(), 1]);
          break;
        case Operator.IS_NOT_EMPTY:
          prev.push([key, "isempty", 0]);
          break;
        case Operator.IS:
        case Operator.IS_NOT:
          const operator =
            cur.operator === Operator.IS
              ? filterType == AirTableColumnTypes.DATE
                ? "is"
                : "="
              : "!=";
          if (
            filterType === AirTableColumnTypes.DATE ||
            filterType === AirTableColumnTypes.DATETIME
          ) {
            dateRange = getDateRange(value.mode, value.value);
            value = [dateRange.created_from, dateRange.created_to];
          }
          prev.push([key, operator, value]);
          break;
        case Operator.IS_BETWEEN:
        case Operator.IS_EXCEPT:
          value = [+value.min, +value.max];
          prev.push([key, cur.operator.toLowerCase(), value]);
          break;
        case Operator.CONTAINS:
        case Operator.DOES_NOT_CONSTAINS:
        case Operator.EQUAL:
        case Operator.NOT_EQUAL:
        case Operator.GREATER:
        case Operator.GREATER_OR_EQUAL:
        case Operator.SMALLER:
        case Operator.SMALLER_OR_EQUAL:
          prev.push([key, cur.operator, +value]);
          break;
        case Operator.IS_BEFORE:
        case Operator.IS_AFTER:
        case Operator.IS_ON_OR_BEFORE:
        case Operator.IS_ON_OR_AFTER:
          dateRange = getDateRange(value.mode, value.value);
          prev.push([key, cur.operator.toLocaleLowerCase(), dateRange.created_from]);
          break;
        case Operator.IS_WITHIN:
          dateRange = getDateRange(value.mode, value.value);
          prev.push([
            key,
            cur.operator.toLocaleLowerCase(),
            [dateRange.created_from, dateRange.created_to],
          ]);
          break;
        default:
          prev.push([key, cur.operator ? cur.operator.toLowerCase() : cur.operator, value]);
          break;
      }
    }
    return prev;
  }, []);

  const filterParams = {
    b_expr_dims: filter?.conjunction?.toUpperCase() || "AND",
    b_expr_metrics: filterMetrics?.conjunction?.toUpperCase() || "AND",
    filters: filterSelected.length ? JSON.stringify(filterSelected) : "",
  };
  return filterParams;
};

const formatDateCalendar = (type: any) => {
  const today = dayjs();
  const start = today.subtract(1, type).startOf(type).format("YYYY-MM-DD");
  const end = today.subtract(1, type).endOf(type).format("YYYY-MM-DD");
  return {
    created_to: end,
    created_from: start,
  };
};
const getDateRange = (mode: Mode, dayValue: number | Date | undefined) => {
  switch (mode) {
    //
    case Mode.TODAY:
      return transformDateFilter(0, YYYY_MM_DD, true);
    case Mode.YESTERDAY:
      return transformDateFilter(1, YYYY_MM_DD, false);
    case Mode.ONE_WEEK_AGO:
      return formatDateCalendar("week");
    case Mode.ONE_MONTH_AGO:
      return formatDateCalendar("month");
    case Mode.ONE_WEEK_FROM_NOW:
      return transformDateFilter(7, YYYY_MM_DD, true);
    case Mode.ONE_MONTH_FROM_NOW:
      return transformDateFilter(30, YYYY_MM_DD, true);
    case Mode.NUMBER_OF_DAYS_AGO:
      return transformDateFilter(dayValue as number, YYYY_MM_DD, false);
    //IS_WITHIN
    case Mode.THE_PAST_WEEK:
      return transformDateFilter(7, YYYY_MM_DD, false);
    case Mode.THE_PAST_MONTH:
      return transformDateFilter(30, YYYY_MM_DD, false);
    case Mode.THE_PAST_YEAR:
      return transformDateFilter(365, YYYY_MM_DD, false);
    case Mode.THE_PAST_NUMBER_OF_DAYS:
      return transformDateFilter(dayValue as number, YYYY_MM_DD, false);
    default:
      return transformDateFilter(1, YYYY_MM_DD, true, dayValue);
  }
};
