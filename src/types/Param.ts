export type TParamValue =
  | undefined
  | string
  | Blob
  | number
  | object
  | null
  | undefined
  | boolean
  | (null | undefined | string | number | object)[];

export type TParams = {
  [key: string]: TParamValue;
};
