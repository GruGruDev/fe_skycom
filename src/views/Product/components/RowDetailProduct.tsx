import { useCancelToken } from "hooks/useCancelToken";
import { useCallback, useContext, useEffect, useState } from "react";
import { productServices } from "services/product";
import { TDGridData } from "types/DGrid";
import { TProduct, TVariant } from "types/Product";
import { ProductContext } from "..";
import { FormVariantModal } from "./FormVariantModal";
import ProductTable, { ProductTableType } from "./Table";
import { productApi } from "apis/product";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { TabPanelWrap } from "components/Tabs";
import { PRODUCT_LABEL } from "constants/product/label";

/**
 * Combonent hứng list variants của product và list combo_variants của combo
 * thông qua hàm handleFormatSimpleVariantFromProductAndCombo để gom chuyển combo_variants thành variants nếu có
 * trong editComponent sử dụng key combo_variants(đại diện cho combo)
 * nếu có combo_variants thì không cho update variant
 */
export interface Props {
  row: Partial<TProduct & TVariant>;
  heightTable?: number;
}
export const RowDetailProduct = ({
  row,
  heightTable,
  ...props
}: Props & Omit<ProductTableType, "view">) => {
  const context = useContext(ProductContext)?.simpleVariant;
  const [data, setData] = useState<TDGridData<Partial<TVariant & TProduct>>>({
    count: 0,
    data: [],
    loading: false,
  });

  const { newCancelToken } = useCancelToken();

  const handleUpdateVariant = async (form: Partial<TProduct>) => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await productServices.handleUpdateVariant(form);
    if (res) {
      let variantIdx: number = -1;
      if (row.variants) variantIdx = row.variants.findIndex((item) => item.id === form.id);
      const variants = [...(row.variants || [])];
      const newVariant = { ...row?.variants?.[variantIdx], ...res } as Partial<
        Omit<TVariant, "combo_variants">
      >;
      variants.splice(variantIdx, 1, newVariant);
    }
    setData((prev) => ({ ...prev, loading: false }));
    return res;
  };

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await productApi.get<TVariant>({
      params: { product: row.id, cancelToken: newCancelToken() },
      endpoint: "variants/",
    });

    if (result?.data) {
      const { results = [], count = 0 } = result.data;
      setData((prev) => ({ ...prev, data: results, count, loading: false }));
      return;
    }
    if (result.error.name === CANCEL_REQUEST) {
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [row.id, newCancelToken]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <TabPanelWrap
      vertical
      tabs={[
        {
          component: (
            <ProductTable
              data={data}
              {...context}
              {...props}
              isTableInRow
              heightTable={heightTable}
              hiddenPagination
              editComponent={
                row.combo_variants
                  ? undefined
                  : (contentProps) => (
                      <FormVariantModal
                        {...contentProps}
                        handleSubmitModal={handleUpdateVariant}
                        onClose={contentProps.onCancelChanges}
                        onRefresh={getData}
                      />
                    )
              }
            />
          ),
          label: PRODUCT_LABEL.variant,
          title: "variant",
        },
      ]}
      tabPanelSx={{ minWidth: 80 }}
    />
  );
};
