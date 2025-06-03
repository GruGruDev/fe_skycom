export interface TImage {
  created: string;
  id: string;
  image: string;
  modified: string;
  note?: string;
  upload_by: string;
  url: string;
  is_default?: boolean;
}

export interface TImageDTO extends Omit<Partial<TImage>, "image"> {
  image: Blob;
  user?: string;
  product?: string;
  product_variant?: string;
  material?: string;
  payment?: string;
  type: IMAGE_TYPE;
  is_default?: boolean;
}

export enum IMAGE_TYPE {
  "PD" = "PD",
  "PDV" = "PDV",
  "MT" = "MT",
  "US" = "US",
  "PM" = "PM",
  "ORS" = "ORS",
  "OT" = "OT",
}
