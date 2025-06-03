import { warehouseApi } from "apis/warehouse";
import { FormPopup, FormPopupProps } from "components/Popups";
import { BUTTON } from "constants/button";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import { SHEET_LABEL } from "constants/warehouse/label";
import useAuth from "hooks/useAuth";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TVariantDetail } from "types/Product";
import {
  SHEET_METHOD_LABEL,
  TSheet,
  TSheetDetailPayload,
  TSheetPayload,
  TSheetType,
} from "types/Sheet";
import { checkPermission } from "utils/roleUtils";
import { handleFormatResSheetToForm } from "utils/warehouse/handleFormatResSheetToForm";
import { sheetSchema } from "validations/sheet";
import SheetForm, { TSheetForm } from "./SheetForm";
import { getApiSheetEndpoint } from "utils/warehouse/getApiSheetEndpoint";
import { TOrderV2 } from "types/Order";

const SHEET_FORM_DEFAULT = { note: "" };

export interface FormSheetModalProps extends Partial<TSheetForm> {
  onRefresh?: () => void;
  row?: Partial<TSheet>;
  onClose?: () => void;
  defaultType?: TSheetType;
  defaultOrder?: Partial<TOrderV2>;
  open?: boolean;
  variants?: Partial<TVariantDetail>[];
  fullScreen?: boolean;
}

const SheetModal = ({
  onClose,
  onRefresh,
  open = false,
  defaultType,
  defaultOrder,
  row,
  searchVariantParams,
  fullScreen,
  variants,
}: FormSheetModalProps) => {
  const endpoint = getApiSheetEndpoint(defaultType);

  const { user } = useAuth();
  const [sheetModal, setSheetModal] =
    useState<Omit<FormPopupProps, "handleClose" | "handleSubmitPopup">>();

  const closeModal = () => {
    onClose?.();
  };

  const handleSubmit = async (form: Partial<TSheet>) => {
    const { sheet_detail, is_confirm, order_key } = form;

    const type = form.type || defaultType;
    const sheetDetails = reduce(
      sheet_detail,
      (prev: Partial<TSheetDetailPayload>[], cur) => {
        const { product_variant_batch, quantity = 0 } = cur;

        const keyChange = type === "CK" ? "quantity_actual" : "quantity";

        const switchTypeQuantity = Number.isInteger(quantity)
          ? parseInt(quantity.toString())
          : quantity;

        const sheet = [
          ...prev,
          { product_variant_batch: product_variant_batch?.id, [keyChange]: switchTypeQuantity },
        ];
        return sheet;
      },
      [],
    );

    const payload: Partial<TSheetPayload> = {
      ...form,
      sheet_detail: sheetDetails.length ? sheetDetails : undefined,
      type,
      order_key,
    };

    setSheetModal((prev) => ({ ...prev, loading: true }));
    const endpoint = getApiSheetEndpoint(type);
    const res = row?.id
      ? await handleUpdateSheet(payload, endpoint)
      : await handleCreateSheet(
          { ...payload, is_confirm: is_confirm ? is_confirm : false },
          endpoint,
        );
    if (res) {
      onRefresh?.();
      closeModal();
    }
    setSheetModal((prev) => ({ ...prev, loading: false }));
  };

  const handleCreateSheet = async (form: Partial<TSheetPayload>, endpoint: string) => {
    const res = await warehouseApi.create({ params: form, endpoint });
    if (res.data) {
      return res.data;
    }
    return;
  };

  const handleUpdateSheet = async (form: Partial<TSheetPayload>, endpoint: string) => {
    const res = await warehouseApi.update({ params: form, endpoint: `${endpoint}${row?.id}/` });
    if (res.data) {
      return res.data;
    }
    return;
  };

  const getSheetDetail = useCallback(async () => {
    if (row?.sheet_detail) {
      setSheetModal((prev) => ({ ...prev, defaultData: row }));
    } else if (row?.id) {
      setSheetModal((prev) => ({ ...prev, loading: true }));
      const res = await warehouseApi.getById({ endpoint: `${endpoint}${row?.id}/` });
      if (res.data) {
        const form = handleFormatResSheetToForm(res.data);
        setSheetModal((prev) => ({ ...prev, defaultData: form, loading: false }));
      } else {
        setSheetModal((prev) => ({ ...prev, loading: false }));
      }
    }
  }, [endpoint, row]);

  useEffect(() => {
    if (open) {
      setSheetModal((prev) => ({
        ...prev,
        loading: false,
        funcContentSchema: (yup) =>
          sheetSchema(yup, !row?.id, defaultType, VALIDATION_MESSAGE.SELECT_PRODUCT),
        maxWidth: "xl",
        title: `${row?.id ? BUTTON.UPDATE : BUTTON.ADD} ${
          defaultType ? SHEET_LABEL[SHEET_METHOD_LABEL[defaultType]] : ""
        }`,
        buttonText: row?.id ? BUTTON.UPDATE : BUTTON.ADD,
        defaultData: {
          ...SHEET_FORM_DEFAULT,
          type: defaultType,
          sheet_detail: variants,
          order: defaultOrder,
        },
      }));
      getSheetDetail();
    } else {
      setSheetModal({});
    }
  }, [open, row, defaultType, getSheetDetail, variants, defaultOrder]);

  const isRnWImportSheet = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.IMPORT_SHEET],
    user,
  ).isReadAndWrite;
  const isRnWExport = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_SHEET],
    user,
  ).isReadAndWrite;
  const isRnWTransfer = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.TRANSFER_SHEET],
    user,
  ).isReadAndWrite;
  const isRnWCheck = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.CHECK_SHEET],
    user,
  ).isReadAndWrite;

  const variantIds = useMemo(() => {
    return reduce(
      variants,
      (prev: string[], cur) => {
        return [...prev, cur.id || ""];
      },
      [],
    );
  }, [variants]);

  return (
    <FormPopup
      funcContentRender={(methods) => {
        return (
          <SheetForm
            {...methods}
            defaultType={defaultType}
            rowId={row?.id}
            isDefaultConfirm={row?.is_confirm}
            isDefaultDelete={row?.is_delete}
            searchVariantParams={searchVariantParams}
            variantIds={variantIds}
            orderDefault={sheetModal?.defaultData?.order}
          />
        );
      }}
      handleClose={closeModal}
      handleSubmitPopup={handleSubmit}
      isDisabledSubmit={!(isRnWImportSheet && isRnWExport && isRnWTransfer && isRnWCheck)}
      {...sheetModal}
      open={open}
      fullScreen={fullScreen}
      maxWidth="lg"
    />
  );
};

export default SheetModal;
