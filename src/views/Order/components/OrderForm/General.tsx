import { SxProps, Theme } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { orderApi } from "apis/order";
import { CommasField, TagField } from "components/Fields";
import { MDatetimePicker } from "components/Pickers";
import { GridLineLabel, Section, Span, TitleSection } from "components/Texts";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ORDER_STATUS } from "constants/order";
import { ORDER_LABEL } from "constants/order/label";
import { ROLE_ORDER, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import React, { useCallback, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import { TAttribute } from "types/Attribute";
import { OrderDTOV2, TOrderStatusValue } from "types/Order";
import { PaletteColor, TStyles } from "types/Styles";
import { fDateTime } from "utils/date";
import { findOption } from "utils/option";
import { checkPermission } from "utils/roleUtils";
import { showError, showWarning } from "utils/toast";

interface Props extends Partial<OrderDTOV2> {
  onChange: <T extends keyof OrderDTOV2>(key: T, value?: OrderDTOV2[T]) => void;
  errors: FieldErrors<OrderDTOV2>;
  style?: React.CSSProperties;
  sale_note?: string;
  defaultTagOptions?: TAttribute[];
  defaultStatus?: TOrderStatusValue;
  isAvailableInventory?: boolean;
  orderID?: string;
  isConfirm?: boolean;
}

const General = ({
  onChange,
  errors,
  sale_note = "",
  value_cross_sale,
  tags,
  status,
  defaultTagOptions,
  appointment_date,
  complete_time,
  created,
  created_by,
  is_print,
  defaultStatus,
  isAvailableInventory,
  customer,
  cancel_reason,
  orderID,
  isConfirm,
}: Props) => {
  const { user } = useAuth();
  const users = useAppSelector(getDraftSafeSelector("users")).users;

  const isOwner = user?.id === created_by;
  const isConfirmRole = !orderID || true || (isOwner && true);

  const [tagOptions, setTagOptions] = useState<TAttribute[]>([]);
  const getTags = useCallback(async () => {
    const result = await orderApi.get<{ id: string; name: string }>({
      endpoint: "tags/",
      params: { limit: 200, page: 1 },
    });
    if (result?.data) {
      setTagOptions(result.data.results);
    }
  }, []);

  const labels = ORDER_STATUS.reduce(
    (prev: { [key: string]: string }, current) => ({ ...prev, [current.value]: current.label }),
    {},
  );
  const colors = ORDER_STATUS.reduce(
    (prev: { [key: string]: string | undefined }, current) => ({
      ...prev,
      [current.value]: current.color,
    }),
    {},
  );

  const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    // tồn khả dụng
    if (isAvailableInventory) {
      // không có customer
      if (!customer?.id) {
        showError(VALIDATION_MESSAGE.REQUIRE_CUSTOMER);
        return;
      }
      if (!isConfirmRole) {
        showError(VALIDATION_MESSAGE.CANNOT_CONFIRM_ORDER_ROLE);
        return;
      }
      if (e.target.checked) {
        onChange("status", "completed");
      } else {
        onChange("status", defaultStatus || "draft");
      }
    } else {
      showWarning(VALIDATION_MESSAGE.NOT_ENOUGH_INVENTORY);
    }
  };

  useEffect(() => {
    if (defaultTagOptions) {
      setTagOptions(defaultTagOptions);
    } else {
      getTags();
    }
  }, [defaultTagOptions, getTags]);

  const createdBy = findOption(users, created_by);

  // có quyền xác nhận đơn
  const isConfirmOrder = checkPermission(
    user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.CONFIRM],
    user,
  ).isMatch;

  return (
    <Section elevation={3}>
      <TitleSection>{ORDER_LABEL.general}</TitleSection>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={1} mt={0}>
        <Grid item xs={12} style={styles.span}>
          <Span color={colors[status || "draft"] as PaletteColor} sx={sx.chip}>
            {labels[status || "draft"] || "---"}
          </Span>
        </Grid>
        {is_print && (
          <Grid item xs={12} style={styles.span}>
            <Span color={"success"} sx={sx.chip}>
              {ORDER_LABEL.printed}
            </Span>
          </Grid>
        )}
        {cancel_reason && (
          <Grid item xs={12}>
            <GridLineLabel
              label={`${ORDER_LABEL.cancel_reason}:`}
              value={(cancel_reason as TAttribute).name}
            />
          </Grid>
        )}
        {created && (
          <Grid item xs={12}>
            <Stack direction="column" spacing={1}>
              <GridLineLabel label={`${ORDER_LABEL.created}:`} value={fDateTime(created)} />
              <GridLineLabel label={`${ORDER_LABEL.created_by}:`} value={createdBy?.name} />
              <GridLineLabel
                label={`${ORDER_LABEL.complete_time}:`}
                value={fDateTime(complete_time) || "---"}
              />
            </Stack>
          </Grid>
        )}

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={status === "completed" || isConfirm}
                onChange={handleChangeStatus}
                name="status"
                disabled={isConfirm || !isConfirmOrder}
              />
            }
            label={ORDER_LABEL.confirm}
            sx={{ ".MuiTypography-root": { fontSize: "0.82rem", fontWeight: 500 } }}
          />
        </Grid>

        <Grid item xs={12}>
          <MDatetimePicker
            onChange={(date) => onChange("appointment_date", date)}
            label={ORDER_LABEL.appointment_time}
            value={appointment_date}
            disabled={isConfirm}
            disablePast
            slotProps={{
              textField: { fullWidth: true, size: "small", placeholder: ORDER_LABEL.call_date },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <CommasField
            InputLabelProps={{ shrink: true }}
            onChange={(value) => onChange("value_cross_sale", parseInt(value.toString()))}
            size="small"
            fullWidth
            label={ORDER_LABEL.value_cross_sale}
            value={value_cross_sale}
            error={!!errors.value_cross_sale}
            helperText={errors.value_cross_sale?.message}
            disabled={isConfirm}
            unit={1000}
          />
        </Grid>

        <Grid item xs={12}>
          <TagField
            inputProps={{ InputLabelProps: { shrink: true } }}
            helperText={(errors?.tags as { message: string } | undefined)?.message}
            onSubmit={(value) => {
              onChange("tags", value as string[]);
            }}
            options={tagOptions}
            returnType="id"
            value={tags}
            size="small"
            label={ORDER_LABEL.tags}
            disabled={isConfirm}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label={ORDER_LABEL.internal_note}
            value={sale_note}
            onChange={(e) => onChange("sale_note", e.target.value)}
            InputLabelProps={{ shrink: true }}
            error={!!errors.sale_note}
            helperText={errors.sale_note?.message}
            // disabled={isConfirm}
          />
        </Grid>
      </Grid>
    </Section>
  );
};

export default General;

const sx: { [key: string]: SxProps<Theme> } = {
  handler: {
    fontWeight: 600,
    fontSize: "0.82rem",

    color: "primary.main",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};

const styles: TStyles<"span" | "skeleton"> = {
  span: { paddingTop: 8 },
  skeleton: { transform: "scale(1)" },
};
