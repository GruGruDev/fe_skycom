import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NoDataPanel } from "components/NoDataPanel";
import { LABEL } from "constants/label";
import map from "lodash/map";
import { memo } from "react";
import { HISTORY_ACTIONS } from "types/History";
import { fDateTime } from "utils/date";
import CustomerHistoryItems from "./CustomerHistoryItems";
import CustomerItem from "./CustomerItem";
import OrderItems from "./OrderItems";
interface CDTimelineProps {
  data: any;
  loading: boolean;
  params?: { date_from: string; date_to: string; toValue?: any };
  tagCategoryFilter?: { [key: string]: string };
  onFilterCategory?: React.Dispatch<React.SetStateAction<string>>;
  categoryFilter?: string;
}

const DetailTimeline = (props: CDTimelineProps) => {
  const { data, loading, tagCategoryFilter, categoryFilter, onFilterCategory } = props;

  return (
    <Stack position="relative" height="100%">
      <Stack flexDirection="row" alignItems="center" flexWrap="wrap" gap={1} my={1}>
        <Typography fontSize="0.82rem" fontWeight="bold">
          {LABEL.HISTORY}
        </Typography>
        {tagCategoryFilter &&
          Object.keys(tagCategoryFilter).map((filter: keyof typeof tagCategoryFilter, idx) => {
            return (
              <Chip
                key={idx}
                label={tagCategoryFilter[filter]}
                variant="outlined"
                size="medium"
                color={categoryFilter === filter ? "primary" : "default"}
                onClick={() => onFilterCategory?.(filter as string)}
              />
            );
          })}
      </Stack>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Box overflow="auto" maxHeight={789}>
          <Timeline sx={{ alignItems: "flex-start", marginTop: "16px" }}>
            {data.length ? (
              data.map((item: any, idx: number) => (
                <TimelineItem key={idx}>
                  <TimelineOppositeContent
                    sx={{ flex: "0.2 1 0%", minWidth: "130px", padding: "6px 16px" }}
                  >
                    <Typography fontSize="0.82rem" fontWeight="bold" color="primary">
                      {item.label}
                    </Typography>
                    <Typography fontSize="0.82rem">
                      {fDateTime(item.history_date || item.created)}
                    </Typography>
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent>
                    <Paper elevation={2} sx={{ padding: "16px", fontSize: "0.82rem" }}>
                      {item.category === "CDP" &&
                        (item.history_type !== HISTORY_ACTIONS.CREATE ? (
                          <CustomerHistoryItems history={item.histories} />
                        ) : (
                          <CustomerItem data={item} />
                        ))}
                      {item.category === "ORDER" && <OrderItems data={item} />}
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              ))
            ) : (
              <NoDataPanel containerSx={{ height: 456 }} showImage />
            )}
          </Timeline>
        </Box>
      )}
    </Stack>
  );
};

export default memo(DetailTimeline);

const LoadingSkeleton = () => {
  return (
    <>
      {map([1, 2, 3, 4], (item) => (
        <Stack direction="row" alignItems="center" key={item} width="100%" spacing={1}>
          <Skeleton width={160} height={72} />
          <Skeleton width="100%" height={72} />
        </Stack>
      ))}
    </>
  );
};
