import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { productApi } from "apis/product";
import { NumberInputField } from "components/Fields";
import { MultiSelect } from "components/Selectors";
import { GridLineLabel, Span } from "components/Texts";
import { SHEET_LABEL, WAREHOUSE_LABEL } from "constants/warehouse/label";
import isEmpty from "lodash/isEmpty";
import reduce from "lodash/reduce";
import { FieldError, FieldErrors } from "react-hook-form";
import { TBatch } from "types/Product";
import { TSelectOption } from "types/SelectOption";
import { TSheetDetail, TSheetType } from "types/Sheet";
import { TStyles } from "types/Styles";
import { formatFloatToString } from "utils/number";
import { findOption } from "utils/option";
import InventoryItem from "./InventoryItem";

interface Props extends EditorProps {
  rowId?: string;
}
export default function SheetItem(props: Props) {
  if (props.rowId) {
    return <Viewer {...props} />;
  }
  return <Editor {...props} />;
}

interface ViewerProps {
  sheet: Partial<TSheetDetail>;
  handleChangeSheet: (sheet: Partial<TSheetDetail>) => void;
  handleRemoveVariant: (sheet: Partial<TSheetDetail>) => void;
  error?: FieldErrors<TSheetDetail>;
  disabled?: boolean;
  requireMax?: boolean;
  batchInputLabel?: string;
  quantityInputLabel?: string;
  isShowdifferentQuantity?: boolean;
  type?: TSheetType;
  warehouse: string;
}

const Viewer = (props: ViewerProps) => {
  const { sheet } = props;

  return (
    <Paper elevation={2} style={styles.wrapper}>
      <Grid container spacing={2} alignItems={"center"}>
        <Grid item xs={8}>
          <InventoryItem {...sheet} />
        </Grid>
        <Grid item xs={4}>
          <GridLineLabel
            label={`${SHEET_LABEL.batch}:`}
            value={sheet?.product_variant_batch?.name}
          />
          {!isEmpty(sheet.quantity_system) ? (
            <GridLineLabel
              label={`${SHEET_LABEL.quantity_system}:`}
              value={formatFloatToString((sheet?.quantity_system || 0).toString())}
            />
          ) : null}
          {!isEmpty(sheet.quantity) && (
            <GridLineLabel
              label={`${SHEET_LABEL.quantity}:`}
              value={formatFloatToString((sheet?.quantity || 0).toString())}
            />
          )}
          {!isEmpty(sheet.quantity_actual) && (
            <GridLineLabel
              label={`${SHEET_LABEL.quantity_actual}:`}
              value={formatFloatToString((sheet?.quantity_actual || 0).toString())}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

type EditorProps = {
  sheet: Partial<TSheetDetail>;
  handleChangeSheet: (sheet: Partial<TSheetDetail>) => void;
  handleRemoveVariant: (sheet: Partial<TSheetDetail>) => void;
  error?: FieldErrors<TSheetDetail>;
  disabled?: boolean;
  requireMax?: boolean;
  batchInputLabel?: string;
  quantityInputLabel?: string;
  isShowdifferentQuantity?: boolean;
  type?: TSheetType;
  warehouse: string;
};

const Editor = ({
  handleChangeSheet,
  handleRemoveVariant,
  sheet = {},
  error,
  disabled,
  requireMax,
  batchInputLabel,
  quantityInputLabel,
  isShowdifferentQuantity,
  warehouse,
  type,
}: EditorProps) => {
  const { batches = [] } = sheet;

  const addBatch = async (name: string) => {
    const res = await productApi.create<TBatch>({
      params: { name, product_variant: sheet.id },
      endpoint: "batches/",
    });
    if (res?.data) {
      const { id, name } = res.data;
      const newBatch = {
        batch_expire_date: "None",
        batch_id: id,
        batch_name: name,
        total_invetory: 0,
      };

      handleChangeSheet({ ...sheet, batches: [newBatch, ...batches] });
      return true;
    }
    return false;
  };

  const batchOptions = reduce(
    batches,
    (prev: TSelectOption[], cur) => {
      const {
        batch_id = "",
        batch_name = "",
        name = "",
        inventories = [],
        total_inventory = 0,
      } = cur;
      const batchOption = {
        value: batch_id,
        label: `${batch_name || name} - ${total_inventory}`,
        total_inventory,
      };
      if (type === "IP") {
        return [...prev, batchOption];
      }
      if (inventories[0]?.warehouse_id === warehouse) {
        return [...prev, batchOption];
      }
      return prev;
    },
    [],
  );

  const handleChangeBatch = (value: string) => {
    const batch = findOption(batches, value, "batch_id");

    const batchSheet: Partial<TBatch> = { id: batch?.batch_id, name: batch?.batch_name };
    handleChangeSheet({ ...sheet, product_variant_batch: batchSheet, quantity: 0 });
  };

  const batchQuantity =
    findOption(batches, sheet?.product_variant_batch?.id, "batch_id")?.total_inventory || 0;

  const differentQuantity = (sheet?.quantity || 0) - batchQuantity;

  return (
    <Paper elevation={2} style={styles.wrapper}>
      {!disabled && (
        <CancelIcon
          style={styles.removeIcon}
          color="disabled"
          onClick={() => handleRemoveVariant(sheet)}
        />
      )}
      <InventoryItem {...sheet} />
      <Divider />
      <Grid container spacing={2} p={2}>
        <Grid item xs={isShowdifferentQuantity ? 6 : 8}>
          <FormLabel style={styles.formLabel}>{batchInputLabel}</FormLabel>
          <MultiSelect
            disabled={disabled}
            options={batchOptions}
            onChange={(value) => handleChangeBatch(value.toString())}
            outlined
            selectorId="batch-selector"
            fullWidth
            simpleSelect
            placeholder={SHEET_LABEL.select_batch}
            value={sheet?.product_variant_batch?.id}
            error={error?.product_variant_batch as FieldError}
            onAddOption={(option) => addBatch(option.value.toString())}
            getSxCondition={(option) => (option?.total_inventory || 0) <= 0 && type !== "IP"}
            optionSx={{ backgroundColor: "warning.main" }}
          />
        </Grid>
        <Grid item xs={isShowdifferentQuantity ? 3 : 4}>
          <FormLabel style={styles.formLabel}>{quantityInputLabel}</FormLabel>
          <NumberInputField
            disabled={!sheet.product_variant_batch?.id || disabled}
            onChange={(value) => handleChangeSheet({ ...sheet, quantity: value })}
            value={Math.abs(sheet?.quantity || sheet?.quantity_actual || 0)}
            error={!!error?.quantity}
            helperText={error?.quantity?.message}
            maxQuantity={requireMax ? batchQuantity : undefined}
          />
        </Grid>
        {isShowdifferentQuantity && (
          <Grid item xs={3}>
            <FormLabel style={styles.formLabel}>{WAREHOUSE_LABEL.difference_quantity}</FormLabel>
            <Box mt={1}>
              <Span color={"warning"}>{formatFloatToString(differentQuantity.toString())}</Span>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

const styles: TStyles<"removeIcon" | "wrapper" | "formLabel"> = {
  wrapper: { width: "100%", marginTop: 8, position: "relative" },
  removeIcon: { position: "absolute", top: 0, right: 0, fontSize: "1.6rem", cursor: "pointer" },
  formLabel: { fontSize: "0.82rem" },
};
