import { WrapPage } from "components/Page";
import { TableWrapper } from "components/Table";
import { ImagesColumn } from "components/Table/columns/ImagesColumn";
import {
  VARIANT_INVENTORY_COLUMNS,
  VARIANT_INVENTORY_COLUMN_WIDTHS,
} from "constants/warehouse/columns";
import useTable from "hooks/useTable";
import BatchInventoryTable from "./BatchInventoryTable";

export interface TVariantInventory {
  variant_id: string;
  variant_name: string;
  variant_SKU_code: string;
  variant_first_inventory: number;
  variant_last_inventory: number;
  variant_c_import: number;
  variant_c_export: number;
  neo_price?: number;
  sale_price?: number;
  batches: {
    variant_batch_id: string;
    batch_name: string;
    expire_date: null;
    warehouse_name: string;
    first_inventory: number;
    c_import: number;
    c_export: number;
    last_inventory: number;
  }[];

  image: {};
}

interface Props {
  row: TVariantInventory[];
}

const VariantInventoryTable = ({ row }: Props) => {
  const tableProps = useTable({
    columns: VARIANT_INVENTORY_COLUMNS,
    columnWidths: VARIANT_INVENTORY_COLUMN_WIDTHS,
  });

  return (
    <WrapPage sx={{ my: 2 }}>
      <TableWrapper
        {...tableProps}
        isFullRow
        data={{ data: row, count: row.length }}
        hiddenPagination
        isTableInRow
        cellStyle={{ height: 40 }}
        detailComponent={({ row }) => <BatchInventoryTable row={row.batches} />}
      >
        <ImagesColumn onlyOne />
      </TableWrapper>
    </WrapPage>
  );
};

export default VariantInventoryTable;
