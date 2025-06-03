import { OrderLineItemDTO } from "types/Order";
import { forOf } from "utils/forOf";

//
export const calcOrderPriceWhileChangeVariant = (variants: Partial<OrderLineItemDTO>[]) => {
  // SL sản phẩm = SL variant + tổng SL variantItem trong other_variants trong promotions có type = TPromotion.VARIANT
  let price_total_variant_all = 0;
  // tiền sản phẩm thực tế = SL variant * price_variant_logs - discount
  let price_total_variant_actual = 0;
  let price_total_variant_actual_input = 0;
  // số tiền đơn hàng = số tiền sản phẩm (vì khi thay đổi thông tin lineItems thì những trường trong payment sẽ được reset)
  let price_total_order_actual = 0;

  forOf<Partial<OrderLineItemDTO>>(variants, (item) => {
    const { quantity = 0, price_variant_logs = 0, discount = 0, price_total_input = 0 } = item;
    const price_total = price_variant_logs * quantity - discount * quantity;

    price_total_variant_all += price_variant_logs * quantity;

    // tiền trong khuyến mãi price_value và percent_value đã được tính trong discount
    price_total_variant_actual += price_total;
    price_total_variant_actual_input += price_total_input;
    // khi thay đổi variant => reset payment => price_total_order_actual = price_total_variant_actual
    // price_total_order_actual = price_total_variant_actual;
    price_total_order_actual = price_total_variant_actual_input;
  });

  return {
    price_total_variant_actual,
    price_total_variant_actual_input,
    price_total_variant_all,
    price_total_order_actual,
  };
};
