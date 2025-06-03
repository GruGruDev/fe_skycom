export type TAddressType = "CT" | "WH" | "OT";

export interface TLocation {
  id: number;
  name: string;
  slug: string;
  label: string;
  code: string;
  type: string;
}
export interface TWard extends TLocation {
  district: number;
  province: number;
}

export interface TDistrict extends TLocation {
  province: number;
}

export interface TProvince extends Omit<TLocation, "type"> {
  type: string[];
}

export interface TAddress {
  id?: string;
  type: TAddressType;
  ward?: {
    district?: string;
    province?: string;
    ward?: string;
    district_id?: string;
    province_id?: string;
    ward_id?: string;
    code?: string;
  };
  is_default?: boolean;
  address?: string;
  customer?: string;
  warehouse?: string;
}
