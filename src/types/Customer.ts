import { TAddress } from "./Address";
import { TAttribute } from "./Attribute";
import { THistory } from "./History";
import { TUser } from "./User";

export type TGender = "male" | "female";

export type TCustomerAttribute = "groups" | "tags";

export enum GENDER_LABEL {
  male = "male",
  female = "female",
}

export interface TPhone {
  id: string;
  created: string;
  modified: string;
  phone: string;
  customer: string;
}

export interface TCustomer {
  id?: string;
  tags?: TAttribute[];
  groups?: TAttribute[];
  phones: Partial<TPhone>[];
  addresses: TAddress[];
  created_by?: Partial<TUser>;
  modified_by?: Partial<TUser>;
  created?: string;
  modified?: string;
  source: string;
  name: string;
  ecommerce_id: string;
  email?: string;
  birthday?: string | null;
  customer_care_staff?: string;
  customer_note?: string;
  gender?: TGender;
  rank?: string;
  total_order?: string;
  total_spent?: string;
  modified_care_staff_by?: string;
  last_order_time?: string;
}

export interface CustomerDTO extends Omit<TCustomer, "tags"> {
  id?: string;
  addresses: TAddress[];
  address?: TAddress; // validate
  source: string;
  name: string;
  phone?: string;
  tags?: string[];
  ecommerce_id: string;
  email?: string;
  birthday?: string | null;
  customer_care_staff?: string;
  customer_note?: string;
  gender?: "male" | "female";
  rank?: string;
  modified_care_staff_by?: string;
  latest_up_rank_date?: string;
  total_order?: string;
  total_spent?: string;
}

export interface TRank {
  id: string;
  name_rank: string;
  spend_from: number;
  spend_to: number;
}

export interface THistoryCustomer extends Omit<TCustomer, "modified_by">, THistory {}
