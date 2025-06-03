import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { find } from "lodash";
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

const COLUMN_NAMES = ["customer_care_info"];

export const CareInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TCustomer }) => {
    const { users } = useAppSelector(getDraftSafeSelector("users"));

    const staffName = find(users, (user) => user.id === row?.customer_care_staff)?.name;

    if (staffName)
      return (
        <Stack gap={1}>
          <GridLineLabel value={staffName} />
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
