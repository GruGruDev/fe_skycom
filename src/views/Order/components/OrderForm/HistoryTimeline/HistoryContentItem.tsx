import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { THistoryChangeReasonRes } from "types/History";

const HistoryContentItem = ({ history }: { history: THistoryChangeReasonRes[] }) => {
  return (
    <Stack gap={1}>
      {history?.map((item: THistoryChangeReasonRes, index: number) =>
        item.old !== item.cur ? (
          <Stack key={index}>
            <Stack direction="row" gap={1} alignItems={"center"} flexWrap="wrap">
              <Typography component="span" fontSize="0.82rem">
                {item.field}:
              </Typography>
              <Chip size="small" label={item.old} color="default" />
              <Typography component="span" fontSize="0.82rem">
                -
              </Typography>

              <Chip size="small" label={item.cur} color="primary" />
            </Stack>
          </Stack>
        ) : null,
      )}
    </Stack>
  );
};

export default HistoryContentItem;
