import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormDialog } from "components/Dialogs";
import { MultiSelect } from "components/Selectors";
import { BUTTON } from "constants/button";
import { GENDER_OPTIONS } from "constants/customer";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { ZINDEX_SYSTEM } from "constants/index";
import { YYYY_MM_DD } from "constants/time";
import dayjs from "dayjs";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import isEqual from "lodash/isEqual";
import { useEffect, useState } from "react";
import { FieldErrors, Resolver, useForm } from "react-hook-form";
import { customerSerives } from "services/customer";
import { TAddress } from "types/Address";
import { CustomerDTO, TCustomer, TGender } from "types/Customer";
import { handleFormatResToForm } from "utils/customer/handleFormatResToForm";
import { INVALID_DATE } from "utils/date";
import { dirtyRHF } from "utils/formValidation";
import { handleNotifyErrors } from "utils/handleError";
import { findOption } from "utils/option";
import { customerSchema } from "validations/customer";
import AddressInput from "./AddressInput";
import BirthdayInput from "./BirthdayInput";
interface Props {
  open?: boolean;
  onRefresh?: (customer?: TCustomer) => void;
  row?: Partial<TCustomer>;
  onClose?: () => void;
  zIndex?: number;
}

let defaultForm: Partial<CustomerDTO> = {};

const CustomerModal = ({ open = false, onRefresh, row, onClose, zIndex }: Props) => {
  const [formState, setFormState] = useState({ loading: false, error: false });
  const [isRefreshTable, setIsRefreshTable] = useState(false);
  const { telesaleUserOptions } = useAppSelector(getDraftSafeSelector("users"));

  const {
    setValue,
    clearErrors,
    reset,
    formState: { errors, dirtyFields },
    handleSubmit,
    watch,
    getValues,
  } = useForm<CustomerDTO>({
    resolver: yupResolver(customerSchema(row?.id)) as Resolver<any, any>,
  });
  const { name, birthday, phone, address, customer_care_staff, gender } = watch();

  // ----------CUSTOMER---------------
  const handleAddCustomer = async (form: CustomerDTO) => {
    setFormState((prev) => ({ ...prev, loading: true }));
    const resCustomer = await customerSerives.handleAddCustomer(form);
    if (resCustomer) {
      onRefresh?.(resCustomer);
      onClose?.();
    }

    setFormState((prev) => ({ ...prev, loading: false }));
  };

  const handleUpdateCustomer = async (form: CustomerDTO) => {
    const payload = dirtyRHF(form, dirtyFields);

    setFormState((prev) => ({ ...prev, loading: true }));
    const resCustomer = await customerSerives.handleUpdateCustomer({ ...payload, id: row?.id });
    if (resCustomer) {
      onRefresh?.(resCustomer);
      onClose?.();
    }
    setFormState((prev) => ({ ...prev, loading: false }));
  };

  const handleSubmitForm = async (form: CustomerDTO) => {
    row?.id ? handleUpdateCustomer(form) : handleAddCustomer(form);
  };

  const handleChangeBirthday = (value: Date | string) => {
    const date = dayjs(new Date(value)).format(YYYY_MM_DD);
    setValue("birthday", date !== INVALID_DATE ? date : null, { shouldDirty: true });
  };

  useEffect(() => {
    handleNotifyErrors(errors);
  }, [errors]);

  useEffect(() => {
    if (open) {
      const fillRowToForm = async () => {
        const customer = handleFormatResToForm(row);
        reset(customer);
        defaultForm = customer;

        const selectedAddress = findOption(customer.addresses, true, "is_default");
        setValue("address", selectedAddress, { shouldDirty: true });
      };
      fillRowToForm();
    }
  }, [row, open, reset, setValue]);

  useEffect(() => {
    if (!open) {
      reset({});
      isRefreshTable && onRefresh?.();
      setIsRefreshTable(false);
      clearErrors();
    }
  }, [open, isRefreshTable, onRefresh, clearErrors, reset]);

  const buttonSubmitLabel = row?.id ? BUTTON.UPDATE : BUTTON.ADD;
  const formTitle = row?.id ? CUSTOMER_LABEL.update_customer : CUSTOMER_LABEL.create_customer;

  const isOldData = isEqual(defaultForm, getValues());

  return (
    <FormDialog
      title={formTitle}
      open={open}
      buttonText={buttonSubmitLabel}
      loading={formState.loading}
      disabledSubmit={isOldData}
      onClose={onClose}
      onSubmit={handleSubmit(handleSubmitForm)}
      maxWidth="md"
      zIndex={zIndex}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={CUSTOMER_LABEL.name}
            value={name || ""}
            onChange={(e) =>
              setValue("name", e.target.value, { shouldValidate: true, shouldDirty: true })
            }
            error={!!errors.name}
            helperText={errors.name?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {!row?.id && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={CUSTOMER_LABEL.phone_number}
              value={phone}
              onChange={(e) =>
                setValue("phone", e.target.value, { shouldDirty: true, shouldValidate: true })
              }
              error={!!errors.phone}
              helperText={errors.phone?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <BirthdayInput onChange={handleChangeBirthday} value={birthday} error={errors.birthday} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MultiSelect
            value={gender || ""}
            options={GENDER_OPTIONS}
            onChange={(value) => {
              setValue("gender", value as TGender, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            zIndex={ZINDEX_SYSTEM.selector}
            fullWidth
            outlined
            size="medium"
            title={CUSTOMER_LABEL.gender}
            simpleSelect
            shrink
            selectorId="customer-care-staff-selector"
            error={errors.gender}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MultiSelect
            value={customer_care_staff || ""}
            options={telesaleUserOptions}
            onChange={(value) =>
              setValue("customer_care_staff", value.toString(), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            zIndex={ZINDEX_SYSTEM.selector}
            fullWidth
            outlined
            size="medium"
            title={CUSTOMER_LABEL.customer_care_staff}
            simpleSelect
            shrink
            selectorId="customer-care-staff-selector"
            error={errors.customer_care_staff}
          />
        </Grid>

        {!row?.id && (
          <Grid item xs={12}>
            <AddressInput
              setValue={(name, value: any, options) => setValue(`address.${name}`, value, options)}
              errors={errors.address as FieldErrors<TAddress>}
              address={address}
            />
          </Grid>
        )}
      </Grid>
    </FormDialog>
  );
};

export default CustomerModal;
