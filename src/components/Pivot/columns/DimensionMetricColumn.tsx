import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { SEARCH_INPUT_LABEL } from "constants/index";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const DimensionMetricColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: string }) => {
    if (value === SEARCH_INPUT_LABEL) {
      return null;
    }

    const breakValue = value?.split(/\s*(->|vs)\s*/);

    return (
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <Box>
          {breakValue?.map((item, index) =>
            item === "->" ? <Typography key={index}>→</Typography> : null,
          )}
          {breakValue?.map((item, index) =>
            item === "vs" ? <Typography key={index}>vs</Typography> : null,
          )}
        </Box>
        <Box>
          {breakValue?.map((item, index) =>
            item !== "->" && item !== "vs" ? (
              <Typography key={index} style={styles.metric}>
                {item}
              </Typography>
            ) : null,
          )}
        </Box>
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

const styles = {
  metric: { fontWeight: "600" },
};
