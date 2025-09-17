// src/types/Permission.ts

import { ROLE_TAB, ROLE_TYPE } from "constants/role";

export interface TPermission {
  id: string;
  name: string;
  data?: {
    [key in ROLE_TAB]?: {
      [key: string]: ROLE_TYPE;
    };
  };
  default_router?: string;
}

export interface TRole {
  id: string;
  name: string;
  default_router: string;
  data: any;
  permissions: string[]; // <-- Đây là dòng quan trọng cần thêm vào
}
