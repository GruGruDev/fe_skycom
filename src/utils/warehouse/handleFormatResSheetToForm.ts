import reduce from "lodash/reduce";
import { TBatchSheet, TSheetDetail, TSheetDetailDTO } from "types/Sheet";

export const handleFormatResSheetToForm = (row: Partial<TSheetDetailDTO> = {}) => {
  const sheetDetail = reduce(
    row.sheet_detail,
    (prev: Partial<TSheetDetail>[], cur) => {
      const { product_variant_batch } = cur;

      const batch: Partial<TBatchSheet> = {
        batch_name: product_variant_batch?.name,
        batch_id: product_variant_batch?.id,
      };
      return [
        ...prev,
        {
          ...cur,
          ...product_variant_batch?.product_variant,
          batches: product_variant_batch ? [batch] : [],
        },
      ];
    },
    [],
  );
  return {
    ...row,
    sheet_detail: sheetDetail.length ? sheetDetail : undefined,
    warehouse: row.warehouse?.id,
    change_reason: row.change_reason?.id,
    warehouse_from: row.warehouse_from?.id,
    warehouse_to: row.warehouse_to?.id,
    note: row.note ?? "",
  };
};
