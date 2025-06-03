import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, alpha, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MExportFileButton, MExportFileProps } from "components/Buttons";
import { RangeDate } from "components/Pickers";
import { MultiSelect } from "components/Selectors";
import {
  DVisbleColumnsProps,
  DVisibleColumns,
  ToggleHeight,
  ToggleHeightProps,
} from "components/Table";
import { FILTER_GROUPS } from "constants/index";
import useAuth from "hooks/useAuth";
import compact from "lodash/compact";
import React, { useMemo } from "react";
import { TDGrid, TFilterProps } from "types/DGrid";
import { TParams } from "types/Param";
import { TStyles } from "types/Styles";
import { WrapFilterPopup, WrapFilterProps } from "../Filter/WrapFilterPopup";
import ActionButton from "./ActionButton";
import SliderFilter from "../Filter/SliderFilter";
import { fNumber } from "utils/number";

export interface RightHeaderProps
  extends DVisbleColumnsProps,
    ToggleHeightProps,
    Pick<TDGrid, "setParams">,
    Omit<WrapFilterProps, "children"> {
  children?: React.ReactNode | JSX.Element;
  filterOptions?: TFilterProps[];
  onRefresh?: () => void;
  params?: TParams;
  exportExcel?: MExportFileProps;
}

export const RightHeaderColumn = (props: RightHeaderProps) => {
  const {
    filterOptions,
    filterChipCount,
    onRefresh,
    children,
    setFullRow,
    setHiddenColumnNames,
    exportExcel,
  } = props;

  const { user } = useAuth();

  const filterGrouping: FilterGroupItemType[] = useMemo(() => {
    return (
      filterOptions?.reduce((prev: FilterGroupItemType[], current) => {
        if (prev.length === 0) {
          prev = JSON.parse(JSON.stringify(FILTER_GROUPS));
        }
        const tempIndex =
          current?.type === "time"
            ? 1
            : prev.findIndex((item) => item?.label?.includes(current?.key ?? ""));
        const indx = tempIndex !== -1 ? tempIndex : prev.length - 1;
        prev[indx].values = [...prev[indx].values, current];
        return prev;
      }, []) || []
    );
  }, [filterOptions]);

  const isReallyFilterOptionsExist = !!filterGrouping.reduce((prev: FilterGroupItemType[], cur) => {
    return compact(cur.values).length ? [...prev, cur] : prev;
  }, []).length;

  const renderGroup = (group: TFilterProps[]) => (
    <>
      {group.map((item, idx: number) => {
        if (item) {
          if (item.type === "select") {
            return (
              <MultiSelect
                {...item.multiSelectProps}
                key={idx}
                options={item.multiSelectProps?.options || []}
                onChange={item.multiSelectProps?.onChange}
                style={styles.groupSelector}
              />
            );
          } else if (item.type === "slider") {
            return (
              <SliderFilter
                key={idx}
                {...item.sliderProps}
                inputFormatFunc={fNumber}
                step={item.sliderProps?.step || 1}
              />
            );
          } else {
            return (
              <RangeDate
                {...item.timeProps}
                key={idx}
                handleSubmit={item.timeProps?.handleSubmit}
              />
            );
          }
        } else {
          return null;
        }
      })}
    </>
  );

  return (
    <Grid
      item
      justifyContent="flex-end"
      xs={12}
      md={"auto"}
      container
      spacing={1}
      alignItems="center"
      className="right-header-column"
    >
      {onRefresh && (
        <Grid item>
          <IconButton onClick={onRefresh}>
            <RefreshIcon />
          </IconButton>
        </Grid>
      )}

      {filterOptions && isReallyFilterOptionsExist && (
        <Grid item>
          <WrapFilterPopup filterChipCount={filterChipCount}>
            {filterGrouping.map((group: FilterGroupItemType, index: number) =>
              group.values.length ? (
                <FilterGroupItem key={index} group={group} renderValues={renderGroup} />
              ) : null,
            )}
          </WrapFilterPopup>
        </Grid>
      )}
      {setHiddenColumnNames && (
        <Grid item>
          <DVisibleColumns {...props} />
        </Grid>
      )}
      <Grid item>
        <ActionButton {...props}>
          {children}
          {(user?.is_superuser || exportExcel) && (
            <Grid item>
              <MExportFileButton {...exportExcel} />
            </Grid>
          )}
          {setFullRow && (
            <Grid item>
              <ToggleHeight {...props} />
            </Grid>
          )}
        </ActionButton>
      </Grid>
    </Grid>
  );
};

// --------

interface FilterGroupItemType {
  name: string;
  label: string;
  values: TFilterProps[];
}

function FilterGroupItem({
  group,
  renderValues,
}: {
  group: FilterGroupItemType;
  renderValues: (value: TFilterProps[]) => JSX.Element;
}) {
  const theme = useTheme();

  return (
    <Grid item>
      <Stack
        direction="column"
        spacing={0.5}
        key={group.label}
        sx={{
          width: "100%",
          border: `dashed 1px ${theme.palette.divider}`,
          borderRadius: "4px",
          padding: 0,
          overflow: "visible",
          "& .MuiButton-root": {
            zIndex: 1,
          },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
          p={1}
        >
          {group.name}
        </Typography>
        <Stack direction="column" spacing={1} p={1}>
          {renderValues(group.values)}
        </Stack>
      </Stack>
    </Grid>
  );
}

const styles: TStyles<"orderIcon" | "orderButton" | "groupSelector"> = {
  orderIcon: { padding: 2, fontSize: "1.5rem" },
  orderButton: { minHeight: 32 },
  groupSelector: { width: "100%" },
};
