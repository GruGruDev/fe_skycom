import Dialog from "@mui/material/Dialog";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { PAYMENT_TYPE_VALUE } from "constants/order";
import { ORDER_LABEL } from "constants/order/label";
import { useState } from "react";
import { TOrderPaymentDetail } from "types/Order";
import { fNumber } from "utils/number";
import PaymentModal from "./PaymentModal";
import { findOption } from "utils/option";
import useAuth from "hooks/useAuth";
import { checkPermission } from "utils/roleUtils";
import { ROLE_ORDER, ROLE_TAB } from "constants/role";

const PaymentItem = ({
  value,
  onRefresh,
  disabled,
}: {
  value: Partial<TOrderPaymentDetail>;
  onRefresh: () => void;
  disabled?: boolean;
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const { history = [], type, price_from_order = 0 } = value;

  const isControlPayment = checkPermission(
    user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.PAYMENT],
    user,
  ).isMatch;

  const handleUpdateSuccess = () => {
    setOpen(false);
    onRefresh();
  };

  return (
    <Stack spacing={1}>
      {isControlPayment && (
        <>
          <Dialog open={open} maxWidth="lg" sx={{ ".MuiPaper-root": { width: "100%" } }}>
            <PaymentModal
              onClose={() => setOpen(false)}
              data={history}
              onRefresh={handleUpdateSuccess}
              disabled={disabled}
            />
          </Dialog>

          <Link
            onClick={() => setOpen(true)}
            sx={{ cursor: "pointer" }}
            color="secondary"
            fontSize={"0.82rem"}
          >
            {`${ORDER_LABEL.payment_detail} >>`}
          </Link>
        </>
      )}

      {price_from_order && (
        <GridLineLabel
          label={`${ORDER_LABEL.price_from_order}:`}
          value={fNumber(price_from_order)}
        />
      )}

      {type && (
        <GridLineLabel
          label={"PTTT:"}
          value={findOption(PAYMENT_TYPE_VALUE, type, "value")?.label}
        />
      )}
    </Stack>
  );
};

export default PaymentItem;
