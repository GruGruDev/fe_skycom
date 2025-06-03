import { UseFormReturn } from "react-hook-form";
import { TAttribute } from "./Attribute";
import { TOrderV2 } from "./Order";
import { TBatch, TVariantDetail } from "./Product";
import { TUser } from "./User";
import { TInventory, TWarehouse } from "./Warehouse";

export type TSheetType = "IP" | "EP" | "TF" | "CK";

export enum CONFIRM_LABEL {
  confirmed = "confirmed",
  not_confirm = "not_confirm",
}

export enum SHEET_CONFIRM_LABEL {
  confirmed = "confirmed",
  not_confirm = "not_confirm",
}

export interface TBatchSheet {
  batch_expire_date: string;
  batch_id: string;
  batch_name: string;
  // inventory: number;
  // warehouse_id: string;
  // warehouse_name: string;
  total_inventory: number;
  inventories: {
    inventory: number;
    warehouse_id: string;
    warehouse_name: string;
  }[];
  //
  id: string;
  name: string;
  expire_date: string;
}

export interface TSheetDetail {
  product_variant_batch: Partial<TBatch>;
  quantity: number;
  quantity_actual?: number;
  quantity_system?: number;
  sheet_detail: Partial<TSheetDetail>[];

  //
  batches: Partial<TBatchSheet>[];
  total_inventory: number;
  quantity_confirm: number;
  quantity_non_confirm: number;
  SKU_code: string;
  bar_code: string;
  created: string;
  created_by: string;
  change_reason: TAttribute;
  warehouse?: TWarehouse;
  id: string;
  modified: string;
  modified_by: string;
  name: string;
  neo_price: number;
  note?: string;
  product?: string;
  purchare_price: number;
  sale_price: number;
  tags: TAttribute[];
  purchase_price: string;
}

export interface TSheet {
  // sheet import
  type: TSheetType;
  note: string;
  is_delete: boolean;
  is_confirm: boolean;
  warehouse: string;
  change_reason: string;
  sheet_detail: Partial<TSheetDetail>[];

  // extends of sheet checking
  id: string;
  created: string;
  modified: string;
  code: string;
  confirm_date: string;
  modified_by: string;
  created_by: string;
  confirm_by: string;

  // extends of sheet export
  order?: Partial<TOrderV2>;
  order_key?: string;

  // sheet transfer
  warehouse_from: string;
  warehouse_to: string;

  product_variant_batch: Partial<TBatch>;
  product_variant?: Omit<TVariantDetail, "combo_variants">;

  //scan history
  scan_by: string;
  scan_at: string;
  //
  category?: boolean;
}

export interface TSheetDetailPayload extends Omit<TSheetDetail, "product_variant_batch"> {
  product_variant_batch?: string;
}
export interface TSheetPayload extends Omit<TSheet, "sheet_detail" | "order"> {
  sheet_detail: Partial<TSheetDetailPayload>[];
}

export enum SHEET_METHOD_LABEL {
  IP = "import",
  EP = "export",
  TF = "transfer",
  CK = "checked",
}
export interface TSheetDetailDTO
  extends Omit<TSheet, "change_reason" | "warehouse" | "warehouse_from" | "warehouse_to"> {
  change_reason: TAttribute;
  warehouse: TWarehouse;
  warehouse_from: TWarehouse;
  warehouse_to: TWarehouse;
}

export interface TWarehouseHistory extends TInventory {
  sheet_code: string;
  type: TSheetType;
  change_reason: TAttribute;
  sheet: TSheet;
}

export interface TSheetFilterProps {
  isFilterCreator?: boolean;
  isFilterCreatedDate?: boolean;
  isFilterConfimer?: boolean;
  isFilterConfirmDate?: boolean;
  isFilterProductCategory?: boolean;
  isFilterStatus?: boolean; // confirm
  isFilterChangeReason?: boolean;
  isFilterWarehouse?: boolean;
  isFilterWarehouseFrom?: boolean;
  isFilterWarehouseTo?: boolean;
  isFilterSheetType?: boolean;
  //scan history
  isFillterScanBy?: boolean;
  isFillterScanAt?: boolean;
}

export interface TScanHistory {
  count: number;
  turn_number: number;
  type: TSheetType;
  scan_by: Pick<TUser, "name" | "email">;
  scan_at: string;
  order_number: number;
  order_key: string;
}

export interface SheetModalType extends UseFormReturn<TSheet, object> {
  isOpen?: boolean;
  type?: TSheet["type"];
  endpoint?: string;
}
