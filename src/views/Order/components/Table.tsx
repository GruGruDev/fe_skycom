import { AttributeColumn, LinkColumn, TableWrapper } from "components/Table";
import { HistoryChangeReasonColumn } from "components/Table/columns/HistoryChangeReasonColumn";
import StatusColumn from "components/Table/columns/StatusColumn";
import { ORDER_STATUS } from "constants/order";
import { TDGrid } from "types/DGrid";
import { TOrderStatusValue } from "types/Order";
import { onChangeHistoryFields } from "utils/order/onChangeHistoryFields";
import { AddressShippingColumn } from "../columns/AddressShippingColumn";
import AddSheetColumn from "../columns/AddSheetColumn";
import { CancelInfoColumn } from "../columns/CancelInfoColumn";
import { CreateInfoColumn } from "../columns/CreateInfoColumn";
import { CustomerCarrierColumn } from "../columns/CustomerCarrierColumn";
import { CustomerNameColumn } from "../columns/CustomerNameColumn";
import { CustomerPhoneColumn } from "../columns/CustomerPhoneColumn";
import { GeneralInfoColumn } from "../columns/GeneralInfoColumn";
import { HandleInfoColumn } from "../columns/HandleInfoColumn";
import { InfoColumn } from "../columns/InfoColumn";
import { PaymentsInfoColumn } from "../columns/PaymentInfoColumn";
import { PriceInfoColumn } from "../columns/PriceInfoColumn";
import { PrintInfoColumn } from "../columns/PrintInfoColumn";
import { SheetColumn } from "../columns/SheetColumn";

export interface OrderTableType extends Partial<TDGrid> {
  tabName?: TOrderStatusValue;
  onRefresh: () => void;
}
const OrderTable = (props: OrderTableType) => {
  return (
    <TableWrapper {...props}>
      <LinkColumn
        for={["order_key"]}
        linkFromRow={(row) => `${window.location.origin}/orders/${row?.id}`}
      />
      <AddSheetColumn onRefresh={props.onRefresh} />
      <SheetColumn />
      <AttributeColumn for={["tags"]} />
      <AttributeColumn for={["source"]} />
      <InfoColumn />
      <StatusColumn options={ORDER_STATUS} for={["status"]} />
      <GeneralInfoColumn />
      <CreateInfoColumn />
      <HandleInfoColumn />
      <PriceInfoColumn />
      <PaymentsInfoColumn onRefresh={props.onRefresh} />
      <CancelInfoColumn />
      <AddressShippingColumn />
      <CustomerCarrierColumn />
      <CustomerNameColumn />
      <CustomerPhoneColumn />
      <HistoryChangeReasonColumn
        getOldHistoryItem={(idx) => props.data?.data[idx]}
        historyFieldChangeString={onChangeHistoryFields}
      />

      <PrintInfoColumn />
    </TableWrapper>
  );
};

export default OrderTable;
