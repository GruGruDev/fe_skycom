import { FormPopup, FormPopupProps } from "components/Popups/FormPopup";
import { BUTTON } from "constants/button";
import { PRODUCT_LABEL } from "constants/product/label";
import { useEffect, useState } from "react";
import { imageService } from "services/image";
import { TProductMaterial } from "types/Product";
import { productMaterialSchema } from "validations/productMaterial";
import MaterialForm from "./MaterialForm";

const INIT_FORM: Partial<TProductMaterial> = {
  bar_code: "",
  is_active: true,
  name: "",
  note: "",
  weight: 0,
};

export const FormMaterialModal = ({
  handleSubmitModal,
  onClose,
  open = false,
  row,
  onRefresh,
}: {
  row?: Partial<TProductMaterial>;
  onClose?: () => void;
  open?: boolean;
  handleSubmitModal: (form: Partial<TProductMaterial>) => Promise<TProductMaterial | undefined>;
  onRefresh?: () => void;
}) => {
  const [materialModal, setMaterialModal] =
    useState<Omit<FormPopupProps, "handleClose" | "handleSubmitPopup">>();

  const closeModalAfterCancle = async (values: Partial<TProductMaterial> = {}) => {
    await handleRemovePreCancelImages(values);
    onClose?.();
    setMaterialModal((prev) => ({ ...prev, loading: false }));
  };

  const handleRemovePreCancelImages = async (values: Partial<TProductMaterial> = {}) => {
    // xử lý hình ảnh
    const { prevSubmitImages } = values;

    const productDeprecatedImages = prevSubmitImages?.map((item) => ({ id: item.id })) || [];
    await imageService.removeListImages(productDeprecatedImages);
  };

  const closeModalAfterConfirm = () => {
    onClose?.();
    onRefresh?.();
    setMaterialModal((prev) => ({ ...prev, loading: false }));
  };

  const handleSubmitMaterial = async (
    form: TProductMaterial,
    values: Partial<TProductMaterial> = {},
  ) => {
    setMaterialModal((prev) => ({ ...prev, loading: true }));
    const salePrice = form.sale_price || materialModal?.defaultData?.sale_price || 0;
    const neoPrice = form.neo_price || materialModal?.defaultData?.neo_price || 0;

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
      // update variant id for images
      const productImages =
        images?.map((item) => ({
          id: item.id,
          payload: { material: res.id, is_default: item.is_default },
        })) || [];
      await imageService.updateListImages(productImages);

      const productDeprecatedImages = deprecatedImages?.map((item) => ({ id: item.id })) || [];
      await imageService.removeListImages(productDeprecatedImages);

      closeModalAfterConfirm();
    }
    setMaterialModal((prev) => ({ ...prev, loading: false }));
  };

  useEffect(() => {
    if (open) {
      setMaterialModal((prev) => ({
        ...prev,
        funcContentSchema: productMaterialSchema,
        maxWidth: "md",
        defaultData: row?.id ? row : INIT_FORM,
        title: row?.id
          ? `${PRODUCT_LABEL.update_material} ${row?.name}`
          : PRODUCT_LABEL.create_material,
        buttonText: row?.id ? BUTTON.UPDATE : BUTTON.ADD,
      }));
    } else {
      setMaterialModal({});
    }
  }, [open, row]);

  return (
    <FormPopup
      loading={materialModal?.loading}
      funcContentRender={(methods, optional) => {
        return <MaterialForm {...methods} {...optional} materialId={row?.id} />;
      }}
      handleClose={closeModalAfterCancle}
      handleSubmitPopup={handleSubmitMaterial}
      {...materialModal}
      open={open}
    />
  );
};
