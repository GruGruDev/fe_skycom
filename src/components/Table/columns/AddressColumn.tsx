import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import { TAddress } from "types/Address";
import { TStyles } from "types/Styles";
import { addressToString } from "utils/customer/addressToString";

const COLUMN_NAMES = ["addresses"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const AddressColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value: TAddress[] }) => {
    return value ? (
      <ul style={styles.listAddress}>
        {value.map((item) => {
          const address = addressToString(item);
          return (
            <Typography component="li" key={item.id} sx={{ fontWeight: 400, fontSize: "0.82rem" }}>
              {address}
            </Typography>
          );
        })}
      </ul>
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

const styles: TStyles<"listAddress"> = {
  listAddress: { paddingLeft: 10 },
};
