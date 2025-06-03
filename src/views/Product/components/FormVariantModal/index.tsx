import Grid from "@mui/material/Grid";
import { FormPopup, FormPopupProps } from "components/Popups/FormPopup";
import { SearchProductPopover } from "components/Product";
import { BUTTON } from "constants/button";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { PRODUCT_LABEL } from "constants/product/label";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { TVariantDetail, VariantDTO } from "types/Product";
import { handleFormatResVariantToForm } from "utils/product/handleFormatResVariantToForm";
import { variantSchema } from "validations/variant";
import VariantForm from "./VariantForm";
import { imageService } from "services/image";
import ListMaterial from "./ListMaterial";

export const FormVariantModal = ({
  handleSubmitModal,
  onClose,
  open = false,
  row,
  onRefresh,
  isSelectProduct,
}: {
  row?: Partial<TVariantDetail>;
  onClose?: () => void;
  open?: boolean;
  handleSubmitModal: (form: Partial<VariantDTO>) => Promise<VariantDTO | undefined>;
  onRefresh?: () => void;
  isSelectProduct?: boolean;
}) => {
  const [variantModal, setVariantModal] =
    useState<Omit<FormPopupProps, "handleClose" | "handleSubmitPopup">>();

  const closeModalAfterCancle = async (values: Partial<VariantDTO>) => {
    await handleRemovePreCancelImages(values);
    onClose?.();
    setVariantModal((prev) => ({ ...prev, loading: false }));
  };

  const closeModalAfterConfirm = () => {
    onClose?.();
    onRefresh?.();
    setVariantModal((prev) => ({ ...prev, loading: false }));
  };

  const handleRemovePreCancelImages = async (values: Partial<VariantDTO> = {}) => {
    // xử lý hình ảnh
    const { prevSubmitImages } = values;

    const productDeprecatedImages = prevSubmitImages?.map((item) => ({ id: item.id })) || [];
    await imageService.removeListImages(productDeprecatedImages);
  };

  const handleSubmitVariant = async (form: VariantDTO, values: Partial<VariantDTO> = {}) => {
    if (isSelectProduct && !form.product) {
      return;
    }

    setVariantModal((prev) => ({ ...prev, loading: true }));
    const salePrice = form.sale_price || variantModal?.defaultData?.sale_price || 0;
    const neoPrice = form.neo_price || variantModal?.defaultData?.neo_price || 0;

    const params = {
      ...form,
      sale_price: salePrice,
      neo_price: neoPrice,
      id: row?.id,
    };

    const res = await handleSubmitModal(params);
    if (res) {
      // xử lý hình ảnh
      const { images, deprecatedImages } = values;
      // update product id for images
      const productImages =
        images?.map((item) => ({
          id: item.id,
          payload: { product_variant: res.id, is_default: item.is_default },
        })) || [];
      await imageService.updateListImages(productImages);

      const productDeprecatedImages =
        deprecatedImages?.map((item) => ({ id: item.id, payload: { product: res.id } })) || [];
      await imageService.removeListImages(productDeprecatedImages);

      closeModalAfterConfirm();
    }
    setVariantModal((prev) => ({ ...prev, loading: false }));
  };

  useEffect(() => {
    if (open) {
      const form = handleFormatResVariantToForm(row);

      setVariantModal((prev) => ({
        ...prev,
        funcContentSchema: variantSchema,
        maxWidth: "md",
        defaultData: form,
        title: row?.id ? `${PRODUCT_LABEL.update_variant} ${row?.name}` : PRODUCT_LABEL.add_variant,
        buttonText: row?.id ? BUTTON.UPDATE : BUTTON.ADD,
      }));
    } else {
      setVariantModal({});
    }
  }, [open, row]);

  return (
    <FormPopup
      loading={variantModal?.loading}
      funcContentRender={(methods, optional) => {
        const values = methods.getValues();
        return (
          <>
            {isSelectProduct && (
              <Grid container mb={1}>
                <Controller
                  name="product"
                  control={methods.control}
                  render={({ field }) => {
                    return (
                      <SearchProductPopover
                        value={field.value}
                        handleSelectProduct={field.onChange}
                        message={field.value ? "" : VALIDATION_MESSAGE.SELECT_PRODUCT}
                      />
                    );
                  }}
                />
              </Grid>
            )}
            <VariantForm
              {...methods}
              {...optional}
              variantId={row?.id}
              productId={row?.product || values.product}
            />
            <ListMaterial methods={methods} />
          </>
        );
      }}
      handleClose={closeModalAfterCancle}
      handleSubmitPopup={handleSubmitVariant}
      {...variantModal}
      open={open}
    />
  );
};
