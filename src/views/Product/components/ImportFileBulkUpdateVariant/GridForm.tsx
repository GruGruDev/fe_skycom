import { styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import { MultiSelect } from "components/Selectors";
import { BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS } from "constants/product";
import { TSelectOption } from "types/SelectOption";
import { PRODUCT_LABEL } from "constants/product/label";
import { BulkUpdateVariantForm } from ".";
import { IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM } from "../ImportFileVariantStepper/GridForm";

type Props = {
  headerOptions: TSelectOption[];
  values: { [key in keyof typeof BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS]: number };
  onSelectColumn: (name: keyof BulkUpdateVariantForm, value: number | string) => void;
};

const IMPORT_VALIDATE_ERROR = {
  neoPriceError: { message: PRODUCT_LABEL.neo_price, type: "required" },
  salePriceError: { message: PRODUCT_LABEL.sale_price, type: "required" },
  variantSKUError: { message: PRODUCT_LABEL.variant_SKU_code, type: "required" },
};

const GridForm = (props: Props) => {
  const { headerOptions, values, onSelectColumn } = props;
  const { sale_price, neo_price, SKU_code } = values;

  const handleSelectField = (name: keyof BulkUpdateVariantForm, value: number | string) => {
    onSelectColumn(name, value);
  };

  return (
    <GridFieldWrap item xs={12} container spacing={2}>
      <GridFieldWrap item xs={12} sm={4} md={3} xl={2}>
        <MultiSelect
          options={headerOptions}
          error={SKU_code === -1 ? IMPORT_VALIDATE_ERROR.variantSKUError : undefined}
          {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
          title={BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS.SKU_code}
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
          title={BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS.sale_price}
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
          title={BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS.neo_price}
          selectorId="neo_price"
          value={neo_price}
          onChange={(value) => handleSelectField("neo_price", value as number)}
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
