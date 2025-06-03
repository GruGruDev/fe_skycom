import { productApi } from "apis/product";
import { FormPopup, FormPopupProps } from "components/Popups";
import { BUTTON } from "constants/button";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { INIT_VARIANT } from "constants/product";
import { PRODUCT_LABEL } from "constants/product/label";
import reduce from "lodash/reduce";
import { useEffect, useState } from "react";
import { ProductDTO, TProduct, VARIANT_TYPE } from "types/Product";
import { handleFormatResProductToForm } from "utils/product/handleFormatResProductToForm";
import { showError, showSuccess } from "utils/toast";
import { productSchema } from "validations/product";
import GeneralInfo from "../GeneralInfoForm";
import ListVariant from "./ListVariant";
import { imageService } from "services/image";
import { IMAGE_TYPE } from "types/Media";

export const PRODUCT_FORM_DATA_DEFAULT: Partial<TProduct> = {
  name: "",
  note: "",
  supplier: "",
  category: "",
  variants: [INIT_VARIANT],
  is_active: true,
};

export interface FormProductModalProps {
  onRefresh?: () => void;
  row?: Partial<TProduct>;
  onClose?: () => void;
  open?: boolean;
}

const FormProductModal = ({ onRefresh, onClose, open = false, row }: FormProductModalProps) => {
  const [productModal, setProductModal] =
    useState<Omit<FormPopupProps, "handleClose" | "handleSubmitPopup">>();

  const closeModalAfterCancle = async (values: Partial<TProduct> = {}) => {
    await handleRemovePreCancelImages(values);
    onClose?.();
  };

  const closeModalAfterConfirm = () => {
    onClose?.();
    onRefresh?.();
  };

  const handleRemovePreCancelImages = async (values: Partial<TProduct> = {}) => {
    // xử lý hình ảnh
    const { prevSubmitImages } = values;

    const productDeprecatedImages = prevSubmitImages?.map((item) => ({ id: item.id })) || [];
    await imageService.removeListImages(productDeprecatedImages);
  };

  const handleSubmit = async (form: Partial<TProduct>) => {
    setProductModal((prev) => ({ ...prev, loading: true }));
    row?.id ? await handleUpdateProduct(form) : await handleCreateProduct(form);
    setProductModal((prev) => ({ ...prev, loading: false }));
  };

  const handleCreateProduct = async (form: Partial<TProduct>) => {
    const { name, note, category, supplier, is_active, images, SKU_code, deprecatedImages } = form;

    const newVariants = reduce(
      form.variants,
      (prev: ProductDTO["variants"], cur) => {
        const { sale_price = 0, neo_price = 0, SKU_code = "", name = "", tags } = cur;

        // const imageIds = images?.map((item) => item?.url ?? "");

        const variantForm = {
          name,
          SKU_code,
          // images: imageIds,
          sale_price: +sale_price,
          neo_price: +neo_price,
          is_active,
          type: VARIANT_TYPE.SIMPLE,
          tags,
        };

        return [...prev, variantForm] as ProductDTO["variants"];
      },
      [],
    );

    const payload: Partial<ProductDTO> = {
      name,
      note,
      // images: imageIds,
      category,
      variants: newVariants,
      supplier,
      is_active,
      SKU_code,
    };

    const result = await productApi.create({ params: payload, endpoint: "" });

    if (result?.data) {
      // update product id for images
      const productImages =
        images?.map((item) => ({
          id: item.id,
          payload: { product: result.data.id, is_default: item.is_default },
        })) || [];
      await imageService.updateListImages(productImages);

      const productDeprecatedImages =
        deprecatedImages?.map((item) => ({
          id: item.id,
          payload: { product: result.data.id },
        })) || [];
      await imageService.removeListImages(productDeprecatedImages);
      // ------
      showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS);
      closeModalAfterConfirm();
    } else {
      showError(RESPONSE_MESSAGES.CREATE_ERROR);
    }
  };

  const handleUpdateProduct = async (form: Partial<TProduct>) => {
    const { name, note, category, supplier, is_active, images, SKU_code, deprecatedImages } = form;

    const payload: Partial<ProductDTO> = {
      name,
      note,
      category,
      supplier,
      // images: imageIds,
      is_active,
      SKU_code,
    };

    const result = await productApi.update<TProduct>({ params: payload, endpoint: `${row?.id}/` });

    if (result?.data) {
      // update product id for images
      const productImages =
        images?.map((item) => ({
          id: item.id,
          payload: { product: result.data.id, is_default: item.is_default },
        })) || [];
      await imageService.updateListImages(productImages);

      const productDeprecatedImages =
        deprecatedImages?.map((item) => ({ id: item.id, payload: { product: result.data.id } })) ||
        [];
      await imageService.removeListImages(productDeprecatedImages);
      // ------

      showSuccess(RESPONSE_MESSAGES.UPDATE_SUCCESS);
      closeModalAfterConfirm();
    } else {
      showError(RESPONSE_MESSAGES.UPDATE_ERROR);
    }
  };

  useEffect(() => {
    if (open) {
      const form = handleFormatResProductToForm(row);
      setProductModal((prev) => ({
        ...prev,
        loading: false,
        funcContentSchema: (yup) => productSchema(yup, row?.id),
        maxWidth: "lg",
        title: row?.id
          ? `${PRODUCT_LABEL.update_product} ${row?.name}`
          : PRODUCT_LABEL.create_product,
        buttonText: row?.id ? BUTTON.UPDATE : BUTTON.ADD,
        defaultData: row?.id ? form : PRODUCT_FORM_DATA_DEFAULT,
      }));
    } else {
      setProductModal({});
    }
  }, [open, row]);

  return (
    <>
      {open ? (
        <FormPopup
          funcContentRender={(methods) => {
            return (
              <>
                <GeneralInfo {...methods} productId={row?.id} type={IMAGE_TYPE.PD} />
                {/* chỉ show lúc tạo */}
                {!row?.id && <ListVariant {...methods} />}
              </>
            );
          }}
          handleClose={closeModalAfterCancle}
          handleSubmitPopup={handleSubmit}
          {...productModal}
          open={open}
        />
      ) : null}
    </>
  );
};

export default FormProductModal;
