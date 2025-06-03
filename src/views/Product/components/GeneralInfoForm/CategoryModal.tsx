import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormPopup, FormPopupProps, PropsContentRender } from "components/Popups";
import { MultiSelect } from "components/Selectors";
import { BUTTON } from "constants/button";
import { TYPE_FORM_FIELD, ZINDEX_SYSTEM } from "constants/index";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { PRODUCT_LABEL } from "constants/product/label";
import { useAppSelector } from "hooks/reduxHook";
import map from "lodash/map";
import { useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { createCategory } from "store/redux/products/action";
import { formatOptionSelect } from "utils/option";
import { showSuccess } from "utils/toast";
import { categorySchema } from "validations/category";

export const categoryForm: PropsContentRender[] = [
  {
    type: TYPE_FORM_FIELD.TEXTFIELD,
    name: "name",
    label: PRODUCT_LABEL.category,
    placeholder: PRODUCT_LABEL.category,
    required: true,
  },
  {
    type: TYPE_FORM_FIELD.TEXTFIELD,
    name: "code",
    label: PRODUCT_LABEL.category_code,
    placeholder: PRODUCT_LABEL.category_code,
  },
];

interface Props {
  control?: Control<FieldValues>;
}

function CategoryModal({ control }: Props) {
  const attributesProduct = useAppSelector((state) => state.product.attributes);
  const { category } = attributesProduct;

  const [categoryModal, setCategoryModal] = useState<
    Omit<FormPopupProps, "handleClose" | "handleSubmitPopup">
  >({
    open: false,
    funcContentSchema: categorySchema,
    defaultData: { name: "", code: "" },
    title: PRODUCT_LABEL.create_category,
    buttonText: BUTTON.ADD,
    maxWidth: "md",
    funcContentRender: () => categoryForm,
  });

  const closeModal = () => {
    setCategoryModal((prev) => ({ ...prev, open: false }));
  };
  const openModal = () => {
    setCategoryModal((prev) => ({ ...prev, open: true }));
  };

  const handleSubmit = async ({ code, name }: { code: string; name: string }) => {
    const params = {
      name,
      code,
    };

    await createCategory(params).then(() => showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS));

    closeModal();
  };

  return (
    <>
      <FormPopup
        handleClose={closeModal}
        handleSubmitPopup={({ name, code }) => handleSubmit({ name, code })}
        {...categoryModal}
      />
      <Controller
        name="category"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MultiSelect
            {...field}
            zIndex={categoryModal.open ? 0 : ZINDEX_SYSTEM.selector}
            title={PRODUCT_LABEL.category}
            placeholder={PRODUCT_LABEL.select_category}
            inputProps={{ InputLabelProps: { shrink: true } }}
            size="medium"
            outlined
            selectorId="category"
            fullWidth
            error={error}
            options={map(category, formatOptionSelect)}
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
            simpleSelect
          />
        )}
      />
    </>
  );
}

export default CategoryModal;
