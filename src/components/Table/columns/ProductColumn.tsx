import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { GridLineLabel } from "components/Texts";
import { PRODUCT_LABEL } from "constants/product/label";
import { TVariant, VARIANT_TYPE } from "types/Product";
import useSettings from "hooks/useSettings";
import { redirectVariantUrl } from "utils/product/redirectUrl";
import HandlerImage from "components/Images/HandlerImage";

const COLUMN_NAMES = [""];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ProductInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value = {} }: { value?: Partial<TVariant> }) => {
    const { tableLayout } = useSettings();
    const { name, SKU_code, bar_code, id, images, type } = value || {};

    const isVariant = type === VARIANT_TYPE.SIMPLE;

    const groupTable = tableLayout === "group";

    return (
      <Stack spacing={2} direction="row" alignItems="center">
        <HandlerImage
          width={groupTable ? 72 : 48}
          height={groupTable ? 72 : 48}
          value={images}
          preview
          onlyOne
        />
        <Stack spacing={0.5}>
          <GridLineLabel
            label={`${PRODUCT_LABEL.variant_name}:`}
            value={
              isVariant ? (
                <Link href={`${document.location.origin}${redirectVariantUrl(id)}`}>{name}</Link>
              ) : (
                name
              )
            }
          />
          <GridLineLabel label={`${PRODUCT_LABEL.variant_SKU_code}:`} value={SKU_code} />
          {groupTable && <GridLineLabel label={`${PRODUCT_LABEL.bar_code}:`} value={bar_code} />}
        </Stack>
      </Stack>
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

export default ProductInfoColumn;
