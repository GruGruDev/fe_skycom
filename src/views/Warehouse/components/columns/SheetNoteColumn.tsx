import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import { TWarehouseHistory } from "types/Sheet";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["sheet_note"];

export const SheetNoteColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TWarehouseHistory }) => {
    return row?.sheet?.note ? (
      <Typography fontSize={"0.825rem"}>{row?.sheet?.note}</Typography>
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
