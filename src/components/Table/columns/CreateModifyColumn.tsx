import { Column, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { LABEL } from "constants/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import find from "lodash/find";
import { TUser } from "types/User";
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

export const CreateModifyColumn = (props: Props) => {
  const Formatter = ({ row, column }: { row?: any; column: Column }) => {
    const { users } = useAppSelector(getDraftSafeSelector("users"));
    let userLabel = "",
      timeLabel = "",
      time = null;

    let user: Partial<TUser> | undefined;

    if (column.name === "created_info") {
      userLabel = LABEL.CREATED_BY;
      timeLabel = LABEL.CREATED;
      time = row.created;
      if (typeof row.created_by === "string") {
        user = find(users, (item) => item.id === row.created_by);
      } else {
        user = row.created_by;
      }
    } else if (column.name === "modified_info") {
      userLabel = LABEL.MODIFIED_BY;
      timeLabel = LABEL.MODIFIED;
      time = row.modified;
      if (typeof row.modified_by === "string") {
        user = find(users, (item) => item.id === row.modified_by);
      } else {
        user = row.modified_by;
      }
    }
    return (
      <Stack spacing={0.5}>
        {user?.name && <GridLineLabel label={`${userLabel}:`} value={user?.name} />}
        {time && <GridLineLabel label={`${timeLabel}:`} value={fDateTime(time)} />}
      </Stack>
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={props.for || ["modified_info", "created_info"]}
    />
  );
};
