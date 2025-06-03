import { TAddress } from "./Address";
import { TBatch } from "./Product";
import { TSheetDetail } from "./Sheet";

export interface TWarehouse {
  id: string;
  name: string;
  created: string;
  modified: string;
  manager_name: string;
  manager_phone: string;
  note: string;
  is_default: boolean;
  is_sales: boolean;
  modified_by: string;
  created_by: string;
  addresses: TAddress[];
}

export interface WarehouseDTO {
  id?: string;
  name: string;
  manager_name: string;
  manager_phone: string;
  note: string;
  is_default: boolean;
  is_sales: boolean;
  address: TAddress;
}

export interface TInventory extends TSheetDetail {
  warehouse: TWarehouse;
  quantity: number;
  product_variant_batch: Partial<TBatch>;
  created: string;
  created_by: string;
  modified: string;
  modified_by: string;
  confirm_by: string;
  confirm_date: string;
  name: string;
  id: string;

  //
  quantity_confirm: number;
  quantity_non_confirm: number;
}
