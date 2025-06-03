import { SxProps, Theme } from "@mui/material";
import Stack from "@mui/material/Stack";
import { GridLineLabel, Span } from "components/Texts";
import { ORDER_STATUS } from "constants/order";
import { ORDER_LABEL } from "constants/order/label";
import find from "lodash/find";
import { PaletteColor } from "types/Styles";
import { TUser } from "types/User";
import { maskedPhone } from "utils/strings";

const OrderItem = ({ value, users }: { value: any; users: TUser[] }) => {
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
  const userLabel = (userId: string) => find(users, (item) => item.id === userId)?.name;

  return (
    <Stack spacing={1}>
      {value.status && (
        <Span color={colors[value.status || "draft"] as PaletteColor} sx={styles.chip}>
          {labels[value.status || "draft"] || "---"}
        </Span>
      )}

      {value?.history_user && (
        <GridLineLabel label={`${ORDER_LABEL.created_by}:`} value={userLabel(value.history_user)} />
      )}

      {/* {isNumber(value?.value_cross_sale) && (
        <GridLineLabel
          label={`${ORDER_LABEL.value_cross_sale}:`}
          value={fNumber(value.value_cross_sale)}
        />
      )} */}

      {value?.name_shipping && (
        <GridLineLabel label={`${ORDER_LABEL.name_shipping}:`} value={value.name_shipping} />
      )}

      {value?.phone_shipping && (
        <GridLineLabel
          label={`${ORDER_LABEL.phone_shipping}:`}
          value={maskedPhone(value.phone_shipping)}
        />
      )}

      {value?.note && <GridLineLabel label={`${ORDER_LABEL.note}:`} value={value.note} />}

      {value?.delivery_note && (
        <GridLineLabel label={`${ORDER_LABEL.delivery_note}:`} value={value.delivery_note} />
      )}

      {value?.source && (
        <GridLineLabel label={`${ORDER_LABEL.source}:`} value={value.source?.name} />
      )}
    </Stack>
  );
};

export default OrderItem;

const styles: { [key: string]: SxProps<Theme> } = {
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};
