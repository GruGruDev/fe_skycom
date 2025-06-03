import { WrapPage } from "components/Page";
import { TableWrapper } from "components/Table";
import {
  BATCH_INVENTORY_COLUMNS,
  BATCH_INVENTORY_COLUMN_WIDTHS,
} from "constants/warehouse/columns";
import useTable from "hooks/useTable";

export interface TBatchInventory {
  variant_batch_id: string;
  batch_name: string;
  expire_date: null;
  first_inventory: number;
  c_import: number;
  c_export: number;
  last_inventory: number;
}

interface Props {
  row: TBatchInventory[];
}

const BatchInventoryTable = ({ row }: Props) => {
  const tableProps = useTable({
    columns: BATCH_INVENTORY_COLUMNS,
    columnWidths: BATCH_INVENTORY_COLUMN_WIDTHS,
  });

  return (
    <WrapPage sx={{ my: 2 }}>
      <TableWrapper
        {...tableProps}
        isFullRow
        cellStyle={{ height: 40 }}
        data={{ data: row, count: row.length }}
        hiddenPagination
        isTableInRow
      />
    </WrapPage>
  );
};

export default BatchInventoryTable;
