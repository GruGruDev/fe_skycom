import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { warehouseApi } from "apis/warehouse";
import { NoDataPanel } from "components/NoDataPanel";
import { MultiSelect, ValueSelectorType } from "components/Selectors";
import { BUTTON } from "constants/button";
import { ZINDEX_SYSTEM } from "constants/index";
import { LABEL } from "constants/label";
import { BATCH_INPUT_LABEL, QUANTITY_INPUT_LABEL, SHEET_TYPE_VALUE } from "constants/warehouse";
import { SHEET_LABEL } from "constants/warehouse/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import map from "lodash/map";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { TParams } from "types/Param";
import { TVariantDetail } from "types/Product";
import { TSelectOption } from "types/SelectOption";
import { CONFIRM_LABEL, TSheet, TSheetDetail, TSheetType } from "types/Sheet";
import { SearchVariantInWarehousePopover } from "./SearchVariantInWarehousePopover";
import SheetItem from "./SheetItem";
import SheetTypeGroup from "./SheetTypeGroup";
import OrderSelectorField from "components/Fields/OrderSelectorField";
import { TOrderV2 } from "types/Order";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import chunk from "lodash/chunk";
import LinearProgress from "@mui/material/LinearProgress";

export interface TSheetForm extends UseFormReturn<TSheet, object> {
  rowId?: string;
  isDefaultConfirm?: boolean;
  isDefaultDelete?: boolean;
  searchVariantParams?: TParams;
  variantIds?: string[];
  defaultType?: TSheetType;
  orderDefault?: Partial<TOrderV2>;
}

const SheetForm = ({
  control,
  watch,
  rowId,
  isDefaultConfirm,
  isDefaultDelete,
  setValue,
  searchVariantParams,
  defaultType,
  variantIds,
  orderDefault,
}: TSheetForm) => {
  const { inventoryReasons, warehouses } = useAppSelector(getDraftSafeSelector("warehouses"));
  const { warehouse, warehouse_from, is_confirm, is_delete, type, sheet_detail, order, order_key } =
    watch();

  const [loading, setLoading] = useState(false);

  const handleChangeSheetItem = (
    idx: number,
    sheet: Partial<TSheetDetail>,
    field: ControllerRenderProps<TSheet, "sheet_detail">,
  ) => {
    const { value = [], onChange } = field;
    const newSheetDetail = [...value];
    newSheetDetail.splice(idx, 1, sheet);
    onChange(newSheetDetail);
  };

  const getAllInventory = useCallback(
    async (variantId: string) => {
      if (!variantId) return;
      if (warehouse || warehouse_from) {
        const result = await warehouseApi.get<TVariantDetail>({
          params: {
            limit: 50,
            page: 1,
            variant: variantId,
            warehouse: warehouse || warehouse_from,
          },
          endpoint: "inventory-with-variant/",
        });
        if (result?.data) {
          const { results = [] } = result.data;
          return results[0] as any;
        } else {
          return [];
        }
      }
    },
    [warehouse, warehouse_from],
  );

  const handleChangeWarehouseFrom = (
    field: ControllerRenderProps<TSheet, "warehouse_from">,
    value: ValueSelectorType,
  ) => {
    setValue("warehouse_to", "");
    field.onChange(value);
  };

  const handleRemoveVariant = (
    idx: number,
    _variant: Partial<TSheetDetail>,
    field: ControllerRenderProps<TSheet, "sheet_detail">,
  ) => {
    const { value = [], onChange } = field;
    const newSheetDetail = [...value];
    newSheetDetail.splice(idx, 1);
    onChange(newSheetDetail);
  };

  useEffect(() => {
    if (!warehouse && !warehouse_from) return;
    if (!variantIds?.length) return;

    const getSheetDetail = async () => {
      setLoading(true);
      let inventories: any[] = [];
      const chunks = chunk(variantIds, 4);

      for (const batch of chunks) {
        const batchResults = await Promise.all(batch.map((id) => getAllInventory(id)));
        inventories = [...inventories, ...batchResults];
      }

      // await Promise.all(map(variantIds, (id) => getAllInventory(id)));
      const sheet_detail_with_batch = map(inventories, (item, index) => {
        return { ...item, ...sheet_detail[index] };
      });
      setValue("sheet_detail", sheet_detail_with_batch);
      setLoading(false);
    };
    getSheetDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllInventory, setValue, variantIds, warehouse, warehouse_from]);

  const inventoryReasonOptions = reduce(
    inventoryReasons,
    (prev: TSelectOption[], cur) => {
      if (cur.name && cur.id && cur.type === type) {
        return [...prev, { label: cur.name, value: cur.id }];
      }
      return prev;
    },
    [],
  );

  const reasonLabel = type && SHEET_TYPE_VALUE[type];
  const batchInputLabel = type && BATCH_INPUT_LABEL[type];
  const quantityInputLabel = type && QUANTITY_INPUT_LABEL[type];

  // cập nhật params search variant trong warehouse
  const searchParams = useMemo(() => {
    return {
      warehouse:
        type === "CK" || type === "EP" ? warehouse : type === "TF" ? warehouse_from : warehouse,
      ...searchVariantParams,
    };
  }, [warehouse, warehouse_from, type, searchVariantParams]);

  const warehouseOptions = reduce(
    warehouses,
    (prev: TSelectOption[], cur) => {
      if (cur.name && cur.id) {
        return [...prev, { label: cur.name, value: cur.id }];
      }
      return prev;
    },
    [],
  );

  useEffect(() => {
    setValue("order_key", order?.order_key, { shouldDirty: true, shouldValidate: true });
  }, [order, setValue]);

  return (
    <Box>
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {!defaultType && <SheetTypeGroup control={control} />}
        </Grid>
        <Grid item xs={12} sm={7}>
          <Stack width="100%" spacing={2}>
            {type === "EP" || type === "CK" || type === "IP" ? (
              <Controller
                name={"warehouse"}
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <MultiSelect
                      {...field}
                      zIndex={ZINDEX_SYSTEM.selector}
                      disabled={!!rowId}
                      title={"Kho"}
                      size="medium"
                      selectorId={`id-warehouse`}
                      fullWidth
                      outlined
                      error={error}
                      options={warehouseOptions}
                      simpleSelect
                      required
                    />
                  );
                }}
              />
            ) : null}
            {type === "TF" ? (
              <Controller
                name={"warehouse_from"}
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <MultiSelect
                      {...field}
                      onChange={(value) => handleChangeWarehouseFrom(field, value)}
                      disabled={!!rowId}
                      zIndex={ZINDEX_SYSTEM.selector}
                      title={SHEET_LABEL.from_warehouse}
                      size="medium"
                      selectorId={`id-warehouse-from`}
                      fullWidth
                      outlined
                      error={error}
                      options={warehouseOptions}
                      simpleSelect
                      required
                    />
                  );
                }}
              />
            ) : null}
            <Controller
              name="sheet_detail"
              control={control}
              render={({ field, fieldState: { error } }) => {
                const { value = [] } = field;
                return (
                  <>
                    {variantIds?.length ? null : (
                      <SearchVariantInWarehousePopover
                        value={value}
                        isMultiple
                        placeholder={LABEL.SEARCH}
                        params={searchParams}
                        handleSelectVariant={field.onChange}
                        message={error?.message}
                        disabled={!!rowId || !(warehouse || warehouse_from)}
                      />
                    )}
                    {value.length ? (
                      <Grid container spacing={1} mt={2} width={"100%"}>
                        {map(value, (item, index) => (
                          <SheetItem
                            sheet={item}
                            handleChangeSheet={(sheet) =>
                              handleChangeSheetItem(index, sheet, field)
                            }
                            handleRemoveVariant={(variant) =>
                              handleRemoveVariant(index, variant, field)
                            }
                            key={item?.SKU_code}
                            error={(error as any)?.[index]}
                            disabled={!!rowId || loading}
                            requireMax={type === "TF" || type === "EP"}
                            batchInputLabel={batchInputLabel}
                            quantityInputLabel={quantityInputLabel}
                            isShowdifferentQuantity={type === "CK" && !rowId}
                            type={type}
                            warehouse={warehouse || warehouse_from}
                            rowId={rowId}
                          />
                        ))}
                      </Grid>
                    ) : (
                      <NoDataPanel message={SHEET_LABEL.select_product} />
                    )}
                  </>
                );
              }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Stack width="100%" spacing={2}>
            {type === "EP" || type === "IP" ? (
              <Controller
                name={"order"}
                control={control}
                render={({ field }) => {
                  return (
                    <OrderSelectorField
                      {...field}
                      size="medium"
                      value={field.value?.id || ""}
                      order={orderDefault}
                      fullWidth
                      placeholder={SHEET_LABEL.include_symbol}
                      title={SHEET_LABEL.order_key}
                      disabled={is_confirm || is_delete}
                      error={
                        field.value && field.value?.status != "completed"
                          ? { type: "value", message: VALIDATION_MESSAGE.ORDER_NOT_CONFIRM }
                          : undefined
                      }
                    />
                  );
                }}
              />
            ) : null}
            {/* transfer */}
            {type === "TF" ? (
              <Controller
                name={"warehouse_to"}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <MultiSelect
                    {...field}
                    zIndex={ZINDEX_SYSTEM.selector}
                    title={SHEET_LABEL.warehouse_to}
                    size="medium"
                    disabled={!!rowId}
                    selectorId={`id-warehouse-to`}
                    fullWidth
                    outlined
                    error={error}
                    options={warehouseOptions}
                    simpleSelect
                    required
                  />
                )}
              />
            ) : null}
            {/* --------------- */}
            <Controller
              name={"change_reason"}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MultiSelect
                  {...field}
                  zIndex={ZINDEX_SYSTEM.selector}
                  title={`${SHEET_LABEL.change_reason} ${reasonLabel}`}
                  disabled={!!rowId}
                  size="medium"
                  selectorId={`id-change-reason`}
                  fullWidth
                  outlined
                  error={error}
                  options={inventoryReasonOptions}
                  simpleSelect
                  required
                />
              )}
            />
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
              <Controller
                name={"is_confirm"}
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    sx={{
                      pointerEvents: isDefaultConfirm ? "none" : "auto",
                    }}
                    control={
                      <Switch
                        checked={!!field.value}
                        onChange={(value) => field.onChange(value.target.checked)}
                        disabled={
                          isDefaultDelete ||
                          is_delete ||
                          !!(order_key && order?.status !== "completed")
                        }
                      />
                    }
                    label={SHEET_LABEL[CONFIRM_LABEL.confirmed]}
                  />
                )}
              />
              {!!rowId && (
                <Controller
                  name={"is_delete"}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      sx={{
                        pointerEvents: isDefaultDelete ? "none" : "auto",
                      }}
                      control={
                        <Switch
                          color="error"
                          checked={!!field.value}
                          onChange={(value) => field.onChange(value.target.checked)}
                          disabled={isDefaultConfirm || is_confirm}
                        />
                      }
                      label={BUTTON.CANCEL_SHEET}
                    />
                  )}
                />
              )}
            </Stack>
            <Controller
              name={"note"}
              control={control}
              render={({ field }) => (
                <TextField
                  defaultValue={field.value}
                  {...field}
                  value={field.value}
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder={SHEET_LABEL.note}
                />
              )}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SheetForm;
