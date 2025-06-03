import reduce from "lodash/reduce";
import { ComboVariantDTO, TVariantDetail } from "types/Product";

// variant
export const handleFormatResVariantToForm = (row: Partial<TVariantDetail> = {}) => {
  const { name, SKU_code, note, sale_price, neo_price, bar_code, is_active = true } = row;

  const form: Partial<ComboVariantDTO> = {
    ...row,
    name: name ?? "",
    COMBO_name: name,
    SKU_code: SKU_code ?? "",
    COMBO_note: note,
    is_active,
    note: note ?? "",
    sale_price: sale_price ?? 0,
    neo_price: neo_price ?? 0,
    bar_code: bar_code ?? "",
    tags: row?.tags
      ? reduce(
          row.tags,
          (prev: string[], cur) => {
            const { name = "", id = "" } = cur;
            return [...prev, name || id];
          },
          [],
        )
      : undefined,
  };
  return form;
};
