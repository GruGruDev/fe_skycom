import { AttributeColumn, LinkColumn, TableWrapper } from "components/Table";
import { AddressColumn } from "components/Table/columns/AddressColumn";
import { PhoneColumn } from "components/Table/columns/PhoneColumn";
import { TDGrid } from "types/DGrid";
import { CareInfoColumn } from "./columns/CareInfoColumn";
import { GeneralInfoColumn } from "./columns/GeneralInfoColumn";
import { GroupSourceInfoColumn } from "./columns/GroupSourceInfoColumn";
import { InfoColumn } from "./columns/InfoColumn";
import { OrderInfoColumn } from "./columns/OrderInfoColumn";
import StatusColumn from "components/Table/columns/StatusColumn";
import { TSelectOption } from "types/SelectOption";

interface Props extends Partial<TDGrid> {
  rankOptions: TSelectOption[];
}

const Table = (props: Props) => {
  return (
    <TableWrapper {...props}>
      <InfoColumn />
      <LinkColumn
        for={["name"]}
        linkFromRow={(row) => `${window.location.origin}/customer/${row.id}`}
      />
      <GeneralInfoColumn rankOptions={props.rankOptions} />
      <StatusColumn for={["rank"]} options={props.rankOptions} />
      <OrderInfoColumn />
      <CareInfoColumn />
      <PhoneColumn />
      <AddressColumn />
      <GroupSourceInfoColumn />
      <AttributeColumn for={["tags"]} />
      <AttributeColumn for={["groups"]} />
    </TableWrapper>
  );
};

export default Table;
