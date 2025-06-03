import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { MultiSelect, ValueSelectorType } from "components/Selectors";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { ZINDEX_SYSTEM } from "constants/index";
import useAddressHook from "hooks/useAddressHook";
import map from "lodash/map";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { TAddress } from "types/Address";

interface Props {
  errors?: FieldErrors<TAddress>;
  setValue: UseFormSetValue<TAddress>;
  address?: TAddress;
}

// khi update customer => cho phép thêm hoặc xoá phone khi thao tác với input mà không cần update phone trong customer form nữa

const AddressInput = ({ errors, setValue, address }: Props) => {
  const { districts, getDistricts, getWards, provinces, wards } = useAddressHook();

  const handleChangeProvince = async (value: ValueSelectorType) => {
    setValue(
      "ward",
      {
        ...address?.ward,
        province_id: value.toString(),
        district_id: "",
        ward_id: "",
        code: "",
      },
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    getDistricts(value.toString());
  };

  const handleChangeDistrict = async (value: ValueSelectorType) => {
    setValue(
      "ward",
      {
        ...address?.ward,
        district_id: value.toString(),
        ward_id: "",
        code: "",
      },
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    getWards(value.toString());
  };

  const handleChangeWard = async (value: ValueSelectorType) => {
    setValue(
      "ward",
      {
        ...address?.ward,
        ward_id: value.toString(),
        code: value.toString(),
      },
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  return (
    <Box width="100%">
      <Grid container spacing={2} marginTop={0.2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={CUSTOMER_LABEL.addresses}
            defaultValue={address?.address}
            onChange={(e) => {
              setValue("address", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            error={!!errors?.address}
            helperText={errors?.address?.message}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MultiSelect
            options={map(provinces, (item) => ({
              value: item.code,
              label: item.label,
            }))}
            outlined
            size="medium"
            fullWidth
            title={CUSTOMER_LABEL.province}
            value={address?.ward?.province_id}
            onChange={handleChangeProvince}
            error={errors?.ward?.province_id}
            simpleSelect
            selectorId="province-id-selector"
            zIndex={ZINDEX_SYSTEM.selector}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MultiSelect
            options={map(districts, (item) => ({
              value: item.code,
              label: item.label,
            }))}
            outlined
            size="medium"
            fullWidth
            title={CUSTOMER_LABEL.district}
            value={address?.ward?.district_id}
            onChange={handleChangeDistrict}
            error={errors?.ward?.district_id}
            simpleSelect
            selectorId="district-id-selector"
            zIndex={ZINDEX_SYSTEM.selector}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MultiSelect
            options={map(wards, (item) => ({ value: item.code, label: item.label }))}
            outlined
            size="medium"
            fullWidth
            title={CUSTOMER_LABEL.ward}
            value={address?.ward?.ward_id}
            onChange={handleChangeWard}
            error={errors?.ward?.ward_id}
            simpleSelect
            selectorId="ward-id-selector"
            zIndex={ZINDEX_SYSTEM.selector}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressInput;
