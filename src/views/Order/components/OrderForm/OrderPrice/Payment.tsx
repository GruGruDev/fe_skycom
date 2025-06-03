import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NumberInputField } from "components/Fields";
import { LabelInfo } from "components/Texts";
import { PAYMENT_TYPE_VALUE } from "constants/order";
import { ORDER_LABEL } from "constants/order/label";
import map from "lodash/map";
import { memo } from "react";
import { FieldErrors } from "react-hook-form";
import { OrderDTOV2, OrderPaymentDTO, TOrderPaymentTypeValue } from "types/Order";
import { PaletteColor, TStyles } from "types/Styles";

interface PaymentType extends Partial<OrderDTOV2> {
  onChange: (key: keyof OrderDTOV2, value?: string | number | Partial<OrderPaymentDTO>[]) => void;
  errors: FieldErrors<OrderDTOV2>;
  loading?: boolean;
  isEdit?: boolean;
  orderID?: string;
}

const PaymentType = (props: PaymentType) => {
  const {
    onChange,
    payments,
    isEdit,
    errors,
    price_total_order_actual = 0,
    price_pre_paid = 0,
  } = props;

  const onChangePayment = (value: Partial<OrderPaymentDTO>[]) => {
    const valueClone = [...value];
    const transfer = value.find((item) => item.type === "DIRECT_TRANSFER");
    const { price_from_order = 0 } = transfer || {};
    const price_after_paid = price_total_order_actual - price_from_order;

    // khi số tiền chuyển khoản > số tiền cần thanh toán => không cập nhật số tiền chuyển khoản
    if (price_after_paid > price_total_order_actual) {
      return;
    }

    // khi chỉ có 1 phương thức thanh toán CHUYỂN KHOẢNG & số tiền chuyển khoảng là 1 phần của tổng tiền thì thêm vào phương thức COD
    if (value.length === 1 && transfer && price_total_order_actual > price_from_order) {
      valueClone.push({ type: "COD", price_from_order: price_after_paid });
    }

    onChange("price_pre_paid", price_from_order);
    onChange("price_after_paid", price_after_paid);
    onChange("payments", valueClone);
  };

  return (
    <Grid container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo>{ORDER_LABEL.payment_type}</LabelInfo>
        <FormHelperText error>
          {(errors.payments as { message: string } | undefined)?.message}
        </FormHelperText>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Stack>
          {price_total_order_actual === 0 ? (
            <Typography fontSize={"0.82rem"}>{ORDER_LABEL.cod}</Typography>
          ) : (
            map(PAYMENT_TYPE_VALUE, (item, index) => (
              <PaymentTypeItem
                key={index}
                item={item}
                disabled={!isEdit}
                payments={payments}
                onChange={onChangePayment}
                price_pre_paid={price_pre_paid}
                price_total_order_actual={price_total_order_actual}
              />
            ))
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default memo(PaymentType);

interface PaymentTypeItem {
  item: {
    label: string;
    value: TOrderPaymentTypeValue;
    color?: PaletteColor;
  };
  disabled?: boolean;
  payments?: Partial<OrderPaymentDTO>[];
  onChange: (value: Partial<OrderPaymentDTO>[]) => void;
  price_total_order_actual: number;
  price_pre_paid: number;
}

const PaymentTypeItem = (props: PaymentTypeItem) => {
  const {
    item,
    disabled,
    payments = [],
    onChange,
    price_pre_paid,
    price_total_order_actual,
  } = props;

  const paymentIdx = payments.findIndex((pm) => {
    return pm.type === item.value;
  });

  const stableType = payments.find((item) => item.type === "COD" || item.type === "CASH");
  const directTranfer = payments.find((item) => item.type === "DIRECT_TRANSFER");

  const handleTooglePaymentType = ({
    isChecked,
    type,
  }: {
    isChecked?: boolean;
    type: TOrderPaymentTypeValue;
  }) => {
    const paymentsClone = [...payments];
    if (isChecked) {
      onChange([
        ...paymentsClone,
        { type, price_from_order: price_total_order_actual - price_pre_paid },
      ]);
    } else {
      paymentsClone.splice(paymentIdx, 1);
      onChange(paymentsClone);
    }
  };

  // khi payments có chứa item có type tĩnh (CASH| COD) mà item nào không thuộc payments thì ẩn item đi
  // nếu item có type tĩnh và trong payments có chứa DIRECT_TRANSFER mà price_from_order = price_total_order_actual (chuyển khoản hết luôn) thì ẩn item đó

  return (!!stableType && paymentIdx < 0) ||
    ((item.value === "CASH" || item.value === "COD") &&
      directTranfer?.price_from_order === price_total_order_actual) ? null : (
    <Stack>
      <FormControlLabel
        sx={{ ".MuiFormControlLabel-label": { fontWeight: 500, fontSize: "0.82rem" } }}
        control={
          payments[paymentIdx]?.is_confirm ? (
            <CheckCircleIcon sx={{ color: "success.main", m: 1 }} />
          ) : (
            <Checkbox
              onChange={(e) =>
                handleTooglePaymentType({ isChecked: e.target.checked, type: item.value })
              }
              checked={paymentIdx >= 0}
            />
          )
        }
        label={item.label}
        style={styles.helperLabel}
        disabled={disabled}
      />

      {/* input nhập số tiền cho phương thức chuyển khoản */}
      {paymentIdx >= 0 && item.value === "DIRECT_TRANSFER" && (
        <NumberInputField
          containerSx={{ input: { textAlign: "end", paddingRight: "0px !important" } }}
          value={payments[paymentIdx]?.price_from_order}
          onChange={(value) => onChange([{ type: item.value, price_from_order: value }])}
          type="currency"
          disabled={disabled}
        />
      )}
    </Stack>
  );
};

const styles: TStyles<"helperLabel"> = {
  helperLabel: { marginRight: 0 },
};
