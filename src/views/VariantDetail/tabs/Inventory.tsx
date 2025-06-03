import { warehouseApi } from "apis/warehouse";
import { WrapPage } from "components/Page";
import { TableWrapper } from "components/Table";
import {
  BATCH_INVENTORY_COLUMN_WIDTHS,
  BATCH_INVENTORY_COLUMNS,
  VARIANT_INVENTORY_COLUMNS,
  VARIANT_INVENTORY_COLUMNS_WIDTHS,
} from "constants/product/columns";
import useTable from "hooks/useTable";
import { useCallback, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TSheetDetail } from "types/Sheet";
import Paper from "@mui/material/Paper";

const Inventory = ({ variantId }: { variantId?: string }) => {
  const tableProps = useTable({
    columns: VARIANT_INVENTORY_COLUMNS,
    columnWidths: VARIANT_INVENTORY_COLUMNS_WIDTHS,
    params: { limit: 30, page: 1, ordering: "-created" },
  });

  const [inventory, setInventory] = useState<TDGridData<TSheetDetail>>({
    count: 0,
    data: [],
    loading: false,
  });

  const getAllInventory = useCallback(async () => {
    if (!variantId) return;
    setInventory((prev) => ({ ...prev, loading: true }));
    const res = await warehouseApi.get<TSheetDetail>({
      params: {
        limit: 50,
        page: 1,
        variant: variantId,
      },
      endpoint: "inventory-with-variant/",
    });
    if (res?.data) {
      const { results = [], count = 0 } = res.data;
      setInventory((prev) => ({ ...prev, loading: false, data: results, count }));
    } else {
    }
    setInventory((prev) => ({ ...prev, loading: false }));
  }, [variantId]);

  useEffect(() => {
    getAllInventory();
  }, [getAllInventory]);

  return (
    <WrapPage style={styles.wrapper}>
      <TableWrapper
        {...tableProps}
        data={{ ...inventory, data: inventory.data?.[0]?.batches || [] }}
        cellStyle={{ height: 40 }}
        detailComponent={({ row }) => (
          <Paper elevation={2} sx={{ mt: 1, "& > div": { p: 0 } }}>
            <TableWrapper
              columns={BATCH_INVENTORY_COLUMNS}
              columnWidths={BATCH_INVENTORY_COLUMN_WIDTHS}
              data={{ loading: false, count: row.inventories?.length, data: row.inventories || [] }}
              hiddenPagination
              isTableInRow
              heightTable={(row.inventories?.length || 0) > 3 ? 350 : 200}
              cellStyle={{ height: 40 }}
            />
          </Paper>
        )}
      />
    </WrapPage>
  );
};

export default Inventory;

const styles = {
  wrapper: { marginTop: 24 },
};
