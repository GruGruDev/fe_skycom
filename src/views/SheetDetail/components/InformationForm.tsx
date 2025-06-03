import { SxProps, Theme } from "@mui/material";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { GridLineLabel, LabelInfo, Span, TextInfo } from "components/Texts";
import { NONE } from "constants/index";
import { ORDER_STATUS } from "constants/order";
import { SHEET_LABEL } from "constants/warehouse/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import find from "lodash/find";
import { Control, Controller } from "react-hook-form";
import { TOrderV2 } from "types/Order";
import { SHEET_CONFIRM_LABEL, TSheet } from "types/Sheet";
import { fDateTime } from "utils/date";
import { findOption } from "utils/option";

interface Props {
  control: Control<Partial<TSheet>, any>;
  data: Partial<TSheet>;
  isConfirmed?: boolean;
  disabled?: boolean;
}

const InformationForm = ({ control, data, isConfirmed, disabled }: Props) => {
  const { users } = useAppSelector(getDraftSafeSelector("users"));
  const order = data.order as Partial<TOrderV2>;

  const sheetStatusDisplayer = () =>
    isConfirmed ? (
      <Chip size="small" color="success" label={SHEET_LABEL[SHEET_CONFIRM_LABEL.confirmed]} />
    ) : (
      <Chip size="small" color="info" label={SHEET_LABEL[SHEET_CONFIRM_LABEL.not_confirm]} />
    );

  const userName = (id?: string) => find(users, (user) => user.id === id)?.name;

  const orderStatus = findOption(ORDER_STATUS, order?.status, "value");

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <GridLineLabel
          displayType="grid"
          xsLabel={5}
          xsValue={7}
          label={<LabelInfo>{`${SHEET_LABEL.created}:`}</LabelInfo>}
          value={<TextInfo>{fDateTime(data?.created)}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <GridLineLabel
          displayType="grid"
          xsLabel={5}
          xsValue={7}
          label={<LabelInfo>{`${SHEET_LABEL.created_by}:`}</LabelInfo>}
          value={<TextInfo>{userName(data?.created_by)}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <GridLineLabel
          displayType="grid"
          xsLabel={5}
          xsValue={7}
          label={<LabelInfo>{`${SHEET_LABEL.modified}: `}</LabelInfo>}
          value={<TextInfo>{fDateTime(data?.modified)}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <GridLineLabel
          displayType="grid"
          xsLabel={5}
          xsValue={7}
          label={<LabelInfo>{`${SHEET_LABEL.modified_by}: `}</LabelInfo>}
          value={<TextInfo>{userName(data?.modified_by)}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <GridLineLabel
          displayType="grid"
          xsLabel={5}
          xsValue={7}
          label={<LabelInfo>{`${SHEET_LABEL.confirm_date}: `}</LabelInfo>}
          value={<TextInfo>{fDateTime(data?.confirm_date)}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <GridLineLabel
          displayType="grid"
          xsLabel={5}
          xsValue={7}
          label={<LabelInfo>{`${SHEET_LABEL.confirm_by}: `}</LabelInfo>}
          value={<TextInfo>{userName(data?.confirm_by)}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <GridLineLabel
          displayType="grid"
          xsLabel={5}
          xsValue={7}
          label={<LabelInfo>{`${SHEET_LABEL.order_key}: `}</LabelInfo>}
          value={
            order?.order_key ? (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Link href={`${window.location.origin}/orders/${order?.id}`}>
                  {order?.order_key}
                </Link>
                <Span color={orderStatus?.color} sx={styles.chip}>
                  {orderStatus?.label || "---"}
                </Span>
              </Stack>
            ) : (
              <TextInfo>{NONE}</TextInfo>
            )
          }
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <GridLineLabel
          displayType="grid"
          xsLabel={5}
          xsValue={7}
          label={<LabelInfo>{`${SHEET_LABEL.change_reason}: `}</LabelInfo>}
          value={<TextInfo>{data?.change_reason}</TextInfo>}
        />
      </Grid>

      {data.type !== "TF" && (
        <Grid item xs={12} sm={12} md={12}>
          <Grid item xs={12} sm={6} md={4}>
            <GridLineLabel
              displayType="grid"
              xsLabel={5}
              xsValue={7}
              label={<LabelInfo>{`${SHEET_LABEL.warehouse}: `}</LabelInfo>}
              value={<TextInfo>{data?.warehouse}</TextInfo>}
            />
          </Grid>
        </Grid>
      )}
      {data.type === "TF" && (
        <>
          <Grid item xs={12} sm={6} md={4}>
            <GridLineLabel
              displayType="grid"
              xsLabel={5}
              xsValue={7}
              label={<LabelInfo>{`${SHEET_LABEL.warehouse_from}: `}</LabelInfo>}
              value={<TextInfo>{data?.warehouse_from}</TextInfo>}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <GridLineLabel
              displayType="grid"
              xsLabel={5}
              xsValue={7}
              label={<LabelInfo>{`${SHEET_LABEL.warehouse_to}: `}</LabelInfo>}
              value={<TextInfo>{data?.warehouse_to}</TextInfo>}
            />
          </Grid>
        </>
      )}

      <Grid item xs={12} sm={6} md={4}>
        <Grid item xs={12}>
          <Controller
            name="is_confirm"
            control={control}
            render={({ field }) => (
              <GridLineLabel
                displayType="grid"
                xsLabel={5}
                xsValue={7}
                label={<LabelInfo>{`${SHEET_LABEL.confirm}: `}</LabelInfo>}
                value={<Switch {...field} checked={field.value || false} disabled={disabled} />}
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <GridLineLabel
          displayType="grid"
          xsLabel={5}
          xsValue={7}
          label={<LabelInfo>{`${SHEET_LABEL.is_confirm}: `}</LabelInfo>}
          value={sheetStatusDisplayer()}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Controller
          name="note"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <GridLineLabel
              displayType="grid"
              xsLabel={5}
              xsValue={7}
              label={<LabelInfo>{`${SHEET_LABEL.note}: `}</LabelInfo>}
              value={
                <TextField
                  defaultValue={field.value}
                  {...field}
                  value={field.value || ""}
                  error={!!error}
                  helperText={error?.message}
                  required
                  placeholder={SHEET_LABEL.note}
                  fullWidth
                  multiline
                  minRows={2}
                  sx={{ mt: 1 }}
                />
              }
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default InformationForm;

const styles: { [key: string]: SxProps<Theme> } = {
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};
