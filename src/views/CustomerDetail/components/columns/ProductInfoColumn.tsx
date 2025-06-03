import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import HandlerImage from "components/Images/HandlerImage";
import { GridLineLabel } from "components/Texts";
import { PRODUCT_LABEL } from "constants/product/label";
import { OrderLineItemDTO } from "types/Order";
import { redirectVariantUrl } from "utils/product/redirectUrl";

const COLUMN_NAMES = ["product_info"];

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
  const Formatter = ({ row = {} }: { row?: Partial<OrderLineItemDTO> }) => {
    const { name, SKU_code, bar_code, id, images } = row;

    return (
      <Stack spacing={2} direction="row" alignItems="center">
        <HandlerImage width={72} height={72} value={images} onlyOne />
        <Stack spacing={0.5}>
          <GridLineLabel
            label={`${PRODUCT_LABEL.name}:`}
            value={
              <Link href={`${document.location.origin}${redirectVariantUrl(id)}`}>{name}</Link>
            }
          />
          <GridLineLabel label={`${PRODUCT_LABEL.SKU_code}:`} value={SKU_code} />
          <GridLineLabel label={`${PRODUCT_LABEL.bar_code}:`} value={bar_code} />
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
