import { Theme, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MExpandMoreIconButton } from "components/Buttons";
import { RangeDate } from "components/Pickers";
import { ALL_OPTION } from "constants/index";
import dayjs from "dayjs";
import { useState } from "react";
import { TColumn } from "types/DGrid";
import { TSelectOption } from "types/SelectOption";
import { TStyles, TSx } from "types/Styles";
import { compareDateSelected } from "utils/date";
import { showWarning } from "utils/toast";
import Filter from "./Filter";
import FilterSet from "./Filter/FilterSet";
import { AirTableColumn } from "./Filter/types";
import { countDaysInPeriod } from "./utils/countDaysinPeriod";
import { RANGE_STEP_DATE_OPTIONS } from "constants/pivot";
import { PIVOT_LABEL } from "constants/pivot/label";
import { LABEL } from "constants/label";

export interface PivotSetingProps {
  /**
   *  là 1 trong danh các view  "Ngày", "Tuần", "Tháng", "Quý", "Năm"
   * @default "Tất cả"
   */
  dateView: TSelectOption;
  onChangeDateView: (value: TSelectOption) => void;
  /** danh sách các cột trong bộ filter */
  dimensionFilterColumns?: AirTableColumn[];
  metricFilterColumns?: AirTableColumn[];
  dimensions?: TColumn[];
  /**
   *
   * @param index vị trí của dimension
   * @returns
   */
  onChangeDimensions: (index: number) => void;
  metrics?: TColumn[];
  /**
   * @param index vị trí của metric
   * @returns
   */
  onChangeMetrics: (index: number) => void;
  dimensionFilter?: FilterSet;
  metricFilter?: FilterSet;
  isShowChart?: boolean;
  isShowPivot?: boolean;
  /** ngày lấy report */
  reportDate?: { date_from?: string; date_to?: string; dateValue?: string | number };
  /** ngày lấy report để so sánh */
  compareDate?: { date_from?: string; date_to?: string; dateValue?: string | number };
  /**
   * thay đổi ngày lấy report
   * @param date
   */
  onChangeDate?: (date: {
    date_from?: string;
    date_to?: string;
    dateValue: string | number;
  }) => void;
  /**
   * thay đổi ngày lấy report để so sánh
   * @param date
   */
  onChangeCompareDate?: (date?: {
    date_from?: string;
    date_to?: string;
    dateValue: string | number;
  }) => void;
  onChangeFilterDimension: React.Dispatch<React.SetStateAction<FilterSet | undefined>>;
  onChangeFilterMetric: React.Dispatch<React.SetStateAction<FilterSet | undefined>>;
  onShowChart: (value: boolean) => void;
  onShowPivot: (value: boolean) => void;
}

const PivotSeting = (props: PivotSetingProps) => {
  const {
    dateView,
    dimensionFilterColumns = [],
    metricFilterColumns = [],
    dimensions = [],
    metrics = [],
    dimensionFilter,
    metricFilter,
    isShowChart,
    isShowPivot,
    reportDate,
    compareDate,
    onChangeDimensions,
    onChangeMetrics,
    onChangeFilterDimension,
    onChangeFilterMetric,
    onChangeDateView,
    onShowChart,
    onChangeDate,
    onChangeCompareDate,
    onShowPivot,
  } = props;
  const dayCompareRequire = countDaysInPeriod(reportDate?.date_from, reportDate?.date_to);
  const isCompareDisabled = !reportDate?.date_from || dayCompareRequire < 1;

  const [expanded, setExpanded] = useState(false);
  const [isCompare, setIsCompare] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChangeDateView = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setIsCompare(checked);
    checked && onChangeDateView(ALL_OPTION);
    !checked && onChangeCompareDate?.(undefined);
  };

  const handleSubmitDate = (
    created_from: string,
    creatred_to: string,
    createdDateValue: string | number,
  ) => {
    const {
      date_from,
      date_to,
      value: dateValue,
    } = compareDateSelected(created_from, creatred_to, createdDateValue);
    if (!date_from) setIsCompare(false);
    onChangeDate?.({ date_from, date_to, dateValue });
    setIsCompare(false);
    onChangeCompareDate?.(undefined);
  };

  const handleSubmitDateCompare = (
    created_from: string,
    creatred_to: string,
    createdDateValue: string | number,
  ) => {
    const {
      date_from,
      date_to,
      value: dateValue,
    } = compareDateSelected(created_from, creatred_to, createdDateValue);

    const dayCompareCount = countDaysInPeriod(date_from, date_to);
    if (dayCompareCount === dayCompareRequire) {
      onChangeCompareDate?.({ date_from, date_to, dateValue });
    } else {
      showWarning(`${LABEL.SELECT_CORRECT_PLEASE} ${dayCompareRequire} ${LABEL.DATE}`);
    }
  };

  const handleChangePivotView = (value: boolean) => {
    onShowPivot(value);
    if (!value) {
      onShowChart(false);
      onChangeCompareDate?.(undefined);
      onChangeDateView(ALL_OPTION);
    }
  };

  return (
    <Box width={"100%"} border={"1px solid"} borderColor={"divider"} borderRadius={1}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"start"}
        onClick={handleExpandClick}
        sx={{ ...styled.row, borderBottom: expanded ? "1px solid" : "unset" }}
      >
        <MExpandMoreIconButton
          sx={styles.expand}
          expand={`${expanded}`}
          onClick={handleExpandClick}
          aria-expanded={expanded}
        />
        <Typography fontSize={"1rem"} fontWeight={"700"} ml={1}>
          {LABEL.SETTING}
        </Typography>
      </Stack>
      <Collapse in={expanded} timeout="auto">
        <Stack spacing={2} p={1} direction={"row"}>
          <FormControlLabel
            style={styles.helperLabel}
            control={
              <Checkbox
                onChange={(_e, checked) => handleChangePivotView(checked)}
                checked={isShowPivot}
                name="pivot-checkbox"
              />
            }
            label="Pivot"
          />
          <FormControlLabel
            style={styles.helperLabel}
            control={
              <Checkbox
                onChange={(_e, checked) => onShowChart(checked)}
                checked={isShowChart}
                name="show-chart-checkbox"
                disabled={!isShowPivot}
              />
            }
            label={PIVOT_LABEL.show_chart}
          />
        </Stack>
        <Stack spacing={2} p={1}>
          <SettingSection
            label={PIVOT_LABEL.time}
            content={
              <Stack direction={"row"} alignItems={"start"}>
                <RangeDate
                  standard
                  size="small"
                  label={""}
                  created_from={reportDate?.date_from}
                  created_to={reportDate?.date_to}
                  inputStyle={{ minWidth: 180 }}
                  handleSubmit={handleSubmitDate}
                  defaultDateValue={reportDate?.dateValue}
                  inputProps={{ variant: "outlined" }}
                />
                <>
                  <FormControlLabel
                    style={styles.helperLabel}
                    disabled={isCompareDisabled}
                    control={
                      <Checkbox
                        onChange={handleChangeDateView}
                        checked={isCompare}
                        name="compare-time-checkbox"
                      />
                    }
                    label={PIVOT_LABEL.compare}
                  />
                  <Stack>
                    <RangeDate
                      // disabled={!isShowPivot}
                      minDate={reportDate?.date_from ? dayjs(reportDate?.date_from) : undefined}
                      standard
                      size="small"
                      label={""}
                      created_from={compareDate?.date_from}
                      created_to={compareDate?.date_to}
                      inputStyle={{ minWidth: 180 }}
                      handleSubmit={handleSubmitDateCompare}
                      defaultDateValue={compareDate?.dateValue}
                      inputProps={{ variant: "outlined", disabled: !isCompare }}
                      isShowToolbox={false}
                    />
                    {!isCompareDisabled && isCompare && (
                      <FormLabel
                        style={styles.validateLabel}
                      >{`${LABEL.SELECT} ${dayCompareRequire} ${LABEL.DATE}`}</FormLabel>
                    )}
                  </Stack>
                </>
              </Stack>
            }
          />
          <SettingSection
            label={PIVOT_LABEL.range_date}
            content={
              <Stack direction={"row"} alignItems={"center"}>
                {[...RANGE_STEP_DATE_OPTIONS, ALL_OPTION].map((item) => (
                  <Button
                    disabled={isCompare}
                    key={item.value}
                    onClick={() => onChangeDateView(item)}
                    variant={dateView.value === item.value ? "contained" : "outlined"}
                    style={styles.metrics}
                    sx={{
                      color: dateView.value === item.value ? "background.paper" : "text.primary",
                      borderColor: "divider",
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            }
          />
          <Stack>
            <SettingSection
              label={PIVOT_LABEL.dimension}
              content={
                <>
                  {dimensions.map((item, index) => (
                    <Button
                      onClick={() => onChangeDimensions(index)}
                      key={item.name}
                      variant={item.options?.selected ? "contained" : "outlined"}
                      style={styles.metrics}
                      sx={{
                        color: item.options?.selected ? "background.paper" : "text.primary",
                        borderColor: "divider",
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                </>
              }
            />
            <SettingSection
              label={PIVOT_LABEL.dimension_filter}
              content={
                <Filter
                  columns={dimensionFilterColumns}
                  filter={dimensionFilter}
                  setFilter={onChangeFilterDimension}
                />
              }
            />
          </Stack>
          <Stack>
            <SettingSection
              label={PIVOT_LABEL.metric}
              content={
                <>
                  {metrics.map((item, index) => (
                    <Button
                      key={item.name}
                      onClick={() => onChangeMetrics(index)}
                      variant={item.options?.selected ? "contained" : "outlined"}
                      style={styles.metrics}
                      sx={{
                        color: item.options?.selected ? "background.paper" : "text.primary",
                        borderColor: "divider",
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                </>
              }
            />
            <SettingSection
              label={PIVOT_LABEL.metric_filter}
              content={
                <Filter
                  columns={metricFilterColumns}
                  filter={metricFilter}
                  setFilter={onChangeFilterMetric}
                />
              }
            />
          </Stack>
        </Stack>
      </Collapse>
    </Box>
  );
};

export default PivotSeting;

interface SettingSectionProps {
  label: string;
  content: React.ReactNode | JSX.Element;
}
const SettingSection = (props: SettingSectionProps) => {
  const { label, content } = props;

  return (
    <Grid container margin={0.5} spacing={1} width={"100%"} alignItems={"center"}>
      <Grid item xs={2}>
        <Typography fontSize="1rem">{`${label}:`}</Typography>
      </Grid>
      <Grid item xs={10}>
        {content}
      </Grid>
    </Grid>
  );
};

const styles: TStyles<"metrics" | "expand" | "helperLabel" | "validateLabel"> = {
  helperLabel: { marginLeft: 8 },
  validateLabel: { fontSize: "0.82rem", marginTop: 4 },
  metrics: {
    height: 25,
    fontWeight: "400",
    fontSize: "0.82rem",
    minWidth: "unset",
    marginTop: 4,
    marginRight: 4,
  },
  expand: {
    height: 30,
    width: 30,
    marginLeft: 0,
    color: "text.primary",
  },
};

const styled: TSx<"row"> = {
  row: {
    bgcolor: (theme: Theme) =>
      `${alpha(theme?.palette?.primary?.main, theme?.palette?.action?.hoverOpacity)} `,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    borderColor: "divider",
    p: 1,
  },
};
