import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { TOrderV2 } from "types/Order";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["order_info"];

export const InfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TOrderV2 }) => {
    return (
      <Stack gap={1}>
        <Link href={`${window.location.origin}/orders/${row?.id}`}>{row?.order_key}</Link>

        {row?.source && (
          <GridLineLabel
            label={`${ORDER_LABEL.source}:`}
            value={<Chip size="small" color="primary" label={row.source.name} />}
          />
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
