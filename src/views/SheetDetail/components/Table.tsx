import { TableWrapper } from "components/Table";
import ProductInfoColumn from "components/Table/columns/ProductColumn";
import { BATCH_COLUMNS, BATCH_COLUMN_WIDTHS } from "constants/warehouse/columns";
import useTable from "hooks/useTable";
import { TDGridData } from "types/DGrid";
import { TSheetDetail, TSheetType } from "types/Sheet";

interface Props {
  tableData?: TDGridData<Partial<TSheetDetail>>;
  type?: TSheetType;
}

const Table = (props: Props) => {
  const tableProps = useTable({
    columns: BATCH_COLUMNS,
    columnWidths: BATCH_COLUMN_WIDTHS,
    hiddenColumnNames: props.type === "CK" ? ["quantity"] : ["quantity_system", "quantity_actual"],
  });

  return (
    <TableWrapper
      data={props.tableData}
      showSelectAll
      hiddenPagination
      heightTable={700}
      cellStyle={{ height: 100 }}
      {...tableProps}
    >
      <ProductInfoColumn for={["product_variant"]} />
    </TableWrapper>
  );
};

export default Table;
