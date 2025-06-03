import { yupResolver } from "@hookform/resolvers/yup";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { FormDialog } from "components/Dialogs";
import { MultiSelect } from "components/Selectors";
import { BUTTON } from "constants/button";
import { ZINDEX_SYSTEM } from "constants/index";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import { WAREHOUSE_LABEL } from "constants/warehouse/label";
import useAddressHook from "hooks/useAddressHook";
import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { warehouseServices } from "services/warehouse";
import { TWarehouse, WarehouseDTO } from "types/Warehouse";
import { checkPermission } from "utils/roleUtils";
import { handleFormatResWarehouseToForm } from "utils/warehouse/handleFormatResWarehouseToForm";
import { warehouseSchema } from "validations/warehouse";

const WAREHOUSE_FORM_DEFAULT: Partial<WarehouseDTO> = {
  address: { address: "", type: "WH" },
  is_default: false,
  is_sales: false,
  manager_name: "",
  manager_phone: "",
  name: "",
  note: "",
};

export interface FormWarehouseModalProps {
  onRefresh?: () => void;
  row?: TWarehouse;
  onClose?: () => void;
  open?: boolean;
}

// setWarehouseModal((prev) => ({
//   funcContentSchema: warehouseSchema,
// }));

const WarehouseModal = ({ onClose, open = false, row, onRefresh }: FormWarehouseModalProps) => {
  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<WarehouseDTO>>({
    defaultValues: WAREHOUSE_FORM_DEFAULT,
    resolver: yupResolver(warehouseSchema) as Resolver<any, any>,
  });

  const { districtOptions, provinceOptions, wardOptions, getDistricts, getWards } =
    useAddressHook();

  const { address, is_default, is_sales, manager_name, manager_phone, name, note } = watch();

  useEffect(() => {
    getDistricts(address?.ward?.province_id);
  }, [address?.ward?.province_id, getDistricts]);

  useEffect(() => {
    getWards(address?.ward?.district_id);
  }, [address?.ward?.district_id, getWards]);

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    reset(WAREHOUSE_FORM_DEFAULT);
    onClose?.();
  };

  const handleSubmitForm = async (form: Partial<WarehouseDTO>) => {
    setLoading(true);
    row?.id ? await handleUpdateWarehouse(form) : await handleCreateWarehouse(form);
    setLoading(false);
  };

  const handleCreateWarehouse = async (form: Partial<WarehouseDTO>) => {
    const res = await warehouseServices.handleCreateWarehouse(form);
    if (res) {
      onRefresh?.();
      closeModal();
    }
  };

  const handleUpdateWarehouse = async (form: Partial<WarehouseDTO>) => {
    if (row?.id) {
      const res = await warehouseServices.handleUpdateWarehouse(
        form,
        row?.id,
        row?.addresses?.[0].id,
      );
      if (res) {
        onRefresh?.();
        closeModal();
      }
    }
  };

  useEffect(() => {
    if (open && row?.id) {
      reset(handleFormatResWarehouseToForm(row));
    }
  }, [open, row, reset]);

  const isWriteWarehouse = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.WAREHOUSE],
    user,
  ).isReadAndWrite;

  return (
    <FormDialog
      open={open}
      title={row?.id ? `${BUTTON.UPDATE} ${row?.name}` : BUTTON.ADD}
      buttonText={row?.id ? BUTTON.UPDATE : BUTTON.ADD}
      maxWidth="lg"
      onSubmit={handleSubmit(handleSubmitForm)}
      loading={loading}
      disabledSubmit={!isWriteWarehouse}
      onClose={closeModal}
    >
      <Grid container spacing={2} rowGap={2}>
        <Grid item lg={6} sm={6} xs={6}>
          <TextField
            fullWidth
            required
            label={WAREHOUSE_LABEL.name}
            placeholder={WAREHOUSE_LABEL.name}
            error={!!errors.name}
            helperText={errors.name?.message}
            minRows={2}
            value={name}
            onChange={(e) => setValue("name", e.target.value)}
          />
        </Grid>
        <Grid item lg={6} sm={6} xs={6}>
          <TextField
            fullWidth
            required
            error={!!errors.manager_phone}
            helperText={errors.manager_phone?.message}
            label={WAREHOUSE_LABEL.manager_phone}
            placeholder={WAREHOUSE_LABEL.manager_phone}
            minRows={2}
            value={manager_phone}
            onChange={(e) => setValue("manager_phone", e.target.value)}
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
          <TextField
            fullWidth
            required
            label={WAREHOUSE_LABEL.manager_name}
            placeholder={WAREHOUSE_LABEL.manager_name}
            error={!!errors.manager_name}
            helperText={errors.manager_name?.message}
            minRows={2}
            value={manager_name}
            onChange={(e) => setValue("manager_name", e.target.value)}
          />
        </Grid>
        <Grid item lg={6} sm={6} xs={6}>
          <TextField
            fullWidth
            required
            label={WAREHOUSE_LABEL.warehouse_note}
            placeholder={WAREHOUSE_LABEL.warehouse_note}
            error={!!errors.note}
            helperText={errors.note?.message}
            minRows={2}
            value={note}
            onChange={(e) => setValue("note", e.target.value)}
          />
        </Grid>
        <Grid item lg={6} sm={6} xs={6}>
          <FormControlLabel
            onChange={(_e, value) => setValue("is_default", value)}
            control={<Checkbox checked={!!is_default} />}
            label="Kho giao"
            value={!!is_default}
          />
        </Grid>
        <Grid item lg={6} sm={6} xs={6}>
          <FormControlLabel
            onChange={(_e, value) => setValue("is_sales", value)}
            control={<Checkbox checked={!!is_sales} />}
            label={WAREHOUSE_LABEL.is_sales}
            value={!!is_sales}
          />
        </Grid>

        <Grid item container xs={12} spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              error={!!errors.address?.address}
              helperText={errors.address?.address?.message}
              minRows={2}
              value={address?.address}
              onChange={(e) => setValue("address.address", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MultiSelect
              value={address?.ward?.province_id}
              onChange={(value) => {
                setValue("address.ward", {
                  ...address?.ward,
                  province_id: value.toString(),
                  district_id: "",
                  ward_id: "",
                  code: "",
                });
                getDistricts(value.toString());
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
              error={errors?.address?.ward?.province_id}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MultiSelect
              value={address?.ward?.district_id}
              onChange={(value) => {
                setValue("address.ward", {
                  ...address?.ward,
                  district_id: value.toString(),
                  ward_id: "",
                  code: "",
                });
                getWards(value.toString());
              }}
              error={errors?.address?.ward?.district_id}
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
          </Grid>
          <Grid item xs={12} md={4}>
            <MultiSelect
              value={address?.ward?.ward_id}
              onChange={(value) => {
                setValue("address.ward.ward_id", value.toString());
              }}
              zIndex={ZINDEX_SYSTEM.selector}
              title={WAREHOUSE_LABEL.select_ward}
              size="medium"
              outlined
              fullWidth
              selectorId="ward"
              error={errors?.address?.ward?.ward_id}
              options={wardOptions}
              simpleSelect
              required
            />
          </Grid>
        </Grid>
      </Grid>
    </FormDialog>
  );
};

export default WarehouseModal;
