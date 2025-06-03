import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { TCustomer } from "types/Customer";

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

export const OrderInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TCustomer }) => {
    return (
      <Stack gap={1}>
        <GridLineLabel label={`${CUSTOMER_LABEL.total_order}:`} value={row?.total_order} />
        <GridLineLabel label={`${CUSTOMER_LABEL.total_spent}:`} value={row?.total_spent} />
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
