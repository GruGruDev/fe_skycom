import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { warehouseApi } from "apis/warehouse";
import { NoDataPanel } from "components/NoDataPanel";
import { WrapPage } from "components/Page";
import { AttributeColumn, TableWrapper } from "components/Table";
import ProductInfoColumn from "components/Table/columns/ProductColumn";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import { SHEET_TYPE_VALUE } from "constants/warehouse";
import {
  HISTORY_WAREHOUSE_COLUMNS,
  HISTORY_WAREHOUSE_COLUMNS_SHOW_SORT,
  HISTORY_WAREHOUSE_COLUMN_WIDTHS,
} from "constants/warehouse/columns";
import { SHEET_LABEL } from "constants/warehouse/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useResponsive from "hooks/useResponsive";
import useTable from "hooks/useTable";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TAttribute } from "types/Attribute";
import { TDGrid, TDGridData } from "types/DGrid";
import { TWarehouseHistory } from "types/Sheet";
import { TUser } from "types/User";
import { fNumber } from "utils/number";
import { ConfirmInfoColumn } from "views/Warehouse/components/columns/ConfirmInfoColumn";
import { LogSheetStatusColumn } from "views/Warehouse/components/columns/LogSheetStatusColumn";
import { SheetInfoColumn } from "views/Warehouse/components/columns/SheetInfoColumn";
import { SheetNoteColumn } from "views/Warehouse/components/columns/SheetNoteColumn";

const Sheets = ({
  tableProps,
  variantId,
}: {
  tableProps?: Partial<TDGrid>;
  variantId?: string;
}) => {
  const isDesktop = useResponsive("up", "sm");

  const tableColumnProps = useTable({
    columns: HISTORY_WAREHOUSE_COLUMNS,
    columnWidths: HISTORY_WAREHOUSE_COLUMN_WIDTHS,
    columnShowSort: HISTORY_WAREHOUSE_COLUMNS_SHOW_SORT,
    hiddenColumnNames: ["product_variant"],
    params: { limit: 30, page: 1, ordering: "-created" },
  });

  const { warehouses, inventoryReasons } = useAppSelector(getDraftSafeSelector("warehouses"));
  const { users } = useAppSelector(getDraftSafeSelector("users"));

  const [logs, setLogs] = useState<TDGridData<TWarehouseHistory>>({
    data: [],
    count: 0,
    loading: false,
  });
  const getInventoryLogs = useCallback(async () => {
    if (!variantId) return;

    const res = await warehouseApi.get<TWarehouseHistory>({
      endpoint: `inventory-logs/`,
      params: { variant: variantId, limit: 1000, page: 1 },
    });
    if (res.data) {
      const { results = [], count = 0 } = res.data;
      setLogs((prev) => ({ ...prev, data: results, count, loading: false }));
      return;
    }

    setLogs((prev) => ({ ...prev, loading: false }));
  }, [variantId]);

  useEffect(() => {
    getInventoryLogs();
  }, [getInventoryLogs]);

  const warehouseAttributes = warehouses.map((item) => {
    return { id: item.id, name: item.name };
  }) as TAttribute[];

  return isDesktop ? (
    <WrapPage style={styles.wrapper}>
      <TableWrapper
        {...tableColumnProps}
        {...tableProps}
        cellStyle={{ height: SIMPLE_CELL_HEIGHT }}
        data={logs}
      >
        <SheetInfoColumn />
        <AttributeColumn attributes={inventoryReasons} for={["change_reason"]} />
        <AttributeColumn attributes={warehouseAttributes} for={["warehouse"]} />
        <ProductInfoColumn for={["product_variant"]} />
        <LogSheetStatusColumn />
        <ConfirmInfoColumn />
        <SheetNoteColumn />
      </TableWrapper>
    </WrapPage>
  ) : (
    <Stack direction={"column"} spacing={1}>
      {logs.data.length ? (
        logs.data.map((item, index) => (
          <MSheetItem
            {...item}
            key={index}
            warehouseAttributes={warehouseAttributes}
            users={users}
          />
        ))
      ) : (
        <NoDataPanel showImage />
      )}
    </Stack>
  );
};

export default Sheets;

const styles = {
  wrapper: { marginTop: 24 },
  priceChip: { fontSize: "0.7rem" },
};

const MSheetItem = (
  item: TWarehouseHistory & { warehouseAttributes: TAttribute[]; users: TUser[] },
) => {
  const {
    product_variant_batch,
    quantity,
    quantity_actual,
    quantity_system,
    sheet_code,
    type,
    warehouse,
    sheet,
  } = item;
  const warehouseName = item.warehouseAttributes.find((item) => item.id === warehouse.toString());
  const confirmByName = item.users.find((u) => u.id === sheet?.confirm_by);
  return (
    <Paper elevation={1} sx={{ borderRadius: "3px", p: 1 }}>
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <Chip
          size={"small"}
          label={<Link to={`/warehouse/sheet/${sheet?.id}?type=${type}`}>{sheet_code}</Link>}
          color="success"
          style={styles.priceChip}
        />
        <Chip size={"small"} label={SHEET_TYPE_VALUE[type]} color="info" style={styles.priceChip} />
        <Chip
          size={"small"}
          label={fNumber(quantity)}
          color={type === "IP" ? "success" : type === "EP" ? "error" : "warning"}
          style={styles.priceChip}
        />
        {quantity_system && (
          <Chip
            size={"small"}
            label={fNumber(quantity_system)}
            color={"error"}
            style={styles.priceChip}
          />
        )}
        {quantity_actual && (
          <Chip
            size={"small"}
            label={fNumber(quantity_actual)}
            color="error"
            style={styles.priceChip}
          />
        )}
      </Stack>
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <Stack>
          <Typography fontSize={"0.7rem"} color="grey">
            {SHEET_LABEL.warehouse}
          </Typography>
          <Typography fontSize={"0.825rem"}>{warehouseName?.name}</Typography>
        </Stack>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Stack>
          <Typography fontSize={"0.7rem"} color="grey">
            {SHEET_LABEL.batch}
          </Typography>
          <Typography fontSize={"0.825rem"}>{product_variant_batch.name}</Typography>
        </Stack>
        <Stack>
          <Typography fontSize={"0.7rem"} color="grey">
            {SHEET_LABEL.confirm_by}
          </Typography>
          <Typography fontSize={"0.825rem"}>{confirmByName?.name || "--"}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};
