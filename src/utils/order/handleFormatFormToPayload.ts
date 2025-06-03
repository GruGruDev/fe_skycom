import dayjs from "dayjs";
import map from "lodash/map";
import omit from "lodash/omit";
import reduce from "lodash/reduce";
import { OrderDTOV2, TItemComboPayload, TOrderLineItemPayload, TOrderPayload } from "types/Order";

export const handleFormatFormToPayload = ({ form }: { form: Partial<OrderDTOV2> }) => {
  const {
    line_items,
    customer,
    price_pre_paid = 0,
    price_total_order_actual = 0,
    source,
    address_shipping,
    appointment_date = null,
  } = form;

  const lineItems = map(line_items, (lineItem) => {
    const {
      quantity = 0,
      id = "",
      is_cross_sale = false,
      discount = 0,
      combo_variants = [],
      price_variant_logs = 0,
      price_total_input = 0,
    } = lineItem;

    const price_total = price_variant_logs * quantity;

    const itemComboPayload = reduce(
      combo_variants,
      (prev: TItemComboPayload[], cur: any = {}) => {
        const { price_detail_variant = 0, quantity = 0, detail_variant } = cur;

        const curPayload = {
          price: price_detail_variant,
          quantity,
          total: price_detail_variant * quantity,
          variant_id: detail_variant?.id,
        };
        return [...prev, curPayload];
      },
      [],
    );

    const lineItemPayload: TOrderLineItemPayload = {
      variant_id: id,
      discount,
      items_combo: itemComboPayload.length ? itemComboPayload : undefined,
      type_data_flow: itemComboPayload?.length ? "COMBO" : "SIMPLE",
      is_cross_sale,
      price_total,
      price_total_input,
      price_variant_logs,
      quantity,
    };

    return lineItemPayload;
  });

  const order: Partial<TOrderPayload> = {
    ...omit(form, ["created_by", "modified_by"]),
    status: form.status,
    appointment_date: appointment_date ? dayjs(appointment_date).format() : undefined,
    line_items: lineItems,
    source: source?.id,
    customer: customer?.id,
    address_shipping: address_shipping?.id,
    price_after_paid: price_total_order_actual - price_pre_paid,
  };

  return order;
};
