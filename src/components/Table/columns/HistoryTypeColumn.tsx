import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import { HISTORY_ACTION_TYPES } from "constants/index";
import { findOption } from "utils/option";

const COLUMN_NAMES = ["history_type", "change_operation", "action", "history_action"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const HistoryTypeColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value: string }) => {
    const action = findOption(HISTORY_ACTION_TYPES, value, "value");

    return action ? (
      <Chip size="small" variant="outlined" color={action.color} label={action?.label} />
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
