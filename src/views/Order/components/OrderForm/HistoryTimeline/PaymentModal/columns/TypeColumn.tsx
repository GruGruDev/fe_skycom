import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import { PAYMENT_TYPE_VALUE } from "constants/order";
import { TOrderPaymentTypeValue } from "types/Order";
import { findOption } from "utils/option";

const COLUMN_NAMES = ["type"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const TypeColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value: TOrderPaymentTypeValue }) => {
    return value ? (
      <Typography sx={{ fontWeight: 400, fontSize: "0.82rem" }}>
        {findOption(PAYMENT_TYPE_VALUE, value, "value")?.label}
      </Typography>
    ) : (
      "---"
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
