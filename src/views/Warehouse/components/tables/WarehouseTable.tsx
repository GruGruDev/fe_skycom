import { LinkColumn, TableWrapper } from "components/Table";
import { AddressColumn } from "components/Table/columns/AddressColumn";
import { TDGrid } from "types/DGrid";
import { ManagerInfoColumn } from "../columns/ManagerInfoColumn";

export interface WarehouseTableType extends Partial<TDGrid> {
  onRefresh?: () => void;
}

const WarehouseTable = (props: WarehouseTableType) => {
  return (
    <TableWrapper {...props}>
      <LinkColumn
        for={["name"]}
        linkFromRow={(row) => `${window.location.origin}/warehouse/${row?.id}`}
      />
      <ManagerInfoColumn />
      <AddressColumn />
    </TableWrapper>
  );
};

export default WarehouseTable;
