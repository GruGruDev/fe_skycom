import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { PRODUCT_LABEL } from "constants/product/label";
import { TVariant } from "types/Product";
import { fNumber } from "utils/number";

const COLUMN_NAMES = ["price_info"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const PriceInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row = {} }: { row?: Partial<TVariant> }) => {
    const { neo_price = 0, sale_price = 0, total_inventory = 0 } = row;

    return (
      <Stack spacing={0.5}>
        <GridLineLabel label={`${PRODUCT_LABEL.neo_price}:`} value={fNumber(neo_price)} />
        <GridLineLabel label={`${PRODUCT_LABEL.sale_price}:`} value={fNumber(sale_price)} />
        <GridLineLabel
          label={`${PRODUCT_LABEL.total_inventory}:`}
          value={fNumber(total_inventory)}
        />
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

export default PriceInfoColumn;
