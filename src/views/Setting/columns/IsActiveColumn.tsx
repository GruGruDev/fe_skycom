import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { SxProps, Theme } from "@mui/material";
import { Span } from "components/Texts";
import { USER_LABEL } from "constants/user/label";
import { USER_ACTIVE_LABEL } from "types/User";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["is_active"];

export const IsActiveColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value?: boolean }) => {
    return (
      <>
        {value ? (
          <Span color="success" sx={styles.chip}>
            {USER_LABEL[USER_ACTIVE_LABEL.active]}
          </Span>
        ) : (
          <Span color="error" sx={styles.chip}>
            {USER_LABEL[USER_ACTIVE_LABEL.inactive]}
          </Span>
        )}
      </>
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

const styles: { [key: string]: SxProps<Theme> } = {
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};
