import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { TWarehouse } from "types/Warehouse";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["manager_info"];

export const ManagerInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TWarehouse }) => {
    return (
      <Stack spacing={0.5}>
        <GridLineLabel value={row?.manager_name} />
        <GridLineLabel value={row?.manager_phone} />
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
