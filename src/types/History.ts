export enum HISTORY_ACTIONS {
  CREATE = "+",
  ADD = "add",
  UPDATE = "~",
  PRINT = "~PRINTED",
  CONFIRM = "~CONFIRMED",
  CANCEL = "~CANCELLED",
}

export interface THistory {
  history_id: string;
  history_date: string;
  history_change_reason: string;
  history_type: HISTORY_ACTIONS;
  history_user: string;
  modified_by: string;
  history_action?: HISTORY_ACTIONS;
}

export interface THistoryChangeReasonRes {
  field: string;
  old: string;
  cur: string;
}
