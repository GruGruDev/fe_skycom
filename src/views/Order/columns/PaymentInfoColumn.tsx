import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import { GridLineLabel } from "components/Texts";
import { ORDER_PAYMENT_LABEL } from "constants/order";
import { TOrderV2 } from "types/Order";
import { fNumber } from "utils/number";
import PaymentModal from "../components/OrderForm/HistoryTimeline/PaymentModal";
import { useState } from "react";
import { ORDER_LABEL } from "constants/order/label";
import useAuth from "hooks/useAuth";
import { checkPermission } from "utils/roleUtils";
import { ROLE_ORDER, ROLE_TAB } from "constants/role";
import useResponsive from "hooks/useResponsive";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  onRefresh: () => void;
}

const COLUMN_NAMES = ["payments"];

export const PaymentsInfoColumn = ({ for: columnNames = [], onRefresh, ...props }: Props) => {
  const Formatter = ({ row }: { row?: TOrderV2 }) => {
    const { user } = useAuth();
    const isDesktop = useResponsive("up", "sm");

    const [open, setOpen] = useState(false);

    const isControlPayment = checkPermission(
      user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.PAYMENT],
      user,
    ).isMatch;

    const handleUpdateSuccess = () => {
      setOpen(false);
      onRefresh();
    };

    const renderPayment = () => {
      if (row?.payments) {
        return (
          <Stack>
            {isControlPayment && (
              <>
                <Link
                  onClick={() => setOpen(true)}
                  sx={{ cursor: "pointer" }}
                  color="secondary"
                  fontSize={"0.8rem"}
                >{`${ORDER_LABEL.payment_detail} >>`}</Link>
                <Dialog open={open} maxWidth="lg" sx={{ ".MuiPaper-root": { width: "100%" } }}>
                  <PaymentModal
                    onClose={() => setOpen(false)}
                    data={row.payments}
                    onRefresh={handleUpdateSuccess}
                    disabled={row.status !== "completed"}
                  />
                </Dialog>
              </>
            )}
            {isDesktop
              ? row.payments.map((item) => {
                  const payment = ORDER_PAYMENT_LABEL[item.type];
                  return (
                    <Stack key={item.id} direction="row" flexWrap="nowrap">
                      <GridLineLabel
                        label={
                          <Typography
                            sx={{ fontSize: "0.8rem !important" }}
                            color={payment.color}
                          >{`${payment.value}:`}</Typography>
                        }
                        value={fNumber(item.price_from_order)}
                      />
                    </Stack>
                  );
                })
              : null}
          </Stack>
        );
      }
    };

    return (
      <Stack gap={1} direction="row" alignItems="center">
        <GridLineLabel label={``} value={renderPayment()} />
      </Stack>
    );
  };

  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};
