import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { LabelInfo, TextInfo } from "components/Texts";
import { fValueVnd } from "utils/number";
import { ORDER_LABEL } from "constants/order/label";

const Cost = ({
  price_after_paid,
  isConfirm,
}: {
  price_after_paid: number;
  isConfirm?: boolean;
}) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1} paddingTop={1}>
      <Grid item xs={6}>
        <LabelInfo sx={{ fontSize: "0.82rem", color: "inherit", textTransform: "uppercase" }}>
          {ORDER_LABEL.price_payment}
        </LabelInfo>
      </Grid>
      <Grid item xs={6}>
        <Stack direction={"row"} alignItems="center" justifyContent={"flex-end"} width={"100%"}>
          {isConfirm && (
            <Button
              disableTouchRipple
              variant="outlined"
              sx={{
                borderColor: "success.main",
                color: "success.main",
                marginRight: 2,
                "&:hover": {
                  borderColor: "success.main",
                  backgroundColor: "transparent",
                  cursor: "unset",
                },
              }}
            >
              {ORDER_LABEL.price_pre_paid}
            </Button>
          )}
          <TextInfo
            sx={{
              color: "error.main",
              fontWeight: 700,
              fontSize: "0.82rem",
              textAlign: "end",
            }}
          >
            {fValueVnd(price_after_paid)}
          </TextInfo>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Cost;
