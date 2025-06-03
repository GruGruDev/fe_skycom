import { yupResolver } from "@hookform/resolvers/yup";
import { FormDialog } from "components/Dialogs";
import { BUTTON } from "constants/button";
import { ZINDEX_SYSTEM } from "constants/index";
import { LABEL } from "constants/label";
import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { TAddress } from "types/Address";
import { addressSchema } from "validations/address";
import AddressInput from "./AddressInput";

interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
  onSubmit: (payload: TAddress) => void;
  loading: boolean;
}

const AddressFormModal = (props: Props) => {
  const { open, setOpen, onSubmit, loading } = props;
  const {
    setValue,
    formState: { errors },
    handleSubmit,
    clearErrors,
    reset,
    watch,
  } = useForm<TAddress>({
    resolver: yupResolver(addressSchema(true)) as Resolver<any, any>,
  });

  useEffect(() => {
    if (!open) {
      clearErrors();
      reset();
    }
  }, [open, clearErrors, reset]);

  return (
    <>
      <FormDialog
        title={LABEL.ADD_ADDRESS}
        open={open}
        buttonText={BUTTON.ADD}
        loading={loading}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        maxWidth="md"
        zIndex={ZINDEX_SYSTEM.dialog}
      >
        <AddressInput setValue={setValue} errors={errors} address={watch()} />
      </FormDialog>
    </>
  );
};

export default AddressFormModal;
