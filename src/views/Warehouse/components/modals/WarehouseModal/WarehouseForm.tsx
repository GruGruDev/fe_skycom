import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import { RHFTextField } from "components/HookFormFields";
import { MultiSelect } from "components/Selectors";
import { ZINDEX_SYSTEM } from "constants/index";
import { LABEL } from "constants/label";
import { WAREHOUSE_LABEL } from "constants/warehouse/label";
import useAddressHook from "hooks/useAddressHook";
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { WarehouseDTO } from "types/Warehouse";

interface Props extends UseFormReturn<WarehouseDTO, object> {}

const WarehouseForm = ({ control, getValues, setValue }: Props) => {
  const { districtOptions, provinceOptions, wardOptions, getDistricts, getWards } =
    useAddressHook();

  const { address } = getValues();

  useEffect(() => {
    getDistricts(address?.ward?.province_id);
  }, [address?.ward?.province_id, getDistricts]);

  useEffect(() => {
    getWards(address?.ward?.district_id);
  }, [address?.ward?.district_id, getWards]);

  return (
    <Grid container spacing={2} rowGap={2}>
      <Grid item lg={6} sm={6} xs={6}>
        <RHFTextField
          name="name"
          label={WAREHOUSE_LABEL.name}
          placeholder={WAREHOUSE_LABEL.name}
          required
        />
      </Grid>
      <Grid item lg={6} sm={6} xs={6}>
        <RHFTextField
          name="manager_phone"
          label={WAREHOUSE_LABEL.manager_phone}
          placeholder={WAREHOUSE_LABEL.manager_phone}
          required
          InputProps={{
            endAdornment: (
              <Tooltip title={WAREHOUSE_LABEL.shipping_phone_number} placement="right-end">
                <InputAdornment position="start">
                  <ContactSupportIcon fontSize="small" />
                </InputAdornment>
              </Tooltip>
            ),
          }}
        />
      </Grid>
      <Grid item lg={6} sm={6} xs={6}>
        <RHFTextField
          name="manager_name"
          label={WAREHOUSE_LABEL.manager_name}
          placeholder={WAREHOUSE_LABEL.manager_name}
          required
        />
      </Grid>
      <Grid item lg={6} sm={6} xs={6}>
        <RHFTextField
          name="note"
          label={WAREHOUSE_LABEL.warehouse_note}
          placeholder={WAREHOUSE_LABEL.warehouse_note}
        />
      </Grid>
      <Grid item lg={6} sm={6} xs={6}>
        <Controller
          name={"is_default"}
          control={control}
          render={({ field: { value = false, onChange } }) => {
            return (
              <FormControlLabel
                onChange={(_e, value) => onChange(value)}
                control={<Checkbox checked={value} />}
                label="Kho giao"
              />
            );
          }}
        />
      </Grid>
      <Grid item lg={6} sm={6} xs={6}>
        <Controller
          name={"is_sales"}
          control={control}
          render={({ field: { value = false, onChange } }) => (
            <FormControlLabel
              control={<Checkbox checked={value} />}
              label={WAREHOUSE_LABEL.is_sales}
              onChange={(_e, value) => onChange(value)}
            />
          )}
        />
      </Grid>

      <Grid item container xs={12} spacing={3}>
        <Grid item xs={12}>
          <RHFTextField
            name="address.address"
            label={WAREHOUSE_LABEL.address_address}
            placeholder={LABEL.INPUT}
            required
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="address.ward.province_id"
            control={control}
            render={({ field: { value = "", onChange }, fieldState: { error } }) => (
              <MultiSelect
                value={value}
                onChange={(value) => {
                  onChange(value);
                  getDistricts(value.toString());
                  setValue("address.ward", {
                    ...address.ward,
                    district_id: "",
                    ward_id: "",
                    code: "",
                  });
                }}
                zIndex={ZINDEX_SYSTEM.selector}
                title={WAREHOUSE_LABEL.select_province}
                size="medium"
                outlined
                fullWidth
                selectorId="province"
                options={provinceOptions}
                simpleSelect
                required
                error={error}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="address.ward.district_id"
            control={control}
            render={({ field: { value = "", onChange }, fieldState: { error } }) => (
              <MultiSelect
                value={value}
                onChange={(value) => {
                  onChange(value);
                  getWards(value.toString());
                  setValue("address.ward", { ...address.ward, ward_id: "", code: "" });
                }}
                error={error}
                zIndex={ZINDEX_SYSTEM.selector}
                title={WAREHOUSE_LABEL.select_district}
                size="medium"
                outlined
                fullWidth
                selectorId="district"
                options={districtOptions}
                simpleSelect
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="address.ward.ward_id"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <MultiSelect
                  {...field}
                  zIndex={ZINDEX_SYSTEM.selector}
                  title={WAREHOUSE_LABEL.select_ward}
                  size="medium"
                  outlined
                  fullWidth
                  selectorId="ward"
                  error={error}
                  options={wardOptions}
                  simpleSelect
                  required
                />
              );
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WarehouseForm;
