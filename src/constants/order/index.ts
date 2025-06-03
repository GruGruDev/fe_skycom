import { TDateFilter } from "types/Filter";
import { TOrderPaymentTypeValue } from "types/Order";
import { PaletteColor } from "types/Styles";
import { ORDER_LABEL } from "./label";
import { TSelectOption } from "types/SelectOption";

export const ORDER_STATUS_VALUE = {
  draft: "draft",
  completed: "completed",
  cancel: "cancel",
};

export const PAYMENT_TYPE_VALUE: {
  label: string;
  value: TOrderPaymentTypeValue;
  color: PaletteColor;
}[] = [
  { value: "DIRECT_TRANSFER", label: ORDER_LABEL.payment_direct_transfer, color: "info" },
  { value: "CASH", label: ORDER_LABEL.payment_cash, color: "success" },
  { value: "COD", label: ORDER_LABEL.cod, color: "error" },
];

export const ORDER_STATUS: {
  color?: PaletteColor | undefined;
  label: string;
  value: string;
}[] = [
  { label: ORDER_LABEL.draft, value: ORDER_STATUS_VALUE.draft, color: "info" },
  { label: ORDER_LABEL.completed, value: ORDER_STATUS_VALUE.completed, color: "success" },
  { label: ORDER_LABEL.cancel, value: ORDER_STATUS_VALUE.cancel, color: "error" },
];

export const PRINT_OPTIONS: {
  color?: PaletteColor | undefined;
  label: string;
  value: string;
}[] = [
  { label: ORDER_LABEL.not_printed, value: "false", color: "error" },
  { label: ORDER_LABEL.printed, value: "true", color: "success" },
];

export const SOURCE_FILTER = { label: "source", color: "", title: ORDER_LABEL.source };
export const PRINT_STATUS_FILTER = { label: "is_print", color: "", title: ORDER_LABEL.printed };
export const CREATED_BY_FILTER = { label: "created_by", color: "", title: ORDER_LABEL.created_by };
export const CUSTOMER_CARRIER_FILTER = {
  label: "customer_care_staff_id",
  color: "",
  title: ORDER_LABEL.customer_care_staff,
};
export const TAG_FILTER = { label: "tags", color: "", title: ORDER_LABEL.tags };

export const DATE_OPTIONS_FILTER_COLORL: TDateFilter[] = [
  {
    title: ORDER_LABEL.create_order,
    keyFilters: [
      { label: "created_from", color: "#91f7a4", title: ORDER_LABEL.create_date_from },
      { label: "created_to", color: "#91f7a4", title: ORDER_LABEL.create_date_to },
      { label: "dateValue" },
    ],
  },
  {
    title: ORDER_LABEL.date_confirm,
    keyFilters: [
      { label: "completed_from", color: "#91f7a4", title: ORDER_LABEL.date_confirm_from },
      { label: "completed_to", color: "#91f7a4", title: ORDER_LABEL.date_confirm_to },
      { label: "confirmDateValue" },
    ],
  },
];

export const ORDER_PAYMENT_LABEL: {
  [key in TOrderPaymentTypeValue]: {
    value: string;
    color?: PaletteColor;
  };
} = {
  COD: { value: "COD", color: "error" },
  DIRECT_TRANSFER: { value: ORDER_LABEL.payment_direct_transfer, color: "info" },
  CASH: { value: ORDER_LABEL.payment_cash, color: "success" },
};

export const PAYMENT_TYPES: {
  [key in TOrderPaymentTypeValue]: TOrderPaymentTypeValue;
} = {
  COD: "COD",
  CASH: "CASH",
  DIRECT_TRANSFER: "DIRECT_TRANSFER",
};

export const EXPORT_DATA_TO_GMAIL_KEY: { [key in string]: string } = {
  order_key: ORDER_LABEL.order_key,
  status: ORDER_LABEL.status,
  "source.name": ORDER_LABEL.source,
  "tags.name": ORDER_LABEL.tags,
  created: ORDER_LABEL.created,
  "created_by.name": ORDER_LABEL.created_by,
  customer_name: ORDER_LABEL.customer_name,
  customer_phone: ORDER_LABEL.customer_phone,
  note: ORDER_LABEL.note,
  cancel_reason: ORDER_LABEL.cancel_reason,
  price_total_variant_all: ORDER_LABEL.price_total_variant_all,
  price_total_variant_actual: ORDER_LABEL.price_total_variant_actual,
  price_total_variant_actual_input: ORDER_LABEL.price_total_variant_actual_input,
  price_delivery_input: ORDER_LABEL.price_delivery_input,
  price_addition_input: ORDER_LABEL.price_addition_input,
  price_discount_input: ORDER_LABEL.price_discount_input,
  "payments.amount": ORDER_LABEL.price_from_order,
  "payments.actual_amount": ORDER_LABEL.actual_amount,
  "payments.": ORDER_LABEL.payment_type,
  payment_note: ORDER_LABEL.payment_note,
  total_actual: ORDER_LABEL.payment_total_actual,
};

export const ORDER_SORT_OPTIONS: TSelectOption[] = [
  { value: "order_key", label: ORDER_LABEL.order_key },
  { value: "created", label: ORDER_LABEL.created },
  { value: "complete_time", label: ORDER_LABEL.complete_time },
  { value: "modified", label: ORDER_LABEL.modified },
  { value: "appointment_date", label: ORDER_LABEL.appointment_date },
  { value: "price_total_variant_actual", label: ORDER_LABEL.price_total_variant_actual },
  {
    value: "price_total_variant_actual_input",
    label: ORDER_LABEL.price_total_variant_actual_input,
  },
  { value: "price_delivery_input", label: ORDER_LABEL.price_delivery_input },
  { value: "price_addition_input", label: ORDER_LABEL.price_addition_input },
  { value: "price_discount_input", label: ORDER_LABEL.price_discount_input },
  {
    value: "price_total_discount_order_promotion",
    label: ORDER_LABEL.price_total_discount_order_promotion,
  },
  { value: "price_total_order_actual", label: ORDER_LABEL.price_total_order_actual },
];
