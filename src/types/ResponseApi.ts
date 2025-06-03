export interface TMultiResponse<T> {
  next?: string | null;
  previous?: string | null;
  count?: number;
  results: T[];
  total?: any;
  data?: T[];
  error?: any;
}

export interface TBaseResponse<T> {
  data: T;
  message?: string;
  status?: number;
  error?: any;
}

export interface TErrorResponse<T = any> {
  message?: string;
  data: null;
  status?: number;
  name?: T;
}

export type ErrorType = any;

export const successResManyData = <T>(data: { items: T[]; total: number }) => {
  return { items: data.items, total: data.total };
};

export type TErrorName = "NETWORK_ERROR" | "SERVER_ERROR" | "VALIDATION_ERROR" | "CANCEL_REQUEST";

export const NETWORK_ERROR = "NETWORK_ERROR";
export const SERVER_ERROR = "SERVER_ERROR";
export const VALIDATION_ERROR = "VALIDATION_ERROR";
export const CANCEL_REQUEST = "CANCEL_REQUEST";

export class CValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = VALIDATION_ERROR;
  }
}

export class CServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = SERVER_ERROR;
  }
}

export class TNetwordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = NETWORK_ERROR;
  }
}

export class TCancelRequest extends Error {
  constructor(message: string) {
    super(message);
    this.name = CANCEL_REQUEST;
  }
}
