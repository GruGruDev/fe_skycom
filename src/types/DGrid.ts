import {
  ChangeSet,
  Column,
  EditingState,
  Filter,
  FilteringState,
  GridColumnExtension,
  Grouping,
  GroupSummaryItem,
  IntegratedFiltering,
  Sorting,
  SummaryItem,
  TableColumnWidthInfo,
  TableFilterRow,
  TableHeaderRow,
} from "@devexpress/dx-react-grid";
import { RangeDateV2Props } from "components/Pickers";
import { MultiSelectProps } from "components/Selectors";
import React from "react";
import { TParams } from "./Param";

import { SxProps, Theme } from "@mui/material";
import { AirTableColumnTypes } from "components/Pivot/Filter/types";
import { SliderProps } from "components/Table/Filter/SliderFilter";
import { ActionMap } from "./Auth";

export interface ColumnShowSortType {
  name: string;
  fields: {
    title: string;
    name: string;
  }[];
}

export interface TEditProps<RowType = any> {
  row: RowType;
  onChange: ({ name, value }: { name: string; value: any }) => void;
  onApplyChanges: () => void;
  onCancelChanges: () => void;
  open: boolean;
  editingRowIds?: number[] | undefined;
}
export interface TDGrid<RowType = any, ValidationCellType = any> {
  cellStyle?: React.CSSProperties;
  disableExcuteRowPath?: string;

  isCustomPagination?: boolean;

  // vị trí cột
  defaultColumnOrders: string[];
  columnOrders: string[];
  setColumnOrders: (payload: string[]) => void;
  //ẩn cột
  hiddenColumnNames: string[];
  defaultHiddenColumnNames: string[];
  setHiddenColumnNames: (payload: string[]) => void;
  //độ rộng cột
  defaultColumnWidths: TableColumnWidthInfo[];
  columnWidths: TableColumnWidthInfo[];
  setColumnWidths: (payload: TableColumnWidthInfo[]) => void;
  // định nghĩa cột
  columns: TColumn[];
  // full height table hoặc
  isFullRow: boolean;
  setFullRow: (payload: boolean) => void;
  iconFullRowVisible?: "detail" | "edit" | "selection";
  //sort data theo label cột
  columnShowSort?: ColumnShowSortType[];
  setColumnShowSort?: (payload: ColumnShowSortType[]) => void;
  // summary cột
  summaryColumns: SummaryItem[];
  SummaryColumnsComponent: ({
    column,
    row,
    rows,
    type,
    value,
  }: {
    column?: {
      name: string;
      title: string;
    };
    row?: RowType;
    rows?: RowType;
    type: string;
    value: string;
  }) => JSX.Element;
  totalRow: { [key: string]: string | number };

  //fix columns
  fixLeftColumns?: (string | symbol)[];
  fixRightColumns?: (string | symbol)[];

  //gom nhóm dòng
  grouping: Grouping[];
  groupSummaryItems: GroupSummaryItem[];
  formatGroupingItem: (cellProps: { columnName: string; value: string; row: any }) => string;

  //select dòng
  selection: (number | string)[];
  setSelection: React.Dispatch<React.SetStateAction<(number | string)[]>>;
  showSelectAll?: boolean;
  //modal update item
  editRowChangeForInline?: (changes: ChangeSet) => void;
  editComponent: ({
    onApplyChanges,
    onCancelChanges,
    onChange,
    editingRowIds,
    row,
    open,
  }: TEditProps<RowType>) => JSX.Element;
  showEditCommand?: boolean;
  editButtonLabel?: string;
  showDeleteCommand?: boolean;
  deleteButtonLabel?: string;
  showAddCommand?: boolean;
  addButtonLabel?: string;
  cancelCommand?: string;
  commitCommand?: string;

  rowStyleByRowData: (row: RowType) => React.CSSProperties;

  params?: TParams;
  setParams?: (params: TParams) => void;
  data: {
    data: RowType[];
    dataCompare?: RowType[];
    count: number;
    loading?: boolean;
    detailRowName?: string;
  };

  // detail row
  detailComponent: ({ row }: { row: RowType }) => React.ReactElement<any, any> | null;

  expandedRowIds?: (string | number)[];
  onExpandedRowIdsChange?: (value: (string | number)[]) => void;
  // bao gồm các cột để format row data
  children: React.ReactNode | React.ReactElement | JSX.Element;

  //
  validationCellStatus: ValidationCellType;
  columnExtensions: GridColumnExtension[];
  columnEditExtensions: EditingState.ColumnExtension[];

  //header cell
  headerCellComponent: (
    cellProps: React.PropsWithChildren<TableHeaderRow.CellProps>,
  ) => JSX.Element;

  hiddenHeaderCell?: boolean;
  headerCellStyles?: SxProps<Theme>;
  //
  heightTable?: number;
  hiddenPagination?: boolean;
  isTableInRow?: boolean;
  tableWrapSx?: SxProps<Theme>;

  sorting?: Sorting[];
  onSortingChange?: (sorting: Sorting[]) => void;

  onDeleteRow?: (deleted: ReadonlyArray<number | string>) => Promise<void>;

  filters?: Filter[];
  onFiltersChange?: (filter: Filter[]) => void;
  columnFilterExtensions?: IntegratedFiltering.ColumnExtension[];
  columnFilterStateExtensions?: FilteringState.ColumnExtension[];
  filterCellCompnent?: (props: TableFilterRow.CellProps) => React.ReactNode | JSX.Element;
}

export type TDGridData<T, Total = any> = {
  data: T[];
  loading: boolean;
  count: number;
  next?: string | null;
  previous?: string | null;
  error?: any;
  total?: Total;
};

export type TFilterProps = {
  type: "select" | "time" | "slider";
  multiSelectProps?: MultiSelectProps;
  timeProps?: RangeDateV2Props;
  sliderProps?: Partial<SliderProps>;
  key?: string;
} | null;

export type TColumnType =
  | "span"
  | "multiselect"
  | "datetime"
  | "date"
  | "attribute"
  | "multichip"
  | "user"
  | "customer"
  | "number"
  | "float"
  | "boolean"
  | "text"
  | "gender"
  | "percent"
  | "phone"
  | "image";
export interface TColumn extends Omit<Column, "name"> {
  type?: TColumnType; // type để format UI trong SynctheticColumn
  filterType?: AirTableColumnTypes; //type để map condition trong pivot filter
  options?: any; // data bổ sung cho cột
  name: string;
}

export enum TColumAction {
  SetC = "SET_C",
  SetCW = "SET_CW",
  SetCO = "SET_CO",
  SetKanBanView = "SET_KANBAN_VIEW",
  SetParams = "SET_PARAMS",
  SetHC = "SET_HC",
  SetIsFullRow = "SET_ISFULLROW",
  SetSort = "SET_SORT",
  SetSorting = "SET_SORTING",
}

export type TTableAction = {
  [TColumAction.SetC]: {
    columns: TColumn[];
  };
  [TColumAction.SetCW]: {
    columnWidths: TableColumnWidthInfo[];
  };
  [TColumAction.SetCO]: {
    columnOrders: string[];
  };
  [TColumAction.SetParams]: {
    params: TParams;
  };
  [TColumAction.SetHC]: {
    hiddenColumnNames: string[];
  };
  [TColumAction.SetIsFullRow]: {
    isFullRow: boolean;
  };
  [TColumAction.SetKanBanView]: {
    isShowKanban: boolean;
  };
  [TColumAction.SetSorting]: {
    sorting: Sorting[];
  };
  [TColumAction.SetSort]: {
    columnShowSort: ColumnShowSortType[];
  };
};

export type TTableActions = ActionMap<TTableAction>[keyof ActionMap<TTableAction>];
