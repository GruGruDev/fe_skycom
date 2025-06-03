import { fileApi } from "apis/file";
import { AxiosResponse } from "axios";
import { RHFUploadMultiFile, RHFUploadMultiFileProps } from "components/HookFormFields";
import { CustomFile } from "components/Uploads/type";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { useState } from "react";
import { IMAGE_TYPE, TImage } from "types/Media";
import { showError, showSuccess } from "utils/toast";

const MAX_IMAGE_WEIGHT = 10728640; // 10MB

export interface UploadImageProps extends Omit<RHFUploadMultiFileProps, "name"> {
  productId?: string;
  variantId?: string;
  materialId?: string;
  type: IMAGE_TYPE;
}

const UploadImage = (props: UploadImageProps) => {
  const { setValue, watch, type, materialId, variantId, productId } = props;

  const { images = [], deprecatedImages = [], prevSubmitImages = [] } = watch?.() || {};

  const [loading, setLoading] = useState(false);

  const handleDrop = async (acceptedFiles: File[]) => {
    setLoading(true);

    const arrResult = await Promise.all(
      acceptedFiles.map((item: File) => {
        return fileApi.uploadImage({
          endpoint: "images/",
          params: {
            image: item,
            type,
            material: materialId,
            product_variant: variantId,
            product: productId,
          },
        });
      }),
    );
    setLoading(false);

    if (arrResult.length) {
      let arrImage: Partial<CustomFile>[] = [];
      arrResult.reduce((prevArr: string[], current) => {
        const { data } = current as AxiosResponse<TImage>;
        arrImage = [...arrImage, { id: data.id, url: data.image }];
        return [...prevArr, data.id];
      }, []);

      showSuccess(RESPONSE_MESSAGES.UPLOAD_SUCCESS);

      // setImages?.(images ? [...images, ...arrId] : arrId);
      setValue?.("images", images ? [...images, ...arrImage] : arrImage, { shouldDirty: true });
      setValue?.(
        "prevSubmitImages",
        prevSubmitImages ? [...prevSubmitImages, ...arrImage] : arrImage,
        {
          shouldDirty: true,
        },
      );
    } else {
      showError(RESPONSE_MESSAGES.UPLOAD_ERROR);
    }
  };

  const handleRemoveAll = async () => {
    setValue?.("images", [], { shouldDirty: true });
  };

  const handleRemove = async (file: Partial<TImage>) => {
    if (file) {
      // const res = await fileApi.remove({
      //   endpoint: `images/${file.id}/`,
      // });
      // if (res) {
      //   const newImages = value?.filter((item: Partial<TImage>) => item.id !== file?.id);
      //   setValue?.("images", newImages, { shouldDirty: true });

      //   showSuccess(RESPONSE_MESSAGES.DELETE_SUCCESS);
      // } else {
      //   showError(RESPONSE_MESSAGES.DELETE_ERROR);
      // }

      const imageIndex = images?.findIndex((item: Partial<TImage>) => item.id === file.id);
      setValue?.("deprecatedImages", [...deprecatedImages, images[imageIndex]], {
        shouldDirty: true,
      });

      images.splice(imageIndex, 1);
      setValue?.("images", images, { shouldDirty: true });
    }
  };

  return (
    <>
      <RHFUploadMultiFile
        name="images"
        showPreview
        accept={"image/*" as any}
        maxSize={MAX_IMAGE_WEIGHT}
        loading={loading}
        onDrop={handleDrop}
        onRemove={handleRemove}
        onRemoveAll={handleRemoveAll}
        isSetDefault
      />
    </>
  );
};

export default UploadImage;
