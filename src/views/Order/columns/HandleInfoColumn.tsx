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

const COLUMN_NAMES = ["handle_info"];

export const HandleInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TOrderV2 }) => {
    const users = useAppSelector(getDraftSafeSelector("users")).users;

    let isOverAppointmentDate;
    if (row?.appointment_date) {
      const currDate = new Date();
      const appointmentDate = new Date(row.appointment_date);
      isOverAppointmentDate = currDate > appointmentDate;
    }

    const modifiedBy = findOption(users, row?.modified_by);

    return (
      <Stack gap={1}>
        {row?.completed_time && (
          <GridLineLabel
            label={`${ORDER_LABEL.completed_time}:`}
            value={fDateTime(row.completed_time)}
          />
        )}
        <GridLineLabel label={`${ORDER_LABEL.modified}:`} value={fDateTime(row?.modified)} />
        <GridLineLabel label={`${ORDER_LABEL.modified_by}:`} value={modifiedBy?.name || "---"} />

        {row?.appointment_date && (
          <GridLineLabel
            label={`${ORDER_LABEL.appointment_time}:`}
            value={fDateTime(row.appointment_date) || "---"}
            valueSx={{ color: isOverAppointmentDate ? "#B72136" : undefined }}
          />
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
