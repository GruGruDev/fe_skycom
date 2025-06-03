import { HISTORY_ACTIONS } from "./History";
import { TImage } from "./Media";
import { TRole } from "./Permission";

export interface TUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  is_active: boolean;
  is_superuser: boolean;
  department: string;
  is_online: boolean;
  is_CRM: boolean;
  is_hotdata: boolean;
  role?: TRole;
  password?: string;
  image?: { id: string; url: string };
  images?: Partial<TImage>[];
  is_assign_lead_campaign?: boolean;
}

export interface UserDTO {
  password?: string;
  role?: { id?: string };
  id?: string;
  name?: string;
  phone?: string;
  images?: string;
  is_online?: boolean;
  is_active?: boolean;
}

export enum USER_ACTIVE_LABEL {
  active = "active",
  inactive = "inactive",
}

export interface TUserHistory extends Partial<TUser> {
  history_id: string;
  last_login: string;
  created: string;
  modified: string;
  history_date: string;
  history_change_reason: string;
  history_type: HISTORY_ACTIONS;
  history_user: string;
}
