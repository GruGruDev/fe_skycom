import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Link from "@mui/material/Link";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  linkFromRow?: (row?: any) => string;
}

export const LinkColumn = ({ for: columnNames = [], linkFromRow, ...props }: Props) => {
  const Formatter = ({ value, row }: { value: string; row?: any }) => {
    return value ? <Link href={linkFromRow?.(row)}>{value}</Link> : null;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={columnNames} />;
};
