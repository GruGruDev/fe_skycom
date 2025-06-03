import { SxProps, Theme } from "@mui/material";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { GridLineLabel, Span } from "components/Texts";
import { ORDER_PAYMENT_LABEL, ORDER_STATUS } from "constants/order";
import { ORDER_LABEL } from "constants/order/label";
import { TOrderV2, TPaymentV2 } from "types/Order";
import { PaletteColor } from "types/Styles";
import { fNumber } from "utils/number";

const OrderItems = ({ data }: { data: TOrderV2 }) => {
  const labels = ORDER_STATUS.reduce(
    (prev: { [key: string]: string }, current) => ({ ...prev, [current.value]: current.label }),
    {},
  );
  const colors = ORDER_STATUS.reduce(
    (prev: { [key: string]: string | undefined }, current) => ({
      ...prev,
      [current.value]: current.color,
    }),
    {},
  );

  return (
    <Stack alignItems="flex-start" gap={1}>
      <Span color={colors[data.status || "draft"] as PaletteColor} sx={styles.chip}>
        {labels[data.status || "draft"] || "---"}
      </Span>

      {data.cancel_reason && (
        <GridLineLabel label={`${ORDER_LABEL.cancel_reason}:`} value={data.cancel_reason?.name} />
      )}

      <GridLineLabel
        label={`${ORDER_LABEL.order_key}:`}
        value={<Link href={`${window.location.origin}/orders/${data.id}`}>{data.order_key}</Link>}
      />

      <GridLineLabel
        label={`${ORDER_LABEL.price_total_order_actual}:`}
        value={fNumber(data.price_total_order_actual) || "---"}
      />

      <GridLineLabel label={`${ORDER_LABEL.source_name}:`} value={data.source?.name || "---"} />

      <Stack gap={1}>
        {data.payments.map((item: TPaymentV2) => {
          const payment = ORDER_PAYMENT_LABEL[item.type];
          return (
            <Stack key={item.id} gap={1} direction="row" flexWrap="nowrap">
              <GridLineLabel
                label={
                  <Span color={payment.color} sx={styles.chip}>
                    {payment.value}:
                  </Span>
                }
                value={fNumber(item.price_from_order)}
              />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default OrderItems;

const styles: { [key: string]: SxProps<Theme> } = {
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};
