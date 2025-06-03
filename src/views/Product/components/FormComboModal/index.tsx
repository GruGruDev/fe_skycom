import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import { productApi } from "apis/product";
import { FormPopup, FormPopupProps } from "components/Popups";
import { SearchProductPopover } from "components/Product";
import { BUTTON } from "constants/button";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { PRODUCT_LABEL } from "constants/product/label";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { ComboVariantDTO } from "types/Product";
import { handleFormatComboLikeProductToParams } from "utils/product/handleFormatComboLikeProductToParams";
import { handleFormatComboLikeVariantToParams } from "utils/product/handleFormatComboLikeVariantToParams";
import { showError, showSuccess } from "utils/toast";
import { comboVariantSchema } from "validations/comboVariant";
import GeneralInfo from "../GeneralInfoForm";
import UploadImage from "../UploadImage";
import ComboGeneralInfoForm from "./ComboGeneralInfo";
import ComboVariant from "./ComboVariant";
import { IMAGE_TYPE } from "types/Media";

const COMBO_PRODUCT_FORM_DATA_DEFAULT = {
  name: "",
  SKU_code: "",
  bar_code: "",
  description: "",
  unit: "",
  supplier: "",
  type: "",
  category: "",
  images: [],
  sale_price: 0,
  neo_price: 0,
  combo_variants: [],
  tags: [],
  is_active: true,
};

export interface FormComboModalProps {
  onRefresh?: () => void;
  open?: boolean;
  onClose?: () => void;
}

const FormComboModal = ({ onRefresh, open = false, onClose }: FormComboModalProps) => {
  const [comboProductModal, setComboProductModal] =
    useState<Omit<FormPopupProps, "handleClose" | "handleSubmitPopup">>();
  const [formAction, setFormAction] = useState("select");

  const closeModalAfterCancle = () => {
    onClose?.();
  };

  const closeModalAfterConfirm = () => {
    onClose?.();
    onRefresh?.();
  };

  const handleSumitForm = async (form: ComboVariantDTO) => {
    if (formAction === "select") {
      await handleCreateComboLikeVariant(form);
    } else {
      await handleCreateComboFromProduct(form);
    }
  };

  const handleCreateComboFromProduct = async (form: ComboVariantDTO) => {
    const params = handleFormatComboLikeProductToParams(form);
    const result = await productApi.create({ params, endpoint: "" });

    if (result?.data) {
      showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS);

      closeModalAfterConfirm();
    } else {
      showError(RESPONSE_MESSAGES.CREATE_ERROR);
    }
  };

  const handleCreateComboLikeVariant = async (form: ComboVariantDTO) => {
    const params = handleFormatComboLikeVariantToParams(form);

    const result = await productApi.create({ params, endpoint: "variants/" });

    if (result?.data) {
      showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS);

      closeModalAfterConfirm();
    } else {
      showError(RESPONSE_MESSAGES.CREATE_ERROR);
    }
  };

  useEffect(() => {
    if (open) {
      setComboProductModal((prev) => ({
        ...prev,
        loading: false,
        maxWidth: "lg",
        title: BUTTON.CREATE_COMBO,
        buttonText: BUTTON.ADD,
        defaultData: COMBO_PRODUCT_FORM_DATA_DEFAULT,
        funcContentSchema: (yup) => comboVariantSchema(yup, false),
      }));
    } else {
      setComboProductModal({});
    }
  }, [open]);

  const handleChangeformAction = (value: string) => {
    setComboProductModal((prev) => ({
      ...prev,
      funcContentSchema: (yup) => comboVariantSchema(yup, value === "create"),
      defaultData: {},
    }));
    setFormAction(value);
  };

  const id = comboProductModal?.defaultData?.id;
  return (
    <>
      <FormPopup
        funcContentRender={(methods) => {
          return (
            <Grid container>
              <FormControl sx={{ mb: 2 }}>
                <RadioGroup
                  value={formAction}
                  aria-labelledby="demo-product-type-label"
                  name="product-type"
                  row
                  onChange={(e) => handleChangeformAction(e.target.value)}
                >
                  <FormControlLabel
                    value="select"
                    control={<Radio />}
                    label={PRODUCT_LABEL.select_product}
                  />
                  <FormControlLabel
                    value="create"
                    control={<Radio />}
                    label={PRODUCT_LABEL.create_product}
                  />
                </RadioGroup>
              </FormControl>

              {formAction === "create" ? (
                <GeneralInfo {...methods} type={IMAGE_TYPE.PD} />
              ) : (
                <Stack width="100%" gap={2}>
                  <Controller
                    name="product"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <SearchProductPopover
                        value={field.value}
                        handleSelectProduct={field.onChange}
                        message={error?.message}
                      />
                    )}
                  />
                  {id && (
                    <Grid item xs={12} my={2}>
                      <UploadImage {...methods} type={IMAGE_TYPE.PDV} />
                    </Grid>
                  )}
                </Stack>
              )}
              <ComboGeneralInfoForm {...methods} />
              <ComboVariant {...methods} formAction={formAction} />
            </Grid>
          );
        }}
        handleClose={closeModalAfterCancle}
        handleSubmitPopup={handleSumitForm}
        {...comboProductModal}
        open={open}
      />
    </>
  );
};

export default FormComboModal;
