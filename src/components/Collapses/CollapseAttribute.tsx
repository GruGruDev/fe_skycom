import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { NoDataPanel } from "components/NoDataPanel";
import { MExpandMoreIconButton } from "components/Buttons";
import { EditAndDeletePopover } from "components/Popovers";
import { HEIGHT_DEVICE } from "constants/index";
import map from "lodash/map";
import { useMemo, useState } from "react";
import { toSimplest } from "utils/strings";
import { TSelectOption } from "types/SelectOption";
import { TStyles } from "types/Styles";
import { BUTTON } from "constants/button";
import { LABEL } from "constants/label";

interface Props {
  title: string;
  labelDialog?: string;
  handleAdd?: () => void;
  handleEdit?: (objValue: TSelectOption) => void;
  handleDelete?: (objValue: TSelectOption) => void;
  dataRenderAttribute: TSelectOption[];
}

export const AttributeCollapse = (props: Props) => {
  const {
    title,
    labelDialog,
    dataRenderAttribute = [],
    handleAdd,
    handleEdit,
    handleDelete,
  } = props;
  const [expanded, setExpanded] = useState(false);

  const [search, setSearch] = useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const dataRender = useMemo(() => {
    if (search === "") {
      return dataRenderAttribute;
    }
    return dataRenderAttribute.filter((item) =>
      toSimplest(item.label).includes(toSimplest(search)),
    );
  }, [search, dataRenderAttribute]);

  return (
    <Grid item xs={12} style={styles.collapseWrapper}>
      <Paper elevation={3}>
        <Stack direction="row" alignItems="center" py={2} component={Paper} elevation={2}>
          <div style={styles.expandIconWrapper}>
            <MExpandMoreIconButton
              expand={`${expanded}`}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            />
          </div>
          <Typography gutterBottom component="label" style={styles.title}>
            {title}
          </Typography>
          {handleAdd ? (
            <div style={styles.addButton}>
              <Button variant="contained" onClick={handleAdd}>
                {BUTTON.ADD}
              </Button>
            </div>
          ) : null}
        </Stack>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {dataRenderAttribute.length > 0 && (
            <Box px={2} pt={2} pb={1}>
              <TextField
                fullWidth
                placeholder={LABEL.SEARCH}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
                variant="standard"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          )}

          <TableContainer style={styles.optionWrapper}>
            {dataRender.length ? (
              map(dataRender, (item: TSelectOption, index) => (
                <Grid key={index} container direction="row" alignItems="center" py={1}>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={9.5}>
                    {item.content || <Typography style={styles.content}>{item.label}</Typography>}
                  </Grid>
                  <Grid item xs={1.5}>
                    <EditAndDeletePopover
                      handleDelete={handleDelete ? () => handleDelete(item) : undefined}
                      handleEdit={handleEdit ? () => handleEdit(item) : undefined}
                      status={{ loading: false, error: false }}
                      labelDialog={labelDialog}
                    />
                  </Grid>
                </Grid>
              ))
            ) : (
              <Stack direction="row" alignItems="center" justifyContent="center" p={5}>
                <NoDataPanel />
              </Stack>
            )}
          </TableContainer>
        </Collapse>
      </Paper>
    </Grid>
  );
};

const styles: TStyles<
  "collapseWrapper" | "title" | "expandIconWrapper" | "addButton" | "content" | "optionWrapper"
> = {
  collapseWrapper: { padding: 8 },
  title: { width: "100%" },
  expandIconWrapper: { width: 60, marginLeft: 10 },
  addButton: { width: 120 },
  content: { width: "100%", fontSize: "0.82rem" },
  optionWrapper: { maxHeight: HEIGHT_DEVICE - 220, paddingTop: 16, paddingBottom: 16 },
};
