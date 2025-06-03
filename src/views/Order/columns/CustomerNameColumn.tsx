import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Link from "@mui/material/Link";
import { TOrderV2 } from "types/Order";

const COLUMN_NAMES = ["name_shipping"];
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
  const Formatter = ({ value, row }: { value: string; row?: TOrderV2 }) => {
    return row?.customer ? (
      <Link href={`${document.location.origin}/customer/${row.customer?.id}`}>{value}</Link>
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
