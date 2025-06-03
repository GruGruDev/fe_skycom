import { styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import { MultiSelect, MultiSelectProps } from "components/Selectors";
import { IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS } from "constants/product";
import { TSelectOption } from "types/SelectOption";
import { ImportVariantForm } from ".";
import { PRODUCT_LABEL } from "constants/product/label";

export const IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM: Partial<MultiSelectProps> = {
  outlined: true,
  simpleSelect: true,
  size: "medium",
  fullWidth: true,
  style: { margin: 0 },
};

type Props = {
  headerOptions: TSelectOption[];
  values: { [key in keyof typeof IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS]: number };
  onSelectColumn: (name: keyof ImportVariantForm, value: number | string) => void;
};

const IMPORT_VALIDATE_ERROR = {
  neoPriceError: { message: PRODUCT_LABEL.neo_price, type: "required" },
  salePriceError: { message: PRODUCT_LABEL.sale_price, type: "required" },
  skuError: { message: PRODUCT_LABEL.SKU_code, type: "required" },
  nameError: { message: PRODUCT_LABEL.name, type: "required" },
  categoryError: { message: PRODUCT_LABEL.category, type: "required" },
  variantNameError: { message: PRODUCT_LABEL.variant_name, type: "required" },
  variantSKUError: { message: PRODUCT_LABEL.variant_SKU_code, type: "required" },
  inventoryQuantityError: { message: PRODUCT_LABEL.inventory_quantity, type: "required" },
};

const GridForm = (props: Props) => {
  const { headerOptions, values, onSelectColumn } = props;
  const {
    sale_price,
    note,
    neo_price,
    name,
    SKU_code,
    inventory_quantity,
    product_SKU_code,
    product_category,
    product_name,
  } = values;

  const handleSelectField = (name: keyof ImportVariantForm, value: number | string) => {
    onSelectColumn(name, value);
  };

  return (
    <GridFieldWrap item xs={12} container spacing={2}>
      <GridFieldWrap item xs={12} sm={4} md={3} xl={2}>
        <MultiSelect
          options={headerOptions}
          error={product_name === -1 ? IMPORT_VALIDATE_ERROR.nameError : undefined}
          title={IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.product_name}
          {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
          selectorId="product_name-field-input"
          value={product_name}
          onChange={(value) => handleSelectField("product_name", value as string)}
        />
      </GridFieldWrap>
      <GridFieldWrap item xs={12} sm={4} md={3} xl={2}>
        <MultiSelect
          options={headerOptions}
          error={product_SKU_code === -1 ? IMPORT_VALIDATE_ERROR.skuError : undefined}
          title={IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.product_SKU_code}
          {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
          selectorId="product_SKU_code-field-input"
          value={product_SKU_code}
          onChange={(value) => handleSelectField("product_SKU_code", value as string)}
        />
      </GridFieldWrap>

      <GridFieldWrap item xs={12} sm={4} md={3} xl={2}>
        <MultiSelect
          options={headerOptions}
          error={product_category === -1 ? IMPORT_VALIDATE_ERROR.categoryError : undefined}
          title={IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.product_category}
          {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
          selectorId="product_category"
          value={product_category}
          onChange={(value) => handleSelectField("product_category", value as number)}
        />
      </GridFieldWrap>
      <GridFieldWrap item xs={12} sm={4} md={3} xl={2}>
        <MultiSelect
          options={headerOptions}
          error={name === -1 ? IMPORT_VALIDATE_ERROR.variantNameError : undefined}
          {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
          title={IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.name}
          selectorId="name"
          value={name}
          onChange={(value) => handleSelectField("name", value as number)}
        />
      </GridFieldWrap>
      <GridFieldWrap item xs={12} sm={4} md={3} xl={2}>
        <MultiSelect
          options={headerOptions}
          error={SKU_code === -1 ? IMPORT_VALIDATE_ERROR.variantSKUError : undefined}
          {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
          title={IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.SKU_code}
          selectorId="SKU_code"
          value={SKU_code}
          onChange={(value) => handleSelectField("SKU_code", value as number)}
        />
      </GridFieldWrap>
      <GridFieldWrap item xs={12} sm={4} md={3} xl={2}>
        <MultiSelect
          options={headerOptions}
          error={sale_price === -1 ? IMPORT_VALIDATE_ERROR.salePriceError : undefined}
          {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
          title={IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.sale_price}
          selectorId="sale_price"
          value={sale_price}
          onChange={(value) => handleSelectField("sale_price", value as number)}
        />
      </GridFieldWrap>
      <GridFieldWrap item xs={12} sm={4} md={3} xl={2}>
        <MultiSelect
          options={headerOptions}
          error={neo_price === -1 ? IMPORT_VALIDATE_ERROR.neoPriceError : undefined}
          {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
          title={IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.neo_price}
          selectorId="neo_price"
          value={neo_price}
          onChange={(value) => handleSelectField("neo_price", value as number)}
        />
      </GridFieldWrap>
      <GridFieldWrap item xs={12} sm={4} md={3} xl={2}>
        <MultiSelect
          options={headerOptions}
          error={
            inventory_quantity === -1 ? IMPORT_VALIDATE_ERROR.inventoryQuantityError : undefined
          }
          {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
          title={IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.inventory_quantity}
          selectorId="inventory_quantity"
          value={inventory_quantity}
          onChange={(value) => handleSelectField("inventory_quantity", value as number)}
        />
      </GridFieldWrap>
      <GridFieldWrap item xs={12} sm={4} md={3} xl={2}>
        <MultiSelect
          options={headerOptions}
          {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
          title={IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.note}
          selectorId="note"
          value={note}
          onChange={(value) => handleSelectField("note", value as number)}
        />
      </GridFieldWrap>
    </GridFieldWrap>
  );
};

export default GridForm;

const GridFieldWrap = styled(Grid)`
  padding: 10px 0px;
  div {
    margin: 0px;
  }
`;
