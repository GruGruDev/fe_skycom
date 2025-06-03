import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { TOrderV2 } from "types/Order";
import { fDateTime } from "utils/date";
import { findOption } from "utils/option";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["create_info"];

export const CreateInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TOrderV2 }) => {
    const users = useAppSelector(getDraftSafeSelector("users")).users;

    const createBy = findOption(users, row?.created_by);

    return (
      <Stack gap={1}>
        <GridLineLabel label={`${ORDER_LABEL.created}:`} value={fDateTime(row?.created)} />
        <GridLineLabel label={`${ORDER_LABEL.created_by}:`} value={createBy?.name} />
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
