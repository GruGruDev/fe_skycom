import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React from "react";
import { TSx } from "types/Styles";
interface Props extends Partial<TSx<"valueSx" | "labelSx" | "containerSx">> {
  label?: React.ReactNode | JSX.Element | string | number;
  link?: string;
  value?: string | number | JSX.Element | React.ReactNode;
  vertical?: boolean;
  onClick?: (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => void;
  error?: boolean;
  displayType?: "stack" | "grid";
  xsLabel?: number;
  xsValue?: number;
}

export const GridLineLabel = React.forwardRef(
  (props: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
    const {
      label,
      link,
      value = "",
      vertical,
      valueSx,
      labelSx,
      containerSx,
      onClick,
      error,
      displayType = "stack",
      xsLabel,
      xsValue,
    } = props;

    const isStack = displayType === "stack";
    return (
      <Grid container sx={containerSx} ref={ref} flex={1} alignItems="center">
        {label && (
          <Grid
            item
            xs={isStack ? 0 : vertical ? 12 : xsLabel ? xsLabel : 5}
            sx={labelSx}
            display="flex"
            alignItems="flex-start"
            justifyContent={"flex-start"}
          >
            <FormLabel
              component="span"
              sx={{
                pr: isStack ? 1 : 0,
                color: error ? (theme) => `${theme.palette.error.main} !important` : "unset",
                fontWeight: 400,
                paddingRight: 1,
                fontSize: "0.82rem",

                ...(onClick && {
                  cursor: "pointer",
                  transition: "all .2s ease-in-out",
                  color: error ? (theme) => theme.palette.error.main : "secondary.main",
                }),
              }}
              onClick={onClick}
            >
              {label}
            </FormLabel>
          </Grid>
        )}
        <Grid
          item
          xs={isStack ? 0 : vertical ? 12 : xsValue ? xsValue : 7}
          display="flex"
          alignItems="flex-start"
          justifyContent={"flex-start"}
          flex={isStack ? 1 : undefined}
          sx={valueSx}
        >
          {typeof value === "string" || typeof value === "number" ? (
            <Typography
              sx={{ width: "100%", fontWeight: 600, fontSize: "0.82rem" }}
              href={link}
              component={link ? Link : "div"}
            >
              {value}
            </Typography>
          ) : (
            value
          )}
        </Grid>
      </Grid>
    );
  },
);
