import { TabPanelWrap, TabType } from "components/Tabs";
import reduce from "lodash/reduce";
import { memo, useContext, useEffect, useState } from "react";
import { productServices } from "services/product";
import { TProduct, TVariant } from "types/Product";
import { ProductContext } from "..";
import { FormVariantModal } from "./FormVariantModal";
import ProductTable from "./Table";
import { PRODUCT_LABEL } from "constants/product/label";

const PRODUCT_DETAIL_TABS = (props: Props): TabType[] => [
  {
    title: "variants",
    label: PRODUCT_LABEL.variant,
    component: <ProductRowDetailTable {...props} />,
  },
];

/**
 * Combonent hứng list variants của product và list combo_variants của combo
 * thông qua hàm handleFormatSimpleVariantFromProductAndCombo để gom chuyển combo_variants thành variants nếu có
 * trong editComponent sử dụng key combo_variants(đại diện cho combo)
 * nếu có combo_variants thì không cho update variant
 */
export interface Props {
  row: Partial<TProduct & TVariant>;
  onRefresh?: () => void;
}
export const RowDetail = memo((props: Props) => {
  return <TabPanelWrap tabs={PRODUCT_DETAIL_TABS(props)} vertical />;
});

const ProductRowDetailTable = ({ row, onRefresh }: Props) => {
  const context = useContext(ProductContext)?.simpleVariant;
  const [data, setData] = useState<Partial<TProduct>>(row);

  const handleUpdateVariant = async (form: Partial<TProduct>) => {
    const res = await productServices.handleUpdateVariant(form);
    if (res) {
      let variantIdx: number = -1;
      if (row.variants) variantIdx = row.variants.findIndex((item) => item.id === form.id);
      const variants = [...(row.variants || [])];
      const newVariant = { ...row?.variants?.[variantIdx], ...res } as Partial<
        Omit<TVariant, "combo_variants">
      >;
      variants.splice(variantIdx, 1, newVariant);
      setData((prev) => ({ ...prev, variants }));
    }
    return res;
  };

  const handleFormatSimpleVariantFromProductAndCombo = (row: Partial<TProduct & TVariant>) => {
    const comboVariants = reduce(
      row.combo_variants,
      (prev: Partial<TProduct>[], cur) => {
        return [...prev, { ...cur, ...cur.detail_variant, sale_price: cur.price_detail_variant }];
      },
      [],
    );
    const value = {
      ...row,
      variants: row.variants?.length ? row.variants : comboVariants,
    } as Partial<TProduct>;
    return value;
  };

  useEffect(() => {
    setData(handleFormatSimpleVariantFromProductAndCombo(row));
  }, [row]);

  return (
    <ProductTable
      data={{ loading: false, count: 0, data: data.variants || [] }}
      {...context}
      heightTable={350}
      hiddenPagination
      editComponent={
        row.combo_variants
          ? undefined
          : (contentProps) => (
              <FormVariantModal
                {...contentProps}
                handleSubmitModal={handleUpdateVariant}
                onClose={contentProps.onCancelChanges}
                onRefresh={onRefresh}
              />
            )
      }
    />
  );
};
