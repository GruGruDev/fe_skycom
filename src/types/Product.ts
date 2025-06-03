import { TAttribute } from "./Attribute";
import { TImage } from "./Media";
import { TParams } from "./Param";
import { TSelectOption } from "./SelectOption";
import { TBatchSheet } from "./Sheet";
import { TUser } from "./User";

export type TProductView = "product" | "variant";

export type TProductAttribute = "category" | "supplier" | "tags" | "attributes";

export enum STATUS_PRODUCT_LABEL {
  active = "active",
  inactive = "inactive",
}

export enum ECOMMERCE_PLARFORM {
  LAZADA = "lazada",
  TIKTOK = "tik-tok",
  SHOPEE = "shopee",
  TIKI = "tiki",
}

export enum VARIANT_TYPE {
  SIMPLE = "simple",
  BUNDLE = "bundle",
  COMBO = "combo",
}

export interface TProduct {
  category: string;
  created: string;
  created_by: string;
  id: string;
  SKU_code: string;
  is_active: boolean;
  modified: string;
  modified_by: string;
  total_inventory?: number;
  total_variants?: number;
  name: string;
  note?: string;
  supplier: string;
  variants: Partial<Omit<TVariant, "combo_variants">>[];
  images?: TImage[];
  deprecatedImages?: TImage[];
  prevSubmitImages?: TImage[];
}

export interface TVariant {
  SKU_code: string;
  bar_code: string;
  created: string;
  category_name: string;
  created_by: string;
  inventory_quantity: number;
  inventory_note: string;
  total_inventory: number;
  id: string;
  modified: string;
  total_weight?: number;
  category?: string;
  modified_by: string;
  name: string;
  neo_price: number;
  note?: string;
  product?: string;
  purchare_price: number;
  sale_price: number;
  is_active: boolean;
  tags: TAttribute[];
  type: VARIANT_TYPE;
  combo_variants?: TComboVariant[];
  purchase_price: string;
  //
  images?: TImage[];
  //
  commission?: number;
  commission_percent?: number;
  total_material_quantity?: number;
  materials?: Partial<{ id: string; quantity: number; name: string; SKU_code: string }>[];
}

export interface TVariantDetail {
  batches: Partial<TBatchSheet>[];
  total_inventory: number;
  quantity_confirm: number;
  quantity_non_confirm: number;
  //
  SKU_code: string;
  bar_code: string;
  created: string;
  created_by: string;
  id: string;
  modified: string;
  modified_by: string;
  category?: string;
  name: string;
  neo_price: number;
  note?: string;
  product?: string;
  purchare_price: number;
  sale_price: number;
  is_active: boolean;
  tags: TAttribute[];
  type: VARIANT_TYPE;
  combo_variants?: TComboVariant[];
  purchase_price: string;
  //
  images?: TImage[];
  deprecatedImages?: TImage[];
  prevSubmitImages?: TImage[];
  materials?: Partial<{ id: string; quantity: number; name: string; SKU_code: string }>[];
}

export interface VariantDTO extends Omit<TVariantDetail, "tags"> {
  tags?: string[];
  product_id: string;
}

// comboVariant là sự kết hợp của product và variant
export interface ComboVariantDTO extends TProduct {
  tags?: string[];
  COMBO_name: string;
  COMBO_note: string;
  detail_variant_id: string;
  //
  discount: number;
  selected: boolean;
  variant: string;
  // variant
  SKU_code: string;
  bar_code: string;
  created: string;
  created_by: string;
  id: string;
  modified: string;
  modified_by: string;
  name: string;
  neo_price: number;
  note?: string;
  product?: string;
  purchare_price: number;
  sale_price: number;
  is_active: boolean;
  type: VARIANT_TYPE;
  combo_variants?: TComboVariant[];
  purchase_price: string;
  // product
  category: string;
  supplier: string;
  variants: Partial<Omit<TComboVariant, "tags">>[];
  images?: TImage[];
}

export interface TBatch {
  id: string;
  name: string;
  expire_date: string;
  product_variant: Omit<TVariantDetail, "combo_variants">;
}

export interface TSupplierAttribute extends Partial<TAttribute> {
  business_code?: string;
  tax_number?: string;
  country?: string;
  address?: string;
  status?: STATUS_PRODUCT_LABEL;
  legal_representive?: string;
  established_at?: string;
}

export interface TComboVariant extends Partial<Omit<TVariant, "combo_variants">> {
  detail_variant?: Partial<Omit<TVariant, "combo_variants">>;
  origin_variant?: string;
  price_detail_variant?: number;
  quantity?: number;
  price_total?: number;
  price_total_input?: number;
  default_quatity?: number;
}

export interface ProductDTO {
  category: string;
  created: string;
  created_by: string;
  id: string;
  is_active: boolean;
  modified: string;
  SKU_code: string;
  modified_by: string;
  name: string;
  note?: string;
  supplier: string;
  variants: Partial<{
    name: string;
    SKU_code: string;
    images?: string[];
    sale_price: number;
    neo_price: number;
    type: VARIANT_TYPE.SIMPLE;
  }>[];
  images?: (string | undefined)[];
}

export interface VariantPayload {
  tags?: string[];
  product_id: string;
  images?: string[];

  batches: Partial<TBatchSheet>[];
  total_inventory: number;
  quantity_confirm: number;
  quantity_non_confirm: number;
  //
  SKU_code: string;
  bar_code: string;
  created: string;
  created_by: string;
  id: string;
  modified: string;
  modified_by: string;
  name: string;
  neo_price: number;
  note?: string;
  product?: string;
  purchare_price: number;
  sale_price: number;
  is_active: boolean;
  type: VARIANT_TYPE;
  combo_variants?: TComboVariant[];
  purchase_price: string;
  //
}

export interface TProductFilterOptions {
  isFilterCategory?: boolean;
  isFilterSupplier?: boolean;
  isFilterCreatedBy?: boolean;
  isFilterActive?: boolean;
  category?: TSelectOption[];
  supplier?: TSelectOption[];
  params?: TParams;
  users?: TUser[];
  setParams?: (params: TParams) => void;
}

export interface TProductMaterial {
  id: string;
  created_by: string;
  modified_by: string;
  selected: boolean;
  name: string;
  note: string;
  SKU_code: string;
  bar_code: string;
  weight: number;
  length: number;
  // height: number;
  // width: number;
  neo_price: number;
  sale_price: number;
  is_active: boolean;
  is_process: boolean;
  variants?: Partial<TVariant>[];
  created: string;
  //
  images?: TImage[];
  deprecatedImages?: TImage[];
  prevSubmitImages?: TImage[];
  //
  total_inventory: number;
}
