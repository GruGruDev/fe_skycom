import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { THistoryChangeReasonRes } from "types/History";

const CustomerHistoryItems = ({ history }: { history: THistoryChangeReasonRes[] }) => {
  return (
    <Stack gap={1}>
      {history.map((item, index) => {
        const { field } = item;
        const old = item.old || "---";
        const cur = item.cur || "---";

        return old !== cur ? (
          <Stack key={index}>
            <Stack direction="row" gap={1} alignItems={"center"} flexWrap="wrap">
              <Typography component="span" fontSize="0.82rem">
                {field}:
              </Typography>
              <Chip size="small" label={old} color="default" />
              <Typography component="span" fontSize="0.82rem">
                -
              </Typography>

              <Chip size="small" label={cur} color="primary" />
            </Stack>
          </Stack>
        ) : null;
      })}
    </Stack>
  );
};

export default CustomerHistoryItems;
