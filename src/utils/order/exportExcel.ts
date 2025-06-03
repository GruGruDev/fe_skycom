import { ORDER_STATUS, PAYMENT_TYPES } from "constants/order";
import { ORDER_LABEL } from "constants/order/label";
import { TAddress } from "types/Address";
import { TAttribute } from "types/Attribute";
import { TCustomer } from "types/Customer";
import { TOrderPaymentTypeValue, TOrderStatusValue, TPaymentV2 } from "types/Order";
import { TUser } from "types/User";
import { addressToString } from "utils/customer/addressToString";
import { fDateTime } from "utils/date";

export const exportExcel = (item: { [key: string]: unknown } = {}) => {
  const objStatusLabel = ORDER_STATUS.reduce(
    (prev: { [key: string]: string }, current) => ({
      ...prev,
      [current.value]: current.label,
    }),
    {},
  );

  const calcPaymentAmount = (type: TOrderPaymentTypeValue) => {
    const payments = item.payments as TPaymentV2[];
    if (payments && payments.length > 0) {
      const temp = payments.find((itemPayment: TPaymentV2) => itemPayment.type === type);
      return temp ? temp.price_from_order : 0;
    }
    return 0;
  };

  const tag = () => {
    const tags = item.tags as TAttribute[];
    let temp = "";
    if (tags.length) {
      tags.map((item) => (temp = temp + `${item.name}, `));
    }
    return temp;
  };

  const status = item.status as TOrderStatusValue;
  const source = item.source as TAttribute;
  const created = item.created as string | undefined;
  const created_by = item.created_by as TUser;
  const modified = item.modified as string | undefined;
  const modified_by = item.modified_by as TUser | undefined;
  const customer = item.customer as TCustomer;
  const cancel_reason = item.cancel_reason as TAttribute;
  const printed_at = item.printed_at as string | undefined;
  const address = item.address_shipping as TAddress;
  const {
    price_total_variant_all = 0,
    price_total_variant_actual = 0,
    price_total_variant_actual_input = 0,
    price_delivery_input = 0,
    price_addition_input = 0,
    price_discount_input = 0,
    price_total_discount_order_promotion = 0,
    price_total_order_actual = 0,
    variant_name,
    variant_SKU,
    variant_quantity,
    variant_total,
  } = item;

  const newItem = {
    order_key: item.order_key,
    status: objStatusLabel[status],
    source_name: source?.name,
    tags: tag(),
    created: fDateTime(created),
    created_by: created_by?.name,
    modified: fDateTime(modified),
    modified_by: modified_by?.name,
    cross_sale_amount: item?.value_cross_sale ? item?.value_cross_sale : "",
    customer_name: customer.name,
    note: item?.sale_note,
    cancel_reason: cancel_reason?.name,
    tracking_number: item?.tracking_number,
    name_shipping: item?.name_shipping,
    phone_shipping: item?.phone_shipping,
    address_shipping: addressToString(address),
    delivery_note: item?.delivery_note,
    payment_total_variant_all: price_total_variant_all,
    payment_total_variant_actual: price_total_variant_actual,
    payment_total_variant_actual_input: price_total_variant_actual_input,
    payment_fee_delivery: price_delivery_input,
    payment_fee_additional: price_addition_input,
    payment_discount_input: price_discount_input,
    price_total_discount_order_promotion: price_total_discount_order_promotion,
    payment_total_actual: price_total_order_actual,
    payment_direct_transfer: calcPaymentAmount(PAYMENT_TYPES.DIRECT_TRANSFER),
    payment_cod: calcPaymentAmount(PAYMENT_TYPES.COD),
    payment_cash: calcPaymentAmount(PAYMENT_TYPES.CASH),
    printed_at: fDateTime(printed_at),
    variant_name,
    variant_SKU,
    variant_quantity,
    variant_total,
  };

  const objExport = Object.keys(newItem).reduce((prev, current) => {
    const key = ORDER_LABEL[current as keyof typeof ORDER_LABEL];
    const value = newItem[current as keyof typeof newItem] as string;

    return {
      ...prev,
      [key]: value,
    };
  }, {});

  return objExport;
};
