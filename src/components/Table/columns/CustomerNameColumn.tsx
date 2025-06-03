import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { Link } from "@mui/material";
import { TCustomer } from "types/Customer";
import isObject from "lodash/isObject";

const COLUMN_NAMES = ["name"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const CustomerNameColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value, row }: { value: string | TCustomer; row?: TCustomer }) => {
    const customer: Partial<TCustomer> = { id: "", name: "" };

    if (isObject(value)) {
      customer.name = value.name;
      customer.id = value.id;
    } else {
      customer.id = row?.id;
      customer.name = value;
    }

    return customer.name ? (
      <Link href={`${document.location.origin}/customer/${customer?.id}`}>{customer.name}</Link>
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
