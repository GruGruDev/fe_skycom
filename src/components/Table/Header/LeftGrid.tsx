import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SearchField, SearchFieldProps } from "components/Fields";
import React from "react";
import { TStyles } from "types/Styles";

export interface LeftHeaderProps
  extends Omit<
    SearchFieldProps,
    | "defaultValue"
    | "placeholder"
    | "fullWidth"
    | "style"
    | "sx"
    | "place"
    | "minLength"
    | "error"
    | "disabled"
  > {
  tableTitle?: string;
  children?: React.ReactNode | JSX.Element;
  search?: string;
  searchPlaceholder?: string;
}

export const LeftHeaderColumn = ({
  search,
  tableTitle,
  children,
  searchPlaceholder,
  ...props
}: LeftHeaderProps) => {
  return (
    <Grid alignItems="center" item xs={12} md={7} lg={5} xl={4} className="left-header-column">
      <Stack direction="row" alignItems="flex-start" marginTop={0.5}>
        {tableTitle && (
          <Typography fontSize={"1rem"} fontWeight="bold">
            {tableTitle}
          </Typography>
        )}
        <SearchField
          defaultValue={search}
          fullWidth
          style={styles.searchField}
          sx={{ input: { fontSize: "0.82rem" } }}
          placeholder={searchPlaceholder}
          {...props}
        />
        {children}
      </Stack>
    </Grid>
  );
};

const styles: TStyles<"searchField"> = {
  searchField: { marginRight: 8 },
};
