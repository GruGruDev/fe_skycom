import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { Section, TitleSection } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { memo, useMemo } from "react";
import { FieldErrors } from "react-hook-form";
import { OrderDTOV2, OrderPaymentDTO } from "types/Order";
import Cost from "./Cost";
import DeliveryNote from "./DeliveryNote";
import DiscountInput from "./DiscountInput";
import FeeAdditional from "./FeeAdditional";
import FeeDelivery from "./FeeDelivery";
import Payment from "./Payment";
import TotalActual from "./TotalActual";
import TotalVariantQuantity from "./TotalVariantQuantity";

const PADDING_COLUMN = 1 / 20;

interface Props extends Partial<OrderDTOV2> {
  onChange: (key: keyof OrderDTOV2, value?: string | number | Partial<OrderPaymentDTO>[]) => void;
  errors: FieldErrors<OrderDTOV2>;
  rowId?: string;
  orderId?: string;
}

const OrderPrice = (props: Props) => {
  const {
    errors,
    rowId,
    payments = [],
    price_total_order_actual = 0,
    price_pre_paid = 0,
    price_total_variant_all = 0,
    price_total_variant_actual = 0,
    price_total_variant_actual_input = 0,
    price_discount_input = 0,
    price_addition_input = 0,
    price_after_paid = 0,
    price_delivery_input = 0,
    orderId,
    delivery_note,
    onChange,
  } = props;

  const isCostConfirm = useMemo(() => {
    const codPayment = payments.find((item) => item.type === "COD");
    return codPayment?.is_confirm;
  }, [payments]);

  const layoutStyle = {
    paddingRight: orderId ? `${PADDING_COLUMN * 100}%` : `${PADDING_COLUMN * 2 * 100}%`,
  };

  const handleChangeShippingFee = (value: number) => {
    const newTotal = price_total_order_actual - price_delivery_input + value;

    onChange("price_delivery_input", value);
    onChange("price_total_order_actual", newTotal);

    if (!newTotal) {
      onChange("payments", [{ type: "COD", price_from_order: 0 }]);
    } else {
      onChange("payments", []);
    }
  };

  const handleChangeAdditionFee = (value: number) => {
    const newTotal = price_total_order_actual - price_addition_input + value;

    onChange("price_addition_input", value);
    onChange("price_total_order_actual", newTotal);

    if (!newTotal) {
      onChange("payments", [{ type: "COD", price_from_order: 0 }]);
    } else {
      onChange("payments", []);
    }
  };

  const handleChangeDiscount = (value: number) => {
    const newTotal = price_total_order_actual + price_discount_input - value;

    onChange("price_discount_input", value);
    onChange("price_total_order_actual", newTotal);

    if (!newTotal) {
      onChange("payments", [{ type: "COD", price_from_order: 0 }]);
    } else {
      onChange("payments", []);
    }
  };

  return (
    <Section elevation={3} sx={{ mb: 2, p: 1 }}>
      <TitleSection>{ORDER_LABEL.payment}</TitleSection>
      <Divider sx={{ my: 1 }} />
      <Stack direction="column" padding={1} style={layoutStyle}>
        <TotalVariantQuantity
          price_total_variant_actual={price_total_variant_actual}
          price_total_variant_actual_input={price_total_variant_actual_input}
          price_total_variant_all={price_total_variant_all}
        />

        <DiscountInput
          price_discount_input={price_discount_input}
          error={errors.is_available_discount_input}
          handleChangeDiscount={handleChangeDiscount}
          isEdit={!rowId && !orderId}
        />
        <FeeDelivery
          isEdit={!rowId && !orderId}
          handleChangeShippingFee={handleChangeShippingFee}
          price_delivery_input={price_delivery_input}
        />
        <FeeAdditional
          price_addition_input={price_addition_input}
          handleChangeAdditionFee={handleChangeAdditionFee}
          isEdit={!rowId && !orderId}
        />
        <DeliveryNote
          onChange={(key, value) => onChange(key, value)}
          rowId={rowId}
          delivery_note={delivery_note}
          error={errors.delivery_note}
        />
        <TotalActual price_total_order_actual={price_total_order_actual} />
        <Payment
          errors={errors}
          onChange={onChange}
          isEdit={!rowId}
          payments={payments}
          price_total_order_actual={price_total_order_actual}
          price_pre_paid={price_pre_paid}
        />
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack direction="column" spacing={1} padding={1} style={layoutStyle}>
        <Cost price_after_paid={price_after_paid} isConfirm={isCostConfirm} />
      </Stack>
    </Section>
  );
};

export default memo(OrderPrice);
