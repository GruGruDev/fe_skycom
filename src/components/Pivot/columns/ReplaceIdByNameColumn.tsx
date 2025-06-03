import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import { TColumn } from "types/DGrid";
import { isUuid } from "utils/strings";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const ReplaceIdByNameColumn = (props: Props) => {
  const Formatter = ({ value, column, row }: { value: string; column: TColumn; row?: any }) => {
    let columnKey = column.name;
    if (isUuid(value)) {
      const dimensionName = column.name.slice(0, -2);
      columnKey = `${dimensionName}name`;
    }

    return <Typography>{row?.[columnKey]}</Typography>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};
