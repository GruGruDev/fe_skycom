import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { Span } from "components/Texts";
import { TVariant } from "types/Product";
import { fNumber, fPercent } from "utils/number";

const COLUMN_NAMES = ["commission_value"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const CommisionValue = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row = {} }: { row?: Partial<TVariant> }) => {
    const { commission, commission_percent } = row;

    return (
      <Stack spacing={0.5}>
        {commission && <Span color="success">{fNumber(commission)}</Span>}
        {commission_percent && (
          <Span color="info">{fPercent((commission_percent || 0) / 100)}</Span>
        )}
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

export default CommisionValue;
