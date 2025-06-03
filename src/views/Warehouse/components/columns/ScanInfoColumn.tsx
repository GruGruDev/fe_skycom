import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { SHEET_TYPE_VALUE } from "constants/warehouse";
import { INVENTORY_LOG_LABEL } from "constants/warehouse/label";
import { PATH_DASHBOARD } from "routers/paths";
import { TScanHistory } from "types/Sheet";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["scan_info"];

export const ScanInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TScanHistory }) => {
    return (
      <Stack gap={1}>
        <GridLineLabel
          label={`${INVENTORY_LOG_LABEL.sheet_code}:`}
          value={
            <Link
              href={`${window.location.origin}${PATH_DASHBOARD.orders[""]}/${row?.order_number}`}
            >
              {row?.order_key}
            </Link>
          }
        />
        {row?.type && (
          <GridLineLabel
            label={`${INVENTORY_LOG_LABEL.type}:`}
            value={SHEET_TYPE_VALUE[row.type]}
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
