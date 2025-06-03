import { Sorting, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import map from "lodash/map";
import { useEffect, useReducer } from "react";
import { ColumnShowSortType, TColumAction, TColumn, TTableActions } from "types/DGrid";
import { TParams } from "types/Param";
import useLocalStorage from "./useLocalStorage";

export interface TableProps {
  // defaultColumnOrders: string[];
  columnOrders?: string[];
  setColumnOrders: (payload: string[]) => void;
  //ẩn cột
  hiddenColumnNames?: string[];
  setHiddenColumnNames: (payload: string[]) => void;
  // defaultHiddenColumnNames: string[];
  //độ rộng cột
  // defaultColumnWidths: TableColumnWidthInfo[];
  columnWidths: TableColumnWidthInfo[];
  setColumnWidths: (payload: TableColumnWidthInfo[]) => void;
  // định nghĩa cột
  columns: TColumn[];
  setColumns: (columns: TColumn[]) => void;
  // full height table hoặc
  isFullRow?: boolean;
  setFullRow: (payload: boolean) => void;

  params?: TParams;
  setParams: (params: TParams) => void;
  //   iconFullRowVisible: "detail" | "edit" | "selection";
  //sort data theo label cột
  columnShowSort?: ColumnShowSortType[];
  setColumnShowSort?: (payload: ColumnShowSortType[]) => void;

  sorting?: Sorting[];
  onSortingChange?: (sorting: Sorting[]) => void;
  storageKey?: string;
}

const Reducer = (state: Partial<TableProps>, action: TTableActions): Partial<TableProps> => {
  switch (action.type) {
    case TColumAction.SetCO:
      return {
        ...state,
        columnOrders: action.payload.columnOrders,
      };
    case TColumAction.SetC:
      return {
        ...state,
        columns: action.payload.columns,
      };
    case TColumAction.SetCW:
      return {
        ...state,
        columnWidths: action.payload.columnWidths,
      };
    case TColumAction.SetSort:
      return {
        ...state,
        columnShowSort: action.payload.columnShowSort,
      };
    case TColumAction.SetIsFullRow:
      return {
        ...state,
        isFullRow: action.payload.isFullRow,
      };
    case TColumAction.SetHC:
      return {
        ...state,
        hiddenColumnNames: action.payload.hiddenColumnNames,
      };
    case TColumAction.SetSorting:
      return {
        ...state,
        sorting: action.payload.sorting,
      };
    case TColumAction.SetParams:
      return {
        ...state,
        params: action.payload.params,
      };

    default:
      return state;
  }
};

const useTable = ({
  columnWidths,
  columnOrders,
  params,
  hiddenColumnNames = [],
  columnShowSort = [],
  isFullRow = false,
  sorting = [],
  columns,
  storageKey = "",
}: Partial<TableProps>): Partial<TableProps> => {
  const [state, dispatch] = useReducer(Reducer, {
    columnWidths,
    columnOrders,
    params,
    hiddenColumnNames,
    columnShowSort,
    isFullRow,
    columns,
    sorting,
  });
  const [storage, setStorage] = useLocalStorage(storageKey, {
    columnWidths,
    columnOrders,
    params,
    hiddenColumnNames,
    columnShowSort,
    isFullRow,
    columns,
    sorting,
  });

  const setColumns = (payload: TColumn[]) => {
    storageKey
      ? setStorage({ ...storage, columns: payload })
      : dispatch({
          type: TColumAction.SetC,
          payload: {
            columns: payload,
          },
        });
  };
  const setColumnWidths = (payload: TableColumnWidthInfo[]) => {
    storageKey
      ? setStorage({ ...storage, columnWidths: payload })
      : dispatch({
          type: TColumAction.SetCW,
          payload: {
            columnWidths: payload,
          },
        });
  };
  const onSortingChange = (payload: Sorting[]) => {
    storageKey
      ? setStorage({ ...storage, sorting: payload })
      : dispatch({
          type: TColumAction.SetSorting,
          payload: {
            sorting: payload,
          },
        });
  };

  const setColumnOrders = (payload: string[]) => {
    storageKey
      ? setStorage({ ...storage, columnOrders: payload })
      : dispatch({
          type: TColumAction.SetCO,
          payload: {
            columnOrders: payload,
          },
        });
  };

  const setColumnShowSort = (payload: ColumnShowSortType[]) => {
    storageKey
      ? setStorage({ ...storage, columnShowSort: payload })
      : dispatch({
          type: TColumAction.SetSort,
          payload: {
            columnShowSort: payload,
          },
        });
  };
  const setParams = (payload: TParams) => {
    storageKey
      ? setStorage({ ...storage, params: payload })
      : dispatch({
          type: TColumAction.SetParams,
          payload: {
            params: payload,
          },
        });
  };
  const setHiddenColumnNames = (payload: string[]) => {
    storageKey
      ? setStorage({ ...storage, hiddenColumnNames: payload })
      : dispatch({
          type: TColumAction.SetHC,
          payload: {
            hiddenColumnNames: payload,
          },
        });
  };
  const setFullRow = (payload: boolean) => {
    storageKey
      ? setStorage({ ...storage, isFullRow: payload })
      : dispatch({
          type: TColumAction.SetIsFullRow,
          payload: {
            isFullRow: payload,
          },
        });
  };

  useEffect(() => {
    columns?.length &&
      !columnOrders &&
      !storage.columnOrders?.length &&
      setColumnOrders(map(columns, (item) => item.name));
  }, [columns, columnOrders]);

  return {
    ...(storageKey ? storage : state),
    setFullRow,
    setColumnOrders,
    setColumnWidths,
    setHiddenColumnNames,
    setColumnShowSort,
    setParams,
    onSortingChange,
    setColumns,
  };
};

export default useTable;
