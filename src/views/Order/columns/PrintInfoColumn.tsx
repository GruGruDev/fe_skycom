import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { GridLineLabel, Span } from "components/Texts";
import { LABEL } from "constants/label";
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

const COLUMN_NAMES = ["print_info"];

export const PrintInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row = {} }: { row?: Partial<TOrderV2> }) => {
    const { is_print, printed_at, printed_by } = row;
    const users = useAppSelector(getDraftSafeSelector("users")).users;

    const printedBy = findOption(users, printed_by);

    return (
      <Stack gap={1}>
        {is_print ? (
          <>
            <GridLineLabel label={`${ORDER_LABEL.created}:`} value={fDateTime(printed_at)} />
            <GridLineLabel label={`${ORDER_LABEL.created_by}:`} value={printedBy?.name} />
          </>
        ) : (
          <Span>{LABEL.NO_DATA}</Span>
        )}
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
