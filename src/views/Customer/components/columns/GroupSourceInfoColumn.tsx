import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { TCustomer } from "types/Customer";
import { TStyles } from "types/Styles";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["group_info"];

export const GroupSourceInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TCustomer }) => {
    return (
      <Stack gap={1}>
        <GridLineLabel label={`${CUSTOMER_LABEL.source}:`} value={row?.source} />
        <GridLineLabel
          label={`${CUSTOMER_LABEL.groups}:`}
          value={row?.groups?.map((item) => (
            <Chip
              label={item.name}
              key={item.id}
              size="small"
              style={styles.groupChip}
              component="span"
            />
          ))}
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

const styles: TStyles<"groupChip"> = {
  groupChip: { marginRight: 4 },
};
