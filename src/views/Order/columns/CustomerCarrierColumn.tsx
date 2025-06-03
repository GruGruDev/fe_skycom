import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import { TUser } from "types/User";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["customer_care_staff"];

export const CustomerCarrierColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: any }) => {
    return (
      <Typography fontSize="0.7rem">
        {(row?.customer?.customer_care_staff as TUser)?.name || "--"}
      </Typography>
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
