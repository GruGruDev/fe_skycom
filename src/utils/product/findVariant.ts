import { TVariant } from "types/Product";
import { findOption } from "utils/option";

export const findVariant = (listVariants: Partial<TVariant>[] = [], id: string) => {
  return findOption(listVariants, id);
};
