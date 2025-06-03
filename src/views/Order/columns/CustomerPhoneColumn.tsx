import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import { TOrderV2 } from "types/Order";
import { maskedPhone } from "utils/strings";

const COLUMN_NAMES = ["customer_phone"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const CustomerPhoneColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TOrderV2 }) => {
    return row?.customer ? (
      <Typography>{maskedPhone(row.customer?.phones?.[0]?.phone || "")}</Typography>
    ) : null;
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};
