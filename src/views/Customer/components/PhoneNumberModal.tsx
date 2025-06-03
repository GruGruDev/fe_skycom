import { yupResolver } from "@hookform/resolvers/yup";
import { MButton, MButtonProps } from "components/Buttons";
import { FormDialog } from "components/Dialogs";
import { BUTTON } from "constants/button";
import { LABEL } from "constants/label";
import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { TPhone } from "types/Customer";
import { TStyles } from "types/Styles";
import TextField from "@mui/material/TextField";
import { customerApi } from "apis/customer";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { phonesSchema } from "validations/phone";

interface Props extends MButtonProps {
  customerId: string;
  onRefresh: (customerId?: string) => void;
}

const PhoneNumberModal = (props: Props) => {
  const { customerId, onRefresh } = props;
  const {
    formState: { errors },
    handleSubmit,
    clearErrors,
    reset,
    setValue,
  } = useForm<Partial<TPhone>>({
    resolver: yupResolver(phonesSchema) as Resolver<any, any>,
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAddPhone = async (value: Partial<TPhone>) => {
    setLoading(true);
    const res = await customerApi.create<{ phone: string; customer: string }>({
      params: { phone: value.phone, customer: customerId },
      endpoint: "phones/",
    });

    if (res.data) {
      onRefresh(customerId);
      setOpen(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!open) {
      clearErrors();
      reset();
    }
  }, [open, clearErrors, reset]);

  return (
    <>
      <FormDialog
        title={LABEL.ADD_PHONE_NUMBER}
        open={open}
        buttonText={BUTTON.ADD}
        loading={loading}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit(handleAddPhone)}
        maxWidth="sm"
      >
        <TextField
          fullWidth
          label={CUSTOMER_LABEL.phone_number}
          onChange={(e) => setValue("phone", e.target.value)}
          error={!!errors?.phone}
          helperText={errors?.phone?.message}
          InputLabelProps={{ shrink: true }}
        />
      </FormDialog>

      <MButton
        onClick={() => setOpen(true)}
        style={styles.addPhoneButton}
        loading={loading}
        {...props}
      >
        {BUTTON.ADD}
      </MButton>
    </>
  );
};

export default PhoneNumberModal;

const styles: TStyles<"addPhoneButton"> = {
  addPhoneButton: {
    fontSize: "0.82rem",
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,
    width: "fit-content",
  },
};
