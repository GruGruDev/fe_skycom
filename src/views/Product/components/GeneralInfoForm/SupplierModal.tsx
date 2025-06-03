import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormPopup, FormPopupProps, PropsContentRender } from "components/Popups";
import { MultiSelect } from "components/Selectors";
import { BUTTON } from "constants/button";
import { TYPE_FORM_FIELD, ZINDEX_SYSTEM } from "constants/index";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { INSTANCE } from "constants/product/index";
import { PRODUCT_LABEL } from "constants/product/label";
import { useAppSelector } from "hooks/reduxHook";
import map from "lodash/map";
import { useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { createSupplier } from "store/redux/products/action";
import { TProductAttribute } from "types/Product";
import { formatOptionSelect } from "utils/option";
import { showSuccess } from "utils/toast";
import { supplierSchema } from "validations/supplier";

export const supplierForm: PropsContentRender[] = [
  {
    type: TYPE_FORM_FIELD.TEXTFIELD,
    name: "name",
    label: PRODUCT_LABEL.supplier,
    placeholder: PRODUCT_LABEL.supplier,
    required: true,
  },
  {
    type: TYPE_FORM_FIELD.TEXTFIELD,
    name: "business_code",
    label: PRODUCT_LABEL.business_code,
    placeholder: PRODUCT_LABEL.business_code,
  },
];

interface Props {
  control?: Control<FieldValues>;
}

function SupplierModal({ control }: Props) {
  const attributesProduct = useAppSelector((state) => state.product.attributes);
  const { supplier } = attributesProduct;
  const [supplierModal, setSupplierModal] = useState<
    Omit<FormPopupProps, "handleClose" | "handleSubmitPopup">
  >({
    open: false,
    funcContentSchema: supplierSchema,
    defaultData: { name: "", business_code: "" },
    title: PRODUCT_LABEL.create_supplier,
    buttonText: BUTTON.ADD,
    maxWidth: "md",
    funcContentRender: () => supplierForm,
  });

  const closeModal = () => {
    setSupplierModal((prev) => ({ ...prev, open: false }));
  };
  const openModal = () => {
    setSupplierModal((prev) => ({ ...prev, open: true }));
  };

  const handleSubmit = async ({ business_code, name }: { business_code: string; name: string }) => {
    await handleAddSupplier({ name, business_code, type: INSTANCE.SUPPLIER });
    closeModal();
  };

  const handleAddSupplier = async ({
    business_code,
    name,
    type,
  }: {
    business_code: string;
    name: string;
    type: TProductAttribute;
  }) => {
    const params = { name, business_code, type };

    await createSupplier(params).then(() => showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS));
  };

  return (
    <>
      <FormPopup
        {...supplierModal}
        handleClose={closeModal}
        handleSubmitPopup={({ name, business_code }) => handleSubmit({ name, business_code })}
      />
      <Controller
        name="supplier"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MultiSelect
            {...field}
            zIndex={supplierModal.open ? 0 : ZINDEX_SYSTEM.selector}
            title={PRODUCT_LABEL.supplier}
            placeholder={PRODUCT_LABEL.select_supplier}
            size="medium"
            outlined
            selectorId="supplier"
            fullWidth
            error={error}
            options={map(supplier, formatOptionSelect)}
            inputProps={{ InputLabelProps: { shrink: true } }}
            simpleSelect
            contentRender={
              <Box
                display="flex"
                alignItems="center"
                sx={{ p: 1, pb: 0.5, pt: 2, pl: 1.5, cursor: "pointer" }}
                onClick={openModal}
              >
                <AddCircleIcon color="primary" sx={{ fontSize: "1rem", mr: 0.5 }} />
                <Typography
                  variant="body1"
                  component="span"
                  color="primary"
                  sx={{ fontSize: "0.82rem" }}
                >
                  {PRODUCT_LABEL.add_attribute}
                </Typography>
              </Box>
            }
          />
        )}
      />
    </>
  );
}

export default SupplierModal;
