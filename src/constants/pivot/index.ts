import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { LABEL } from "constants/label";
import { TColumn } from "types/DGrid";

export const RANGE_STEP_DATE_OPTIONS = [
  { label: LABEL.DATE, value: "day" },
  { label: LABEL.WEEK, value: "week" },
  { label: LABEL.MONTH, value: "month" },
  { label: LABEL.QUARTER, value: "quarter" },
  { label: LABEL.YEAR, value: "year" },
];

export const SHOW_CHART_BY_DATE_OPTIONS = [
  RANGE_STEP_DATE_OPTIONS[1].value,
  RANGE_STEP_DATE_OPTIONS[2].value,
  RANGE_STEP_DATE_OPTIONS[3].value,
];

export const CHART_COLUMN: TColumn = {
  name: "chart_column",
  title: LABEL.CHART,
};

export const CHART_COLUMN_WIDTH: TableColumnWidthInfo = {
  columnName: "chart_column",
  width: 300,
};
