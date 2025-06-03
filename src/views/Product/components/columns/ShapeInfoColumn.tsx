import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { PRODUCT_LABEL } from "constants/product/label";
import { TProductMaterial } from "types/Product";
import { formatFloatToString } from "utils/number";

const COLUMN_NAMES = ["shape_info"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ShapeInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row = {} }: { row?: Partial<TProductMaterial> }) => {
    const { weight = 0 } = row;

    return (
      <Stack spacing={0.5}>
        <GridLineLabel label={`${PRODUCT_LABEL.weight}:`} value={formatFloatToString(weight)} />
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

export default ShapeInfoColumn;
