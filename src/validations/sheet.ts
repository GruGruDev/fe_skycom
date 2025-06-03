import { SHEET_LABEL, WAREHOUSE_LABEL } from "constants/warehouse/label";
import { TSheet } from "types/Sheet";
import * as Yup from "yup";

export const sheetSchema = (
  yup: typeof Yup,
  isCreate?: boolean,
  type?: TSheet["type"],
  sheetDetailMessage?: string,
): { [key in keyof Partial<TSheet>]: Yup.BaseSchema } => {
  return {
    // type = xuất nhập kho
    warehouse:
      type !== "TF" ? yup.string().required(WAREHOUSE_LABEL.select_warehouse_please) : yup.string(),
    warehouse_from:
      type === "TF"
        ? yup.string().required(SHEET_LABEL.select_export_warehouse_please)
        : yup.string(),
    warehouse_to:
      type === "TF"
        ? yup.string().required(SHEET_LABEL.select_import_warehouse_please)
        : yup.string(),
    // change_reason: yup.string().required(SHEET_LABEL.select_reason_please),
    sheet_detail: yup
      .array()
      .of(
        yup.object().shape({
          product_variant_batch: yup.object().required(SHEET_LABEL.select_batch_please),
          quantity: isCreate
            ? type === "CK"
              ? yup.number().min(0)
              : yup
                  .number()
                  .min(1, SHEET_LABEL.select_quantity_please)
                  .required(SHEET_LABEL.select_quantity_please)
            : yup.number(),
        }),
      )
      .min(1, sheetDetailMessage)
      .required(sheetDetailMessage),
  };
};
