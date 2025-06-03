import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { SHEET_LABEL } from "constants/warehouse/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { find } from "lodash";
import { TWarehouseHistory } from "types/Sheet";
import { fDateTime } from "utils/date";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["confirm_info"];

export const ConfirmInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TWarehouseHistory }) => {
    const { users } = useAppSelector(getDraftSafeSelector("users"));
    const user = find(
      users,
      (item) => item.id === row?.confirm_by || item.id === row?.sheet?.confirm_by,
    );

    if (user)
      return (
        <Stack>
          <GridLineLabel label={`${SHEET_LABEL.confirm_by}:`} value={user.name} />
          <GridLineLabel
            label={`${SHEET_LABEL.confirm_date}:`}
            value={fDateTime(row?.confirm_date || row?.sheet?.confirm_date)}
          />
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
