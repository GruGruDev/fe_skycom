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
import { MExpandMoreIconButton } from "components/Buttons";
import { NoDataPanel } from "components/NoDataPanel";
import { FormPopup } from "components/Popups";
import { BUTTON } from "constants/button";
import { HEIGHT_DEVICE } from "constants/index";
import { LABEL } from "constants/label";
import map from "lodash/map";
import { useMemo, useState } from "react";
import { TAttribute } from "types/Attribute";
import { searchAlgorithm } from "utils/strings";
import { AttributeProps, CollapseAttributeItem } from ".";

interface Props extends Omit<AttributeProps, "row"> {
  title: string;
  data: TAttribute[];
  handleCreateAction?: (row: TAttribute) => Promise<boolean>;
  expandedDefault?: boolean;
  type: string;
}

export const AttributeIncludeFormModalCollapse = ({
  data = [],
  expandedDefault,
  handleCreateAction,
  ...props
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [expanded, setExpanded] = useState(expandedDefault || false);

  const [search, setSearch] = useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onSubmitAttribute = async (form: { [key: string]: string }) => {
    const res = await handleCreateAction?.({
      ...form,
      name: form[props.type]?.trim(),
      type: props.type,
    });
    if (res) {
      setIsOpen(false);
    }

    // if (!!props.state.error) {
    //   setIsOpen(true);
    // } else {
    //   setIsOpen(false);
    // }
  };

  const dataRender = useMemo(() => {
    if (search.trim() === "") {
      return data;
    }
    return data.filter((item) => searchAlgorithm(item.name, search));
  }, [data, search]);

  return (
    <Grid item xs={12} style={containerStyle}>
      <FormPopup
        transition
        open={isOpen}
        loading={props.state.loading}
        title={props.title}
        funcContentSchema={props.formSchema}
        funcContentRender={props.funcContentRender}
        buttonText={BUTTON.ADD}
        defaultData={props.formDefaultData ? props.formDefaultData() : undefined}
        handleClose={() => setIsOpen(false)}
        handleSubmitPopup={onSubmitAttribute}
      />
      <Paper elevation={3}>
        <Stack direction="row" alignItems="center" p={2} pr={3} component={Paper} elevation={2}>
          <div style={expandIconStyle}>
            <MExpandMoreIconButton
              expand={`${expanded}`}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            />
          </div>
          <Typography component="label" style={titleStyle}>
            {props.title}
          </Typography>
          {handleCreateAction && (
            <Button variant="contained" onClick={() => setIsOpen(true)}>
              {BUTTON.ADD}
            </Button>
          )}
        </Stack>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
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

          {data.length ? (
            <TableContainer style={tableStyle}>
              {map(dataRender, (row, index) => {
                return (
                  <CollapseAttributeItem
                    {...props}
                    key={row.id || row.name}
                    index={index}
                    row={row}
                  />
                );
              })}
            </TableContainer>
          ) : (
            <NoDataPanel containerSx={{ my: 1, borderRadius: 1 }} />
          )}
        </Collapse>
      </Paper>
    </Grid>
  );
};

const containerStyle = { padding: 8 };
const expandIconStyle = { width: 60, marginRight: 8 };
const titleStyle = { width: "100%", fontWeight: 500, mb: 0 };
const tableStyle = { maxHeight: HEIGHT_DEVICE - 220, marginBottom: 5 };
