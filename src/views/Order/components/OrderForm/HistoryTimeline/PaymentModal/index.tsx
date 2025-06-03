import { DialogContent } from "@mui/material";
import { HeaderDialog } from "components/Dialogs";
import { TableWrapper } from "components/Table";
import { ORDER_PAYMENT_COLUMN, ORDER_PAYMENT_COLUMN_WIDTH } from "constants/order/columns";
import { ORDER_LABEL } from "constants/order/label";
import useTable from "hooks/useTable";
import { useMemo } from "react";
import { TDGridData } from "types/DGrid";
import { TOrderPaymentHistory, TPaymentV2 } from "types/Order";
import { ConfirmColumn } from "./columns/ConfirmColumn";
import { PaymentImageColumn } from "./columns/PaymentImageColumn";
import { TypeColumn } from "./columns/TypeColumn";

export type PaymentModalProps = {
  onClose?: () => void;
  data: Partial<TPaymentV2>[];
  onRefresh: () => void;
  disabled?: boolean;
};

const PaymentModal = (props: PaymentModalProps) => {
  const { onClose, data, onRefresh, disabled } = props;

  const { ...tableProps } = useTable({
    columns: ORDER_PAYMENT_COLUMN,
    columnWidths: ORDER_PAYMENT_COLUMN_WIDTH,
  });

  const tableData = useMemo(() => {
    return {
      data,
      count: data.length || 0,
      loading: false,
    } as TDGridData<Partial<TOrderPaymentHistory>>;
  }, [data]);

  return (
    <>
      <HeaderDialog
        title={ORDER_LABEL.payment}
        onClose={onClose}
        subTitle={ORDER_LABEL.auto_save}
      />
      <DialogContent>
        <TableWrapper data={tableData} {...tableProps} hiddenPagination heightTable={200}>
          <TypeColumn />
          <ConfirmColumn onRefresh={onRefresh} disabled={disabled} />
          <PaymentImageColumn onRefresh={onRefresh} />
        </TableWrapper>
      </DialogContent>
    </>
  );
};

export default PaymentModal;
