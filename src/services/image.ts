import { fileApi } from "apis/file";
import map from "lodash/map";
import { TImageDTO } from "types/Media";

const updateListImages = async (images: { id: string; payload: Partial<TImageDTO> }[]) => {
  const res = await Promise.all(
    map(images, async (item) => {
      return await fileApi.update({ endpoint: `images/${item.id}/`, params: item.payload });
    }),
  );
  return res;
};

const removeListImages = async (images: { id: string; payload?: Partial<TImageDTO> }[]) => {
  const res = await Promise.all(
    map(images, async (item) => {
      return await fileApi.remove({ endpoint: `images/${item.id}/` });
    }),
  );
  return res;
};

export const imageService = {
  updateListImages,
  removeListImages,
};
