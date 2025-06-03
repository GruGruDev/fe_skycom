import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { MButton } from "components/Buttons";
import { formatValueChangeMultiSelector } from "components/Selectors";
import { GridWrapHeaderProps, HeaderWrapper } from "components/Table/Header";
import { BUTTON } from "constants/button";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { TAttribute } from "types/Attribute";
import { TSheet, TSheetFilterProps } from "types/Sheet";
import { checkPermission } from "utils/roleUtils";
import { SheetChipType, sheetFilterChips } from "utils/warehouse/sheetFilterChips";
import { SheetFilterOptionType, sheetFilterOptions } from "utils/warehouse/sheetFilterOptions";
import { useState } from "react";
import reduce from "lodash/reduce";
import { TSelectOption } from "types/SelectOption";
import { FormSheetModalProps } from "components/Sheet/SheetModal";

export interface HeaderWarehouseProps
  extends Partial<TSheetFilterProps>,
    Partial<
      Omit<
        GridWrapHeaderProps,
        | "filterChipCount"
        | "setFilterCount"
        | "onClearAll"
        | "onDelete"
        | "rightChildren"
        | "filterOptions"
        | "filterChipOptions"
      > &
        FormSheetModalProps &
        SheetFilterOptionType &
        SheetChipType
    > {
  isAdd?: boolean;
  isScanCode?: boolean;
  setFormOpen?: (value: boolean) => void;
  setFormScan?: (value: boolean) => void;
  inventoryReasons?: TAttribute[];
  onConfirmSheet?: () => Promise<boolean>;
}

const Header = (props: HeaderWarehouseProps) => {
  const { user } = useAuth();
  const {
    isAdd,
    isScanCode,
    params,
    setFormOpen,
    setFormScan,
    setParams,
    inventoryReasons = [],
    onConfirmSheet,
    type,
  } = props;
  const { users } = useAppSelector(getDraftSafeSelector("users"));
  const { warehouses } = useAppSelector(getDraftSafeSelector("warehouses"));
  const { attributes } = useAppSelector(getDraftSafeSelector("product"));

  const [loading, setLoading] = useState(false);

  const onSetParams = (
    name: keyof TSheet,
    value: string | number | "all" | "none" | (string | number)[],
  ) => {
    const formatValue = formatValueChangeMultiSelector(value);
    setParams?.({ ...params, [name]: formatValue, page: 1 });
  };

  const handleConfirmSheet = async () => {
    setLoading(true);
    await onConfirmSheet?.();
    setLoading(false);
  };

  const isReadAndWriteScanSheet = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.SCAN],
    user,
  ).isReadAndWrite;

  const inventoryReasonOptions = inventoryReasons?.filter((item) => item.type === type);

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

  const productCategoryOptions = reduce(
    attributes.category,
    (prev: TSelectOption[], cur) => {
      if (cur.name && cur.id) {
        return [...prev, { label: cur.name, value: cur.id }];
      }
      return prev;
    },
    [],
  );

  return (
    <HeaderWrapper
      rightChildren={
        <>
          {isScanCode && isReadAndWriteScanSheet && (
            <Grid item>
              <MButton onClick={() => setFormScan?.(true)}>
                <QrCodeScannerIcon />
                {BUTTON.SCAN_CODE}
              </MButton>
            </Grid>
          )}
          {isAdd && (
            <Grid item>
              <MButton onClick={() => setFormOpen?.(true)}>
                <AddIcon />
                {BUTTON.ADD}
              </MButton>
            </Grid>
          )}
        </>
      }
      filterOptions={sheetFilterOptions({
        onSetParams,
        users,
        warehouseOptions,
        inventoryReasonOptions,
        productCategoryOptions,
        type,
        ...props,
      })}
      filterChipOptions={sheetFilterChips({
        users,
        warehouseOptions,
        inventoryReasonOptions,
        productCategoryOptions,
        type,
        ...props,
      })}
      {...props}
    >
      <Stack direction="row" justifyContent="flex-end" width="100%">
        {onConfirmSheet && (
          <MButton onClick={handleConfirmSheet} loading={loading}>
            {BUTTON.CONFIRM}
          </MButton>
        )}
      </Stack>
    </HeaderWrapper>
  );
};

export default Header;
