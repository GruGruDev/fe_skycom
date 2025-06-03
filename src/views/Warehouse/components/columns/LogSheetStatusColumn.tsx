import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { SxProps, Theme } from "@mui/material";
import Stack from "@mui/material/Stack";
import { GridLineLabel, Span } from "components/Texts";
import { SHEET_LABEL } from "constants/warehouse/label";
import { CONFIRM_LABEL, TWarehouseHistory } from "types/Sheet";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["status"];

export const LogSheetStatusColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TWarehouseHistory }) => {
    return (
      <Stack gap={1} direction="row" flexWrap="nowrap">
        <GridLineLabel
          label={
            <Span color={row?.sheet?.is_confirm ? "primary" : "error"} sx={styles.chip}>
              {row?.sheet?.is_confirm
                ? SHEET_LABEL[CONFIRM_LABEL.confirmed]
                : SHEET_LABEL[CONFIRM_LABEL.not_confirm]}
            </Span>
          }
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

const styles: { [key: string]: SxProps<Theme> } = {
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};
