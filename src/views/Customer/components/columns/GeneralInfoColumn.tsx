import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { GridLineLabel } from "components/Texts";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { NONE } from "constants/index";
import { GENDER_LABEL, TCustomer } from "types/Customer";
import { TSelectOption } from "types/SelectOption";
import { TStyles } from "types/Styles";
import { fDate } from "utils/date";
import { findOption } from "utils/option";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  rankOptions: TSelectOption[];
}

const COLUMN_NAMES = ["general_info"];

export const GeneralInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TCustomer }) => {
    const rankInfo = () => {
      if (row?.rank) {
        const rank = findOption(props.rankOptions, row.rank, "value");
        return (
          <Stack gap={1}>
            <Chip
              label={rank?.value || NONE}
              size="small"
              variant="outlined"
              style={{
                borderColor: rank?.color || "text.secondary",
                backgroundColor: rank?.color || "text.secondary",
                color: rank?.color ? "#ffffff" : "unset",
                fontWeight: rank?.color ? "bold" : "unset",
              }}
            />
          </Stack>
        );
      }
      return "NONE";
    };

    const renderGender = () => (
      <Stack direction="row">
        {row?.gender === "female" && (
          <>
            <FemaleIcon style={styles.sexIcon} />
            <Typography>{CUSTOMER_LABEL[GENDER_LABEL.female]}</Typography>
          </>
        )}
        {row?.gender === "male" && (
          <>
            <MaleIcon style={styles.sexIcon} />
            <Typography>{CUSTOMER_LABEL[GENDER_LABEL.male]}</Typography>
          </>
        )}
      </Stack>
    );

    return (
      <Stack gap={1} alignItems="flex-start">
        <GridLineLabel label={`${CUSTOMER_LABEL.rank}:`} value={rankInfo()} />
        {row?.gender && renderGender()}
        <GridLineLabel
          label={`${CUSTOMER_LABEL.birthday}:`}
          value={fDate(row?.birthday) || "---"}
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

const styles: TStyles<"sexIcon"> = {
  sexIcon: { fontSize: "1.3rem" },
};
