import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React, { useState } from "react";
import { clearParamsVar, handleDeleteParam } from "utils/param";
import FilterChips, { FilterChipProps } from "./FilterChip";
import { LeftHeaderColumn, LeftHeaderProps } from "./LeftGrid";
import SortChip, { SortProps } from "./SortChip";
import { RightHeaderColumn, RightHeaderProps } from "./RightGrid";

export type GridWrapHeaderProps = Omit<LeftHeaderProps, "search"> &
  Omit<RightHeaderProps, "filterChipCount"> &
  Omit<FilterChipProps, "children" | "setFilterCount" | "onDelete" | "onClearAll"> &
  SortProps & {
    leftChildren?: React.ReactNode | JSX.Element;
    rightChildren?: React.ReactNode | JSX.Element;
    containerStyles?: React.CSSProperties;
  };

export const HeaderWrapper = (props: GridWrapHeaderProps) => {
  const { children, leftChildren, rightChildren, setParams, params, containerStyles } = props;
  const [filterChipCount, setFilterCount] = useState(0);

  const handleClearFilter = (keys: string[]) => {
    setFilterCount?.(0);
    const newParams = clearParamsVar(keys, params);
    setParams?.(newParams);
  };

  const handleDeleteFilterChip = (type: string, value: string | number) => {
    handleDeleteParam(params || {}, { type, value }, setParams);
  };

  return (
    <Box py={[1, 2]} px={2} component={Paper} style={containerStyles}>
      {/* basic of header */}
      <Grid
        container
        pt={[0, 1]}
        spacing={1.5}
        alignItems="flex-start"
        justifyContent={"space-between"}
      >
        <LeftHeaderColumn {...props} search={params?.search?.toString()}>
          {leftChildren}
        </LeftHeaderColumn>
        <RightHeaderColumn {...props} filterChipCount={filterChipCount}>
          {rightChildren}
        </RightHeaderColumn>
      </Grid>
      <SortChip {...props} sortColumns={props.sortColumns || props.columns} />

      {/* extension header */}
      <Grid container pt={1} spacing={1.5} alignItems="center">
        {children}
      </Grid>

      {/* table chip filter */}
      <Grid container alignItems="center">
        <FilterChips
          {...props}
          setFilterCount={setFilterCount}
          onClearAll={handleClearFilter}
          onDelete={handleDeleteFilterChip}
        />
      </Grid>
    </Box>
  );
};
