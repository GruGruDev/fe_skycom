import {
  CustomPaging,
  EditingState,
  FilteringState,
  GroupingState,
  IntegratedFiltering,
  IntegratedGrouping,
  IntegratedSelection,
  IntegratedSorting,
  IntegratedSummary,
  PagingState,
  RowDetailState,
  SelectionState,
  Sorting,
  SortingState,
  SummaryState,
} from "@devexpress/dx-react-grid";
import {
  DragDropProvider,
  PagingPanel,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
  TableEditColumn,
  TableEditRow,
  TableFilterRow,
  TableFixedColumns,
  Grid as TableGrid,
  TableGroupRow,
  TableHeaderRow,
  TableInlineCellEditing,
  TableRowDetail,
  TableSelection,
  TableSummaryRow,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import { Theme, Tooltip, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import { BUTTON } from "constants/button";
import { PAGE_SIZES } from "constants/index";
import { LABEL } from "constants/label";
import useResponsive from "hooks/useResponsive";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import reduce from "lodash/reduce";
import { memo } from "react";
import { TColumn, TDGrid } from "types/DGrid";
import { DIRECTION_SORT_TYPE } from "types/Sort";
import { TStyles, TSx } from "types/Styles";
import {
  handleChangeParamsToSortingTable,
  handleChangeSortingTableToParams,
  handleSizeTable,
} from "utils/table";
import { CreateModifyColumn, HistoryTypeColumn } from ".";
import { CustomSortCellHeader } from "./CustomSortCellHeader";
import { TableEditingPopup } from "./EditingTablePopup";
import FilterCell, { FilterCellProps } from "./FilterCell";
import { GroupItemColumns } from "./GroupItemColumn";
import { MPagination } from "./MPagination";
import { SynctheticColumn } from "./columns/SyntheticColumn";

const areEqual = (prevProps: Partial<TDGrid>, nextProps: Partial<TDGrid>) => {
  if (
    !isEqual(prevProps.columnOrders, nextProps.columnOrders) ||
    !isEqual(prevProps.columnShowSort, nextProps.columnShowSort) ||
    !isEqual(prevProps.columnWidths, nextProps.columnWidths) ||
    !isEqual(prevProps.defaultColumnWidths, nextProps.defaultColumnWidths) ||
    !isEqual(prevProps.columns, nextProps.columns) ||
    !isEqual(prevProps.data?.data, nextProps.data?.data) ||
    !isEqual(prevProps.data?.count, nextProps.data?.count) ||
    !isEqual(prevProps.data?.loading, nextProps.data?.loading) ||
    !isEqual(prevProps.grouping, nextProps.grouping) ||
    !isEqual(prevProps.hiddenColumnNames, nextProps.hiddenColumnNames) ||
    !isEqual(prevProps.isFullRow, nextProps.isFullRow) ||
    !isEqual(prevProps.params, nextProps.params) ||
    !isEqual(prevProps.selection, nextProps.selection) ||
    !isEqual(prevProps.totalRow, nextProps.totalRow) ||
    !isEqual(prevProps.columnExtensions, nextProps.columnExtensions) ||
    !isEqual(prevProps.expandedRowIds, nextProps.expandedRowIds) ||
    !isEqual(prevProps.sorting, nextProps.sorting) ||
    !isEqual(prevProps.cellStyle, nextProps.cellStyle)
  ) {
    return false;
  }
  return true;
};

export const TableWrapper = memo(
  (props: Partial<TDGrid> & Pick<FilterCellProps, "filterCellCompnent">) => {
    const {
      data = { data: [], count: 0, loading: false },
      columns = [],
      params = {},
      columnOrders,
      columnWidths,
      filters,
      onFiltersChange,
      columnFilterExtensions,
      columnFilterStateExtensions,
      isTableInRow,
      heightTable,
      hiddenColumnNames,
      defaultHiddenColumnNames,
      hiddenPagination,
      isFullRow = false,
      setColumnOrders,
      setParams,
      summaryColumns,
      SummaryColumnsComponent,
      grouping,
      groupSummaryItems,
      setColumnWidths,
      defaultColumnWidths,
      selection,
      setSelection,
      editComponent,
      isCustomPagination,
      editButtonLabel = BUTTON.HANDLE,
      detailComponent,
      onDeleteRow,
      expandedRowIds,
      onExpandedRowIdsChange,
      columnExtensions,
      columnEditExtensions,
      children,
      columnShowSort = [],
      totalRow,
      defaultColumnOrders,
      showSelectAll,
      cellStyle = { minHeight: 60 },
      headerCellComponent = (
        cellProps: TableHeaderRow.CellProps & { style?: React.CSSProperties },
      ) => <TableHeaderRow.Cell {...cellProps} />,
      editRowChangeForInline,
      tableWrapSx = { padding: [0, 1, 1.5] },
      formatGroupingItem,
      rowStyleByRowData,
      hiddenHeaderCell,
      headerCellStyles,
      sorting,
      onSortingChange,
      disableExcuteRowPath,
      showEditCommand = true,
      showAddCommand,
      addButtonLabel,
      showDeleteCommand,
      deleteButtonLabel = BUTTON.DELETE,
      cancelCommand,
      commitCommand,
    } = props;
    const isDesktop = useResponsive("up", "sm");

    const handleChangePage = (newPage: number) => {
      setParams?.({ ...params, page: newPage });
    };

    const handleChangeRowsPerPage = (value: number) => {
      setParams?.({ ...params, limit: value, page: 1 });
    };

    const handleChangeOrdering = (
      columnName: string,
      fieldName: string,
      direction: DIRECTION_SORT_TYPE,
    ) => {
      const sortField = handleChangeSortingTableToParams([{ columnName: fieldName, direction }]);
      const sortColumnName = handleChangeSortingTableToParams([
        { columnName: columnName, direction },
      ]);

      setParams?.({
        ...params,
        ordering: sortField.ordering,
        orderingParent: sortColumnName.ordering,
      });
    };

    const sortParams = { ...params } as { [key: string]: string | undefined };
    const pageParams = { ...params } as { [key: string]: number | undefined };

    const columnNames = reduce(
      columns,
      (prev: string[], cur: TColumn) => {
        return [...prev, cur.name];
      },
      [],
    );

    return (
      <TableWrap container heightTable={heightTable} sx={tableWrapSx}>
        <StyledTableContainer>
          {/* @ts-ignore */}
          <TableGrid rows={data.data} columns={columns}>
            {data.loading && <LinearProgress />}
            <SynctheticColumn for={columnNames} />
            <CreateModifyColumn />
            <HistoryTypeColumn />
            {children}
            <DragDropProvider />
            <SortingState
              sorting={
                sorting?.length
                  ? sorting
                  : handleChangeParamsToSortingTable(
                      sortParams.orderingParent || sortParams.ordering,
                    )
              }
              onSortingChange={
                sorting?.length
                  ? onSortingChange
                  : (value: Sorting[]) => {
                      if (columnShowSort) {
                        const columnSortIndex = columnShowSort.findIndex((column) => {
                          return column?.name === value[0].columnName;
                        });

                        if (columnSortIndex === -1) {
                          setParams?.({
                            ...params,
                            ...handleChangeSortingTableToParams(value),
                          });
                        }
                      } else {
                        setParams?.({
                          ...params,
                          ...handleChangeSortingTableToParams(value),
                        });
                      }
                    }
              }
            />
            <IntegratedSorting />

            <FilteringState
              filters={filters}
              onFiltersChange={onFiltersChange}
              columnExtensions={columnFilterStateExtensions}
            />
            <IntegratedFiltering columnExtensions={columnFilterExtensions} />

            {/* Paging */}
            {!hiddenPagination && (
              <PagingState
                currentPage={pageParams.page}
                onPageSizeChange={(pageSize: number) => handleChangeRowsPerPage(pageSize)}
                onCurrentPageChange={(page) => handleChangePage(page)}
                pageSize={pageParams.limit}
              />
            )}
            {!hiddenPagination && <CustomPaging totalCount={data.count} />}

            {editComponent && (
              <EditingState
                onCommitChanges={(changes) =>
                  changes.deleted && onDeleteRow && onDeleteRow(changes.deleted)
                }
                columnExtensions={columnEditExtensions}
              />
            )}

            {editRowChangeForInline && (
              <EditingState
                onCommitChanges={editRowChangeForInline}
                columnExtensions={columnEditExtensions}
              />
            )}
            {selection && <SelectionState selection={selection} onSelectionChange={setSelection} />}

            {grouping && <GroupingState grouping={grouping} />}
            {summaryColumns && (
              <SummaryState totalItems={summaryColumns} groupItems={groupSummaryItems} />
            )}
            {selection && <IntegratedSelection />}

            {grouping && <IntegratedGrouping />}
            {summaryColumns && (
              <IntegratedSummary
                i18nIsDynamicList
                calculator={
                  SummaryColumnsComponent
                    ? (type, rows, getValue) => {
                        return { type, rows, getValue };
                      }
                    : undefined
                }
              />
            )}
            <VirtualTable
              headComponent={(headProps) => (
                <VirtualTable.TableHead
                  {...headProps}
                  style={{ zIndex: isTableInRow ? 1 : 1000 }}
                />
              )}
              messages={{ noData: data.loading ? LABEL.LOADING_DATA : LABEL.NO_DATA }}
              height={
                heightTable
                  ? heightTable
                  : isFullRow
                    ? "auto"
                    : handleSizeTable(isDesktop, false).height
              }
              cellComponent={(cellProps) => {
                const blankGroupingSubCell = cellProps.column.name === grouping?.[0].columnName;
                const {
                  tableRow: { rowId = 0 },
                  column: { name: columnName },
                } = cellProps;

                //validate
                const columnStatus =
                  (rowId as number) >= 0 ? props.validationCellStatus?.[rowId]?.[columnName] : "";
                const valid = !columnStatus || columnStatus.isValid;
                // style for validate
                const style = {
                  ...(!valid ? { border: "1px solid red", marginTop: 2 } : null),
                };
                // set title for validate
                const title = valid
                  ? ""
                  : rowId
                    ? props.validationCellStatus?.[rowId][columnName].error
                    : "";

                // filter children and value
                const children = cellProps.children ?? "";
                let value = cellProps.value ?? "";
                // transfer value
                if (typeof value === "boolean") {
                  value = `${value}`;
                }

                return (
                  <VirtualTable.Cell
                    {...cellProps}
                    value={blankGroupingSubCell ? "" : cellProps.value}
                    title={title}
                  >
                    {columnName === "rowId" ? (
                      `${rowId}`
                    ) : (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        style={{ ...style, ...cellStyle }}
                        width={"100%"}
                      >
                        <Box display="block" width="100%">
                          {children || value}
                        </Box>
                      </Box>
                    )}
                  </VirtualTable.Cell>
                );
              }}
              columnExtensions={columnExtensions}
              rowComponent={(rowProps) => (
                <VirtualTable.Row {...rowProps} style={rowStyleByRowData?.(rowProps.row)} />
              )}
            />
            <TableColumnResizing
              columnWidths={columnWidths}
              minColumnWidth={60}
              onColumnWidthsChange={setColumnWidths}
              defaultColumnWidths={defaultColumnWidths}
            />
            <TableColumnReordering
              order={columnOrders}
              defaultOrder={defaultColumnOrders}
              onOrderChange={setColumnOrders}
            />
            {onFiltersChange ||
              (columnFilterExtensions && (
                <TableFilterRow
                  cellComponent={(cellProps) => (
                    <FilterCell {...cellProps} filterCellCompnent={props.filterCellCompnent} />
                  )}
                />
              ))}
            {/* Header */}
            {!hiddenHeaderCell && (
              <TableHeaderRow
                showSortingControls
                rowComponent={(restProps) => (
                  <TableHeaderRow.Row
                    {...restProps}
                    className="table-header-root"
                    sx={isTableInRow ? sxStyled.headerSubTable : headerCellStyles}
                  />
                )}
                cellComponent={(cellProps) => {
                  const isNumberColumn =
                    (cellProps.column as TColumn).type === "number" ||
                    (cellProps.column as TColumn).type === "float";
                  const columnSortIndex = columnShowSort.findIndex(
                    (column) => column.name === cellProps.column?.name,
                  );
                  return (
                    <>
                      {columnSortIndex !== -1 ? (
                        <CustomSortCellHeader
                          tableCellProps={{
                            ...cellProps,
                            style: { textAlign: isNumberColumn ? "center" : "start" },
                          }}
                          columnSortIndex={columnSortIndex}
                          columnShowSort={columnShowSort}
                          setSortInstance={handleChangeOrdering}
                          sortInstance={handleChangeParamsToSortingTable(sortParams?.ordering)}
                        />
                      ) : (
                        headerCellComponent({
                          ...cellProps,
                          style: { textAlign: isNumberColumn ? "center" : "start" },
                        })
                      )}
                    </>
                  );
                }}
              />
            )}
            {editRowChangeForInline && <TableEditRow />}
            {editRowChangeForInline && <TableInlineCellEditing selectTextOnEditStart={false} />}
            {(editComponent || editRowChangeForInline) && (
              <TableEditColumn
                showEditCommand={showEditCommand}
                showAddCommand={showAddCommand}
                showDeleteCommand={showDeleteCommand}
                width={
                  (showEditCommand ? 90 : 0) +
                  (showDeleteCommand ? 90 : 0) +
                  (showAddCommand ? 90 : 0)
                }
                messages={{
                  editCommand: editButtonLabel,
                  deleteCommand: deleteButtonLabel,
                  addCommand: addButtonLabel,
                  cancelCommand: cancelCommand,
                  commitCommand: commitCommand,
                }}
                cellComponent={(cellProps) => {
                  if (disableExcuteRowPath) {
                    let children = [...(cellProps.children || ([] as any))];
                    const isDisableExcute = (get(cellProps.row, disableExcuteRowPath) ?? "") !== "";
                    const firstChild = children.shift();
                    children = [
                      {
                        ...firstChild,
                        props: {
                          ...firstChild.props,
                          text: isDisableExcute ? "Done" : editButtonLabel,
                        },
                      },
                      ...children,
                    ];
                    return (
                      <TableEditColumn.Cell
                        {...cellProps}
                        style={
                          isDisableExcute ? { opacity: 0.2, pointerEvents: "none" } : undefined
                        }
                      >
                        {children}
                      </TableEditColumn.Cell>
                    );
                  }
                  return <TableEditColumn.Cell {...cellProps} />;
                }}
                commandComponent={(commandProps) => {
                  const variant =
                    commandProps.text === commitCommand || commandProps.text === cancelCommand
                      ? "text"
                      : "contained";
                  const color =
                    commandProps.text === cancelCommand
                      ? "inherit"
                      : commandProps.text === deleteButtonLabel
                        ? "error"
                        : commandProps.text === editButtonLabel
                          ? "secondary"
                          : "primary";
                  return (
                    <Button
                      variant={variant}
                      onClick={commandProps.onExecute}
                      size="small"
                      style={styles.editRowButton}
                      color={color}
                    >
                      {commandProps.text}
                    </Button>
                  );
                }}
              />
            )}
            {selection && <TableSelection showSelectAll={showSelectAll} showSelectionColumn />}
            <TableColumnVisibility
              hiddenColumnNames={hiddenColumnNames}
              defaultHiddenColumnNames={defaultHiddenColumnNames}
            />
            {detailComponent && (
              <RowDetailState
                expandedRowIds={expandedRowIds}
                onExpandedRowIdsChange={onExpandedRowIdsChange}
              />
            )}
            {detailComponent && (
              <TableRowDetail
                cellComponent={(props) => <TableRowDetail.Cell {...props} style={styles.cell} />}
                toggleColumnWidth={55}
                contentComponent={detailComponent}
                toggleCellComponent={(props) => (
                  <TableRowDetail.ToggleCell
                    {...props}
                    style={{
                      ...(props as any).style,
                      transform: props.expanded ? "rotate(180deg)" : "rotate(-90deg)",
                    }}
                  />
                )}
              />
            )}

            {editComponent && <TableEditingPopup content={editComponent} />}

            {summaryColumns && (
              <TableSummaryRow
                formatlessSummaryTypes={["total"]}
                itemComponent={
                  SummaryColumnsComponent
                    ? (itemProps) => {
                        const summaryItemProps = itemProps as any;
                        return (
                          <SummaryColumnsComponent
                            column={summaryItemProps.children?.props?.column}
                            row={totalRow}
                            rows={summaryItemProps.value.rows}
                            type={summaryItemProps.value.type}
                            value={summaryItemProps.value}
                          />
                        );
                      }
                    : (itemProps) => <TableSummaryRow.Item {...itemProps} />
                }
              />
            )}
            {grouping && (
              <TableGroupRow
                showColumnsWhenGrouped
                cellComponent={(cellProps) => {
                  return <SummaryCellComponent {...cellProps} />;
                }}
                contentComponent={(cellProps) => {
                  return (
                    <Tooltip title={cellProps.row.value}>
                      <Typography fontWeight={500} fontSize="0.82rem" component="span">
                        {cellProps.row.value}
                      </Typography>
                    </Tooltip>
                  );
                }}
                summaryCellComponent={(cellProps) => {
                  const children = (cellProps as any).children;
                  const columnName = children?.props?.column.name;
                  const row: any = {
                    [children?.props?.column.name]: children.props.columnSummaries[0].value,
                  };
                  const value = children.props.columnSummaries[0].value;

                  return (
                    <TableGroupRow.SummaryCell {...cellProps}>
                      <GroupItemColumns
                        value={
                          formatGroupingItem
                            ? formatGroupingItem({ columnName, value, row })
                            : children?.props.columnSummaries[0].value
                        }
                      />
                    </TableGroupRow.SummaryCell>
                  );
                }}
              />
            )}
            {!hiddenPagination && (
              <PagingPanel
                pageSizes={PAGE_SIZES}
                containerComponent={(paginationProps) => (
                  <MPagination {...paginationProps} isCustom={isCustomPagination} />
                )}
              />
            )}
            <TableFixedColumns
              leftColumns={props.fixLeftColumns}
              rightColumns={props.fixRightColumns}
            />
          </TableGrid>
        </StyledTableContainer>
      </TableWrap>
    );
  },
  areEqual,
);

const SummaryCellComponent = styled(TableGroupRow.Cell)(() => ({
  ".Container-wrapper": {
    backgroundColor: "unset !important",
    zIndex: "1 !important",
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }: { theme: Theme }) => ({
  padding: 2,
  border: "none",
  "& .TableContainer-root": {
    "::-webkit-scrollbar-track, ::-webkit-scrollbar-thumb": {
      background: "transparent",
      borderRadius: 10,
      transition: "all 1s ease",
    },
    "&:hover": {
      "::-webkit-scrollbar-thumb": {
        background: theme.palette.mode === "light" ? "#B4BCC2" : "#404E5A",
      },
    },
    "::-webkit-scrollbar-corner": {
      background: "transparent",
    },
    ".MuiTableCell-head": {
      backgroundColor:
        theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    ".TableEditCommandCell-cell": {
      padding: "0px",
    },
  },
}));

const TableWrap = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "heightTable",
})(({ heightTable }: { heightTable?: number }) => ({
  "table:nth-of-type(2)": {
    marginBottom: !!heightTable && "0px !important",
  },
}));

const sxStyled: TSx<"headerSubTable"> = {
  headerSubTable: {
    th: {
      backgroundColor: (theme) => `${theme?.palette?.primary?.main} !important`,
      color: (theme) => theme?.palette?.background?.paper,
      zIndex: 0,
    },
  },
};

const styles: TStyles<"editRowButton" | "cell"> = {
  editRowButton: { boxShadow: "none", marginRight: 1 },
  cell: { paddingTop: 2, paddingBottom: 12 },
};
