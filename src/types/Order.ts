import { TAddress } from "./Address";
import { TAttribute } from "./Attribute";
import { TCustomer } from "./Customer";
import { THistory } from "./History";
import { TParams } from "./Param";
import { TComboVariant, TVariant } from "./Product";
import { TUser } from "./User";
import { TInventory } from "./Warehouse";

export type TOrderStatusValue = "completed" | "cancel" | "draft" | "all";
export type TOrderPaymentTypeValue = "COD" | "DIRECT_TRANSFER" | "CASH";
export type TOrderPaymentStatusValue = "PENDING" | "DEPOSIT" | "PAID";
export type TOrderPromotionType = "SIMPLE" | "COMBO" | "PROMOTION";

export enum TOrderStatus {
  COMPLETED = "completed",
  DRAFT = "draft",
  CANCEL = "cancel",
}

export interface TOrderV2 {
  id?: string;
  order_key: string;
  created_by: string;
  modified_by: string;
  customer: Partial<TCustomer>;
  address_shipping: Partial<TAddress>;
  printed_by: string;
  cancel_reason: TAttribute;
  source: TAttribute;
  tags: TAttribute[];
  payments: TPaymentV2[];
  created: string;
  modified: string;
  order_number: string;
  sale_note: string;
  delivery_note: string;
  status: TOrderStatusValue;
  completed_time: string;
  phone_shipping: string;
  name_shipping: string;
  is_print: boolean;
  printed_at: string;
  third_party_id: string;
  third_party_name: string;
  third_party_type: string;
  is_cross_sale: boolean;
  value_cross_sale: number;
  appointment_date: string | null;
  price_total_variant_all: number;
  price_total_variant_actual: number;
  price_total_variant_actual_input: number;
  price_total_discount_order_promotion: number;
  price_discount_input: number;
  price_delivery_input: number;
  price_addition_input: number;
  price_total_order_actual: number;
  price_pre_paid: number; // số tiền thanh toán trước
  price_after_paid: number; // số tiền cần thanh toán
  complete_time: string;
  sheet?: { code: string; id: string; is_confirm: boolean }[];
}

export interface TPaymentV2 {
  id?: string;
  created: string;
  modified: string;
  type: TOrderPaymentTypeValue;
  price_from_order: number;
  price_from_third_party: number;
  date_from_third_party: string;
  price_from_upload_file: number;
  date_from_upload_file: string;
  is_confirm: boolean;
  date_confirm: string;
  note: string;
  image: string;
  created_by: string;
  modified_by: string;
  order: string;
}

// --- Detail

export interface TOrderPaymentDetail extends TPaymentV2 {
  history: Partial<TPaymentV2>[];
}

// --- DTO
export interface OrderDTOV2 {
  payments: Partial<OrderPaymentDTO>[];
  // line_items: Partial<OrderLineItemDTO>[];
  line_items: any[];
  cancel_reason: string;
  tags: string[];
  is_available_shipping?: boolean; // validate shipping address
  is_available_discount_input?: boolean;
  id?: string;
  order_key: string;
  customer?: Partial<TCustomer>;
  address_shipping: Partial<TAddress>;
  printed_by: string;
  source: TAttribute;
  created: string;
  modified_by: string;
  created_by: string;
  modified: string;
  order_number: string;
  sale_note: string;
  delivery_note: string;
  status: TOrderStatusValue;
  completed_time: string;
  phone_shipping: string;
  name_shipping: string;
  is_print: boolean;
  printed_at: string;
  third_party_id: string;
  third_party_name: string;
  third_party_type: string;
  is_cross_sale: boolean;
  value_cross_sale: number;
  appointment_date: string | null;
  price_total_variant_all: number;
  price_total_variant_actual: number;
  price_total_variant_actual_input: number;
  price_total_discount_order_promotion: number;
  price_discount_input: number;
  price_delivery_input: number;
  price_addition_input: number;
  price_total_order_actual: number;
  price_pre_paid: number; // số tiền thanh toán trước
  price_after_paid: number; // số tiền cần thanh toán
  complete_time: string;
}

export type LineItemDTO = {
  is_cross_sale: boolean;
  quantity: number;
  total: number;
  variant: string;
  variant_total: number;
};

export interface OrderPaymentDTO {
  id: string;
  created_by: TUser;
  modified_by: TUser;
  history: Partial<Omit<OrderPaymentDTO, "history"> & THistory>[];
  created: string;
  modified: string;
  type: TOrderPaymentTypeValue;
  price_from_order: number;
  price_from_third_party: number;
  date_from_third_party: string;
  price_from_upload_file: number;
  date_from_upload_file: string;
  is_confirm: boolean;
  date_confirm: string;
  note: string;
  image: string;
  order: string;
}

export interface OrderLineItemDTO extends Partial<TVariant> {
  id: string;
  variant: Partial<Omit<TComboVariant, "variant">>;
  // lấy từ other_variants của product => cache lại trong order
  items_combo: Partial<Omit<OrderLineItemDTO, "items_combo">>[]; // lưu combo_variants của line_item
  items_promotion?: Partial<Omit<OrderLineItemDTO, "items_combo">>[]; // dùng để lưu dữ liệu cho in đơn
  created: string;
  modified: string;
  quantity: number;
  price_variant_logs: number; // giá bán của sản phẩm lưu tại đơn hàng
  price_total: number; // = price_variant_logs * quantity
  price_total_input: number; // = nhập tay
  discount: number;
  third_party_item_id: string;
  third_party_source: string;
  is_cross_sale: boolean;
  type_data_flow: TOrderPromotionType;
  order: string;
  //
  default_quatity?: number; // show thông tin của combo
  //
  inventoryAvailabel?: number; // validate tồn kho
  // form giao hàng
  batch?: string;
  warehouse?: string;
  selected?: boolean;
  inventoryCache?: TInventory[]; // kiểm kho

  //

  note?: string;
  price: number;
  sale_price?: number;
  requirement_max_quantity: number;
}

// --- Payload
export interface TPaymentPayload {
  type: TOrderPaymentTypeValue;
  price_from_order: number;
  price_from_third_party: number;
  date_from_third_party: string;
  price_from_upload_file: number;
  date_from_upload_file: string;
  is_confirm: boolean;
  note: string;
}

export interface TItemComboPayload {
  variant_id: string;
  quantity: number;
  price: number;
  total: number;
}

export interface TItemPromotionPayload {
  variant_id: string;
  quantity: number;
  price: number;
  total: number;
}

export interface TOrderPromotionPayload {
  promotion_variant_id: string;
  price: number;
  items_promotion?: TItemPromotionPayload[];
}

export interface TOrderLineItemPayload {
  variant_id: string;
  quantity: number;
  price_variant_logs: number; // để cache giá sản phẩm tại line_item => hoa hồng bằng price_variant_logs - sale_price
  discount?: number;
  price_total: number;
  price_total_input: number;
  third_party_item_id?: string;
  third_party_source?: string;
  is_cross_sale: boolean;
  type_data_flow: TOrderPromotionType;
  items_combo?: TItemComboPayload[];
}
export interface TOrderPayload {
  line_items: TOrderLineItemPayload[];
  cancel_reason?: string;
  price_after_paid: number;
  price_pre_paid: number;
  price_delivery_input?: number;
  price_addition_input?: number;
  price_discount_input?: number;
  price_total_discount_order_promotion?: number;
  price_total_order_actual: number; // tổng số tiền cuối cần phải trả sau khi + - tất cả chi phí
  price_total_variant_all: number; // tổng tiền hàng
  price_total_variant_actual: number; // tổng tiền hàng
  price_total_variant_actual_input: number; // tổng tiền hàng
  appointment_date?: string;
  value_cross_sale?: number;
  is_cross_sale?: boolean;
  address_shipping: string;
  tags?: string[];
  payments: Partial<TPaymentPayload>[];
  customer: string;
  name_shipping: string;
  phone_shipping: string;
  source: string;
  status: TOrderStatusValue;
  delivery_note?: string;
  sale_note?: string;
}

// -----------------------------

export interface THistoryOrder extends THistory, OrderDTOV2 {}

export interface TOrderPaymentHistory extends TPaymentV2, THistory {}

export interface TOrderFilterProps {
  isFilterOrderStatus?: boolean;
  isFilterCreator?: boolean;
  isFilterCustomerCarrier?: boolean;
  isFilterModifiedBy?: boolean;
  isFilterDate?: boolean;
  isFilterSource?: boolean;
  isFilterCarrierStatus?: boolean;
  isFilterPaymentType?: boolean;
  isFilterPrinted?: boolean;
  filterCount?: number;
  isFilterTag?: boolean;
  isFilterConfirmDate?: boolean;
  params?: TParams;
  tagOptions?: TAttribute[];
  //
  setParams?: (params: TParams) => void;
}

// --- Report
export interface ReportOrderType {
  created__date: string;
  source__id: string;
  source__name: string;
  complete_time__date: string;
  created_by__id: string;
  created_by__name: string;
  status: string;
  avg_value_order: number;
  price_addition_input: number;
  price_delivery_input: number;
  price_discount_input: number;
  price_total_discount_order_promotion: number;
  price_total_order_actual: number;
  price_total_variant_all: number;
  total_order: number;
}

export interface TMOrder {
  id: string;
  created: string;
  name_shipping: string;
  order_key: string;
  phone_shipping: string;
  price_total_order_actual: number;
  status: string;
  variants: Partial<Omit<TComboVariant, "tags">>[];
}
