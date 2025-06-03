import FilterSet from "./FilterSet";

export enum AirTableColumnTypes {
  LINK_TO_RECORD = "LINK_TO_RECORD",
  SINGLE_LINE_TEXT = "SINGLE_LINE_TEXT",
  LONG_TEXT = "LONG_TEXT",
  ATTACHMENT = "ATTACHMENT",
  CHECKBOX = "CHECKBOX",
  MULTIPLE_SELECT = "MULTIPLE_SELECT",
  SINGLE_SELECT = "SINGLE_SELECT",
  MULTIPLE_USER = "MULTIPLE_USER",
  SINGLE_USER = "SINGLE_USER",
  DATE = "DATE",
  DATETIME = "DATETIME",
  DURATION = "DURATION",
  PHONE_NUMBER = "PHONE_NUMBER",
  EMAIL = "EMAIL",
  URL = "URL",
  NUMBER = "NUMBER",
  CURRENCY = "CURRENCY",
  PERCENT = "PERCENT",
  AUTO_NUMBER = "AUTO_NUMBER",
}

export type AirTableOption = {
  id: string;
  index?: number;
  value?: string;
  name: string | any;
  color?: string;
  image?: any;
};

export interface AirTableColumn {
  index?: number;
  id: string;
  width: number;
  name: string;
  key: string;
  description?: string;
  type: AirTableColumnTypes;
  options?: {
    choices?: AirTableOption[];
    choiceOrder?: AirTableOption["id"][];
    recordDisplay?: string;
    feType?: AirTableColumnTypes;
    tableLinkToRecordId?: string;
  };
  isCreateByFe?: boolean;
}

export interface AirTableFieldConfig {
  field_id: string;
  visible: boolean;
  width: number;
  field_configs?: any;
}

export interface AirTableField {
  id: string;
  index?: number;
  name: string;
  type: string;
  description?: string;
  options?: {
    choices?: { [key: string]: AirTableOption };
    choiceOrder?: string[];
    feType?: AirTableColumnTypes;
  };
}

export enum AirTableViewTypes {
  GRID = "grid",
  // FORM = "form",
  KANBAN = "kanban",
}

export interface SortItem {
  id: string;
  columnId: string;
  ascending: boolean;
}

export enum ROW_HEIGHT_TYPES {
  SHORT = "short",
  MEDIUM = "medium",
  TALL = "tall",
  EXTRA_TALL = "extra_tall",
}

export interface AirTableView {
  id?: string;
  type: AirTableViewTypes;
  name: string;
  description?: string;
  visible_fields: AirTableFieldConfig[];
  options?: {
    filterSet?: FilterSet;
    sortSet?: SortItem[];
    fieldKanban?: string;
    rowHeight?: ROW_HEIGHT_TYPES;
    fixedFields?: string[];
  };
}

export interface AirTableBase {
  id: string;
  description: string;
  name: string;
  next_auto_value?: number;
  primary_key?: string;
  records?: {
    [key: string]: {
      id: string;
      field: string;
      value: any;
    }[];
  };
  views: AirTableView[];
  fields: AirTableField[];
}
