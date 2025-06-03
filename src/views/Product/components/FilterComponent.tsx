import MultiSelectPoper from "components/Selectors/MultiSelectPoper";
import { FULL_OPTIONS } from "constants/index";
import { PRODUCT_STATUS_OPTIONS } from "constants/product";
import { PRODUCT_LABEL } from "constants/product/label";
import { TProductFilterOptions } from "types/Product";
import { revertFromQueryForSelector } from "utils/param";
import compact from "lodash/compact";

const FilterComponent = (props: TProductFilterOptions & {}) => {
  const {
    category = [],
    supplier = [],
    isFilterActive,
    isFilterCategory,
    isFilterSupplier,
    params,
    setParams,
  } = props;

  return (
    <>
      {isFilterCategory && (
        <MultiSelectPoper
          options={[...FULL_OPTIONS, ...category]}
          value={revertFromQueryForSelector(params?.category)}
          title={PRODUCT_LABEL.category}
          onChange={(value) => setParams?.({ ...params, category: value, page: 1 })}
          badgeContent={compact(params?.category as string[]).length}
        />
      )}
      {isFilterSupplier && (
        <MultiSelectPoper
          options={[...FULL_OPTIONS, ...supplier]}
          value={revertFromQueryForSelector(params?.supplier)}
          title={PRODUCT_LABEL.supplier}
          onChange={(value) => setParams?.({ ...params, supplier: value, page: 1 })}
          badgeContent={compact(params?.supplier as string[]).length}
        />
      )}
      {isFilterActive && (
        <MultiSelectPoper
          options={PRODUCT_STATUS_OPTIONS}
          value={revertFromQueryForSelector(params?.is_active)}
          title={PRODUCT_LABEL.is_active}
          onChange={(value) => setParams?.({ ...params, is_active: value, page: 1 })}
          simpleSelect
          badgeContent={compact([params?.is_active]).length}
        />
      )}
    </>
  );
};

export default FilterComponent;
