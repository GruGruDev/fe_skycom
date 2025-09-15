import { ALL_OPTION } from "constants/index";
import { PRODUCT_STATUS_OPTIONS } from "constants/product";
import { PRODUCT_LABEL } from "constants/product/label";
import map from "lodash/map";
import { TFilterProps } from "types/DGrid";
import { TProductFilterOptions } from "types/Product";
import { fNumber } from "utils/number";
import { formatOptionSelect } from "utils/option";
import { formatSelectorForQueryParams, revertFromQueryForSelector } from "utils/param";

const selectorStyle = { width: 180, marginTop: 4 };

const TOTAL_INVENTORY_MAX = 100;
const INVENTORY_STEP = 1;

const PRODUCT_INVENTORY_OPTIONS = [
  { label: "Tất cả", value: "all" },
  { label: "Còn hàng", value: "in_stock" },
  { label: "Hết hàng", value: "out_of_stock" },
];

export const filterOptions = ({
  category = [],
  supplier = [],
  users = [],
  params,
  setParams,
  isFilterActive,
  isFilterCategory,
  isFilterCreatedBy,
  isFilterSupplier,
}: TProductFilterOptions): TFilterProps[] => {
  const onChange = (key: string) => (value: any) =>
    setParams?.({
      ...params,
      page: 1,
      [key]: formatSelectorForQueryParams(value),
    });

  const slideParams = params as { [key: string]: number };

  return [
    isFilterCategory
      ? {
          key: "category",
          type: "select",
          multiSelectProps: {
            onChange: (value) => onChange("category")(value),
            options: [ALL_OPTION, ...category],
            title: PRODUCT_LABEL.category,
            value: revertFromQueryForSelector(params?.category),
            style: selectorStyle,
            selectorId: "category",
          },
        }
      : null,
    isFilterSupplier
      ? {
          key: "supplier",
          type: "select",
          multiSelectProps: {
            onChange: (value) => onChange("supplier")(value),
            options: [ALL_OPTION, ...supplier],
            title: PRODUCT_LABEL.supplier,
            value: revertFromQueryForSelector(params?.supplier),
            style: selectorStyle,
            selectorId: "",
          },
        }
      : null,
    isFilterActive
      ? {
          key: "is_active",
          type: "select",
          multiSelectProps: {
            onChange: (value) => onChange("is_active")(value),
            options: PRODUCT_STATUS_OPTIONS,
            title: PRODUCT_LABEL.is_active,
            value: revertFromQueryForSelector(params?.is_active),
            style: selectorStyle,
            selectorId: "is_active",
          },
        }
      : null,
    isFilterCreatedBy
      ? {
          key: "created_by",
          type: "select",
          multiSelectProps: {
            onChange: (value) => onChange("created_by")(value),
            options: [ALL_OPTION, ...map(users, formatOptionSelect)],
            title: PRODUCT_LABEL.created_by,
            value: revertFromQueryForSelector(params?.created_by),
            style: selectorStyle,
            selectorId: "created_by",
          },
        }
      : null,
    {
      key: "inventory_status",
      type: "select",
      multiSelectProps: {
        onChange: (value) => onChange("inventory_status")(value),
        options: PRODUCT_INVENTORY_OPTIONS,
        title: "Trạng thái tồn kho",
        value: revertFromQueryForSelector(params?.inventory_status),
        style: selectorStyle,
        selectorId: "inventory_status",
      },
    },
    {
      type: "slider",
      key: "total_inventory",
      sliderProps: {
        rangeSliceArr: [
          { label: "0", value: 0 },
          { label: fNumber(TOTAL_INVENTORY_MAX), value: TOTAL_INVENTORY_MAX },
        ],
        title: PRODUCT_LABEL.total_inventory,
        slide: [slideParams?.total_inventory_min || 0, slideParams?.total_inventory_max || 0],
        step: INVENTORY_STEP,
        setSliceValue: ([min, max]) => {
          setParams?.({
            ...params,
            total_inventory_min: min,
            total_inventory_max: max,
          });
        },
      },
    },
  ];
};
