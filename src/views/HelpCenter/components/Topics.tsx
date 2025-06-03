import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

//
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Detail } from "./Detail";

interface TTOPIC {
  title: string;
  desctiption: {
    contents: JSX.Element;
  };
}
interface TTopic {
  name?: string;
  data: TTOPIC[];
}

export const Topics = ({ data }: TTopic) => {
  const [showDetail, setShowDetail] = useState<Boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<Number>();

  const handleShowDetail = (key: Number) => {
    setShowDetail(true);
    setSelectedIndex(key);
  };

  return (
    <Grid container spacing={1} sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }} py={4}>
      {data.map((topic: TTOPIC, index) => {
        return (
          <>
            <Grid
              xs={12}
              md={6}
              sm={6}
              item
              key={index}
              p={2}
              sx={{ display: !Boolean(showDetail) ? "block" : "none" }}
            >
              <Paper elevation={3}>
                <Stack
                  onClick={() => handleShowDetail(index)}
                  direction="row"
                  alignItems="center"
                  p={2}
                  pr={3}
                  component={Paper}
                  elevation={2}
                  justifyContent={"space-between"}
                  sx={{ cursor: "pointer" }}
                >
                  <Typography component="label">{topic?.title}</Typography>
                  <ArrowRightAltIcon />
                </Stack>
              </Paper>
            </Grid>

            {/* show detail when click topic */}
            {!!showDetail && selectedIndex === index && (
              <Detail data={topic.desctiption} setShowDetail={setShowDetail}></Detail>
            )}
          </>
        );
      })}
    </Grid>
  );
};
