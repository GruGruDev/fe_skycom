import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TPhone } from "types/Customer";
import { maskedPhone } from "utils/strings";

const COLUMN_NAMES = ["phones"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const PhoneColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value: TPhone[] }) => {
    return value ? (
      <Stack>
        {value.map((item) => (
          <Typography key={item.phone}>{maskedPhone(item.phone)}</Typography>
        ))}
      </Stack>
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
