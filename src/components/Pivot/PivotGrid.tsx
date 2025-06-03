import { Sorting, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";
import { TableWrapper } from "components/Table";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import groupBy from "lodash/groupBy";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import { TColumn, TDGrid } from "types/DGrid";
import { TSx } from "types/Styles";
import { toSimplest } from "utils/strings";
import { PivotContext } from ".";
import SummaryColumn from "./SummaryColumn";
import { DimensionMetricColumn } from "./columns/DimensionMetricColumn";
import { ReplaceIdByNameColumn } from "./columns/ReplaceIdByNameColumn";
import { ReportChartColumn, ReportChartColumnProps } from "./columns/ReportChartColumn";
import { convertGroupKey } from "./utils/convertGroupKey";
import { formatDataByDateView } from "./utils/formatDataByDateView";
import { sumDataByColumn } from "./utils/sumDataByColumn";

export interface PivotGridProps extends Partial<TDGrid>, Omit<ReportChartColumnProps, "group"> {
  group?: TColumn[];
  /**
   * Là field muốn show trong cùng của group đại diện cho column trong bảng
   */
  endDemensionColumn: TColumn;
  /**
   * Là field muốn show trong cùng của group đại diện cho columnWidth trong bảng
   */
  endDemensionColumnWidth: TableColumnWidthInfo;
  loading?: boolean;
  isShowPivot?: boolean;
  /**
   * Danh sách các cột component
   */
  children?:
    | JSX.Element
    | React.ReactNode
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

const PivotGrid = memo((props: PivotGridProps) => {
  const pivotContext = useContext(PivotContext);

  const group = useMemo(
    () => (pivotContext?.isShowPivot ? props.group : []),
    [props.group, pivotContext?.isShowPivot],
  );

  const groupFirst = group?.[0];

  const [columns, setColumns] = useState<TColumn[]>([]);
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>([]);
  const [sorting, onSortingChange] = useState<Sorting[]>([]);

  useEffect(() => {
    const columnWidths =
      props.columnWidths ||
      [
        ...(!pivotContext?.isShowPivot && props.group ? props.group : []),
        ...(props.columns || []),
      ].map((item) => ({ columnName: item.name, width: pivotContext?.isShowChart ? 250 : 170 }));
    setColumnWidths([
      {
        columnName: props.endDemensionColumnWidth.columnName,
        width: props.endDemensionColumnWidth.width,
      },
      ...(columnWidths || []),
    ]);
  }, [
    props.columns,
    props.endDemensionColumnWidth.columnName,
    props.endDemensionColumnWidth.width,
    props.columnWidths,
    pivotContext?.isShowPivot,
    props.group,
    pivotContext?.isShowChart,
  ]);

  useEffect(() => {
    setColumns([
      {
        name: props.endDemensionColumn.name,
        title: group?.map((item) => item.title)?.join(" -> ") || props.endDemensionColumn.title,
      },
      ...(pivotContext?.isShowPivot ? [] : props.group || []),
      ...(props.columns || []),
    ]);
  }, [
    props.columns,
    props.endDemensionColumn.name,
    props.endDemensionColumn.title,
    props.group,
    group,
    pivotContext?.isShowPivot,
  ]);

  useEffect(() => {
    if (columns.length) {
      pivotContext?.setColumnOrders?.(columns.map((item) => item.name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  const tableData = useMemo(() => {
    const data = groupBy(props.data?.data, groupFirst?.name);
    if (groupFirst) {
      return Object.keys(data).map((item) => {
        // đối với những group có key là id = uuid thì cần get lại key là name
        // ví dụ với groupFirst.name = customer_id => item là id => item = 0e1ec934-8672-4a69-a17f-75333fab7bc5
        // đổi thành customer_name => item = Join Nguyen
        const itemKey = convertGroupKey(groupFirst.name);

        return sumDataByColumn({
          columns: props.columns,
          detailRowName: props.data?.detailRowName,
          data,
          endDemensionColumn: props.endDemensionColumn,
          groupValue: item,
          groupKey: itemKey,
          coefficient: pivotContext?.coefficient,
          filterColumnExtensions: pivotContext?.filterColumnExtensions,
        });
      });
    } else {
      return formatDataByDateView(
        pivotContext?.dateView,
        props.data?.data,
        props.columns,
        props.endDemensionColumn,
      );
    }
  }, [
    props.columns,
    props.data?.data,
    props.data?.detailRowName,
    pivotContext?.dateView,
    pivotContext?.coefficient,
    props.endDemensionColumn,
    pivotContext?.filterColumnExtensions,
    groupFirst,
  ]);

  return (
    <Box sx={styled.wrapper}>
      <TableWrapper
        {...props}
        tableWrapSx={{
          padding: 0,
          paddingLeft: group?.length || !props.data?.detailRowName ? 0 : 6.8,
          ...props.tableWrapSx,
          ...(styled.tableWrapper as any),
        }}
        isTableInRow
        cellStyle={{
          height: pivotContext?.isShowChart && props.group?.length ? 120 : SIMPLE_CELL_HEIGHT,
        }}
        columns={columns}
        isFullRow={props.isFullRow}
        columnWidths={columnWidths}
        setColumnWidths={setColumnWidths}
        columnOrders={pivotContext?.columnOrders}
        setColumnOrders={pivotContext?.setColumnOrders}
        sorting={props.sorting || sorting}
        expandedRowIds={
          props.data?.detailRowName
            ? pivotContext?.expandedRowIdsByGroup[toSimplest(props.data?.detailRowName)]
            : undefined
        }
        onExpandedRowIdsChange={
          props.data?.detailRowName
            ? (value) =>
                pivotContext?.onExpandedRowIdsChangeByGroup((prev) => ({
                  ...prev,
                  [toSimplest(props.data?.detailRowName)]: value,
                }))
            : undefined
        }
        onSortingChange={onSortingChange}
        data={{
          data: tableData || [],
          count: tableData?.length || 0,
          loading: props.loading,
        }}
        hiddenPagination
        summaryColumns={
          !props.hiddenHeaderCell
            ? props.columns?.map((item) => ({
                columnName: item.name,
                type: item.name.includes("avg") ? "avg" : "sum",
              }))
            : undefined
        }
        SummaryColumnsComponent={(summaryProps) => {
          return (
            <SummaryColumn
              reportRangeDateCompare={pivotContext?.reportRangeDateCompare}
              rows={summaryProps.rows}
              coefficient={pivotContext?.coefficient}
              column={summaryProps.column}
            />
          );
        }}
        columnFilterStateExtensions={
          !props.hiddenHeaderCell
            ? !pivotContext?.isShowPivot
              ? [{ columnName: props.endDemensionColumn.name, filteringEnabled: false }]
              : undefined
            : undefined
        }
        filterCellCompnent={
          pivotContext?.isShowPivot && !props.hiddenHeaderCell
            ? (filterProps) => {
                return (
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      onChange={(e) =>
                        filterProps.onFilter({
                          columnName: props.endDemensionColumn.name,
                          value: {
                            value: e.target.value,
                            columnName: groupFirst,
                          },
                        })
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                );
              }
            : undefined
        }
        detailComponent={
          group?.length
            ? (detailProps) => {
                return (
                  <PivotGrid
                    group={group?.slice(1)}
                    data={{
                      count: detailProps.row.data?.length || 0,
                      data: detailProps.row.data,
                      detailRowName: detailProps.row.detailRowName,
                    }}
                    endDemensionColumn={columns[0]}
                    endDemensionColumnWidth={{
                      ...columnWidths[0],
                      width: (columnWidths[0].width as number) - 10,
                    }}
                    isFullRow
                    sorting={props.sorting || sorting}
                    columns={columns.slice(1)}
                    columnWidths={columnWidths.slice(1)}
                    hiddenHeaderCell
                    tableWrapSx={{ ".TableContainer-root": { overflowX: "clip" } }}
                  />
                );
              }
            : undefined
        }
      >
        <ReportChartColumn
          for={props.columns?.map((item) => item.name) || []}
          group={groupFirst}
          endDemensionColumn={props.endDemensionColumn}
        />
        <DimensionMetricColumn for={[props.endDemensionColumn.name]} />
        <ReplaceIdByNameColumn
          for={
            props.group?.filter((item) => item.name.includes("_id")).map((item) => item.name) || []
          }
        />
        {props.children}
      </TableWrapper>
    </Box>
  );
});

export default PivotGrid;

const styled: TSx<"wrapper" | "tableWrapper"> = {
  wrapper: {
    "tr:hover": {
      "td p": { fontWeight: "700" },
    },
    "tr:not(:hover)": {
      "td p": { fontWeight: "400" },
    },
  },
  tableWrapper: {
    ".MuiTableCell-root": {
      border: `1px solid !important`,
      borderColor: (theme) =>
        `${theme.palette.mode === "light" ? "#ecf0f1" : "#34495e"} !important`,
      p: {
        fontSize: "0.82rem",
      },
    },
  },
};
