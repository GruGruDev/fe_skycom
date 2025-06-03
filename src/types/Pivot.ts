export interface TPivotDateFilter {
  created_from?: string;
  created_to?: string;
  dateValue?: number | string;
}

export interface TPivotCache {
  dimensions: string[];
  metrics: string[];
  date: TPivotDateFilter;
  dateCompare?: TPivotDateFilter;
  filter?: {
    b_expr_dims: string; // toán tử giữa các filter dimension. value options: AND | OR
    b_expr_metrics: string; // toán tử giữa các filter metric. value options: AND | OR
    filters: string;
  };
}

export interface TPivotFilterExtension {
  rowValue: string;
  columnName: string;
  filterValue: string;
}
