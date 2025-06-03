import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import Button from "@mui/material/Button";
import { LABEL } from "constants/label";
import { TStyles } from "types/Styles";
import { Dispatch, SetStateAction } from "react";

interface Props {
  data: {
    contents: JSX.Element;
  };
  setShowDetail: Dispatch<SetStateAction<Boolean>>;
}
export const Detail = (props: Props) => {
  const { data, setShowDetail } = props;

  return (
    <Grid xs={12} md={12} item p={2}>
      <Paper elevation={3}>
        <Stack p={2} pr={3} component={Paper} elevation={2}>
          <Stack p={2}>
            {data.contents && <Stack sx={{ ...styles.content }}>{data.contents}</Stack>}
          </Stack>

          <Stack sx={{ mt: 1, mr: 1, alignItems: "flex-end" }}>
            <Button
              onClick={() => setShowDetail(false)}
              sx={{ mt: 1, mr: 1, width: "fit-content" }}
            >
              {LABEL.GO_BACK}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Grid>
  );
};

const styles: TStyles<"content"> = {
  content: {
    marginBottom: "10px",
  },
};
