import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { TGender } from "types/Customer";
import Typography from "@mui/material/Typography";
import { TStyles } from "types/Styles";
import { CUSTOMER_LABEL } from "constants/customer/label";

const COLUMN_NAMES = ["gender"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const GenderColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value: TGender }) => {
    return value ? (
      <Stack direction="row">
        {value === "female" && (
          <>
            <FemaleIcon style={styles.sexIcon} />
            <Typography>{`${CUSTOMER_LABEL.female}`}</Typography>
          </>
        )}
        {value === "male" && (
          <>
            <MaleIcon style={styles.sexIcon} />
            <Typography>{`${CUSTOMER_LABEL.male}`}</Typography>
          </>
        )}
      </Stack>
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

const styles: TStyles<"sexIcon"> = {
  sexIcon: { fontSize: "1.3rem" },
};
