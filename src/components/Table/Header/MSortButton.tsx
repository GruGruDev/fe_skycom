import SwapVertIcon from "@mui/icons-material/SwapVert";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { TSelectOption } from "types/SelectOption";
import { LABEL } from "constants/label";
import { BUTTON } from "constants/button";

interface Props {
  ordering?: string;
  setOrdering: (value?: string) => void;
  orderingOptions?: TSelectOption[];
}

const MSortButton = ({ setOrdering, ordering, orderingOptions = [] }: Props) => {
  const isDesc = ordering?.charAt(0) === "-";

  const [open, setOpen] = useState(false);

  const handleOrdering = (value: string) => {
    setOpen(false);
    if (ordering === value) {
      setOrdering(undefined);
      return;
    }
    setOrdering(value);
  };

  const handleClearOrdering = () => {
    setOrdering(undefined);
    setOpen(false);
  };

  return orderingOptions.length ? (
    <>
      <IconButton onClick={() => setOpen(true)} color={ordering ? "primary" : "inherit"}>
        <SwapVertIcon />
      </IconButton>
      <Drawer
        anchor={"bottom"}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          ".MuiPaper-root": {
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            height: 500,
            padding: 2,
          },
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          position={"relative"}
        >
          <Typography fontSize={"1rem"} fontWeight={"bold"} textAlign={"center"}>
            {LABEL.SORT}
          </Typography>
          {ordering && (
            <Button sx={{ position: "absolute", right: 0, top: 0 }} onClick={handleClearOrdering}>
              <Typography fontSize={"0.825rem"} color={"error.main"}>
                {BUTTON.DELETE}
              </Typography>
            </Button>
          )}
        </Stack>
        <Divider />
        <Stack overflow={"auto"}>
          {orderingOptions.map((item, index) => {
            const isFilterKey = item.value && ordering && ordering?.includes(item.value.toString());
            return (
              <>
                <Stack direction={"row"} key={index} alignItems={"center"}>
                  <Typography width="100%" fontSize={"0.8rem"}>
                    {item.label}
                  </Typography>
                  <Stack minWidth={80}>
                    <Button
                      size="small"
                      color={isFilterKey && !isDesc ? "primary" : "inherit"}
                      onClick={() => handleOrdering(`${item.value}`)}
                    >
                      <Typography fontSize={"0.825rem"}>{LABEL.ACS}</Typography>
                    </Button>
                    <Button
                      size="small"
                      color={isFilterKey && isDesc ? "primary" : "inherit"}
                      onClick={() => handleOrdering(`-${item.value}`)}
                    >
                      <Typography fontSize={"0.825rem"}>{LABEL.DESC}</Typography>
                    </Button>
                  </Stack>
                </Stack>
                <Divider sx={{ borderStyle: "dashed" }} />
              </>
            );
          })}
        </Stack>
      </Drawer>
    </>
  ) : null;
};

export default MSortButton;
