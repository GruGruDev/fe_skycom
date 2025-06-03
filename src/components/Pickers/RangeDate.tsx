import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { TextFieldProps, Theme, alpha, styled, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import { DateField, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { DateCalendar, DateCalendarProps } from "@mui/x-date-pickers/DateCalendar";
import { TitleGroup } from "components/Texts";
import { BUTTON } from "constants/button";
import { LABEL } from "constants/label";
import { RANGE_DATE_OPTIONS, YYYY_MM_DD, yyyy_MM_dd } from "constants/time";
import { format } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import filter from "lodash/filter";
import map from "lodash/map";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { dateIsValid, fDate, transformDateFilter } from "utils/date";
import { findOption } from "utils/option";
import { showWarning } from "utils/toast";

const dd_mm_yyyy = "DD/M/YYYY";

dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isSelected?: boolean;
  isHovered?: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isHovered",
})<CustomPickerDayProps>(({ theme, isSelected, isHovered }) => ({
  // borderRadius: 0,
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.primary[theme.palette.mode],
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary[theme.palette.mode],
    },
  }),
})) as React.ComponentType<CustomPickerDayProps>;

const isInBetween = (day: Dayjs | null, dayA: Dayjs | null, dayB: Dayjs | null) => {
  if (day == null || dayA == null || dayB == null) {
    return false;
  }

  return day.isBetween(dayA, dayB);
};

const isInSameDate = (dayA: Dayjs, dayB: Dayjs | null | undefined) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isSame(dayB, "date");
};

const isLessDay = (dayA: Dayjs, dayB: Dayjs | null) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isBefore(dayB);
};

const isLessYear = (dayA: Dayjs, dayB: Dayjs | null) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isBefore(dayB, "year");
};

const isLessMonth = (dayA: Dayjs, dayB: Dayjs | null) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isBefore(dayB, "month");
};

function Day(
  props: PickersDayProps<Dayjs> & {
    isSelected?: boolean;
    isHovered?: boolean;
  },
) {
  const { day, isSelected, isHovered, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      disableMargin
      selected={false}
      isSelected={isSelected}
      isHovered={isHovered}
      // isSelected={isInSameDate(day, selectedDay)}
      // isHovered={isInSameWeek(day, hoveredDay)}
    />
  );
}

export interface RangeDateV2Props
  extends DateCalendarProps<Dayjs>,
    React.RefAttributes<HTMLDivElement> {
  handleSubmit?: (created_from: string, created_to: string, dateValue: string | number) => void;
  defaultDateValue?: number | string;
  created_from?: string;
  created_to?: string;
  label?: string;
  size?: "small" | "medium";
  standard?: boolean;
  inputStyle?: React.CSSProperties;
  dropdownStyle?: boolean;
  isTabComponent?: boolean;
  tabComponentStyles?: {
    container?: any;
    tabs?: any;
    tab?: any;
  };
  inputFormat?: string;
  inputProps?: TextFieldProps;
  isShowToolbox?: boolean;
  fullWidth?: boolean;
}

export const RangeDate = ({
  standard,
  inputProps,
  size = "small",
  label = LABEL.TIME,
  handleSubmit,
  defaultDateValue = "all",
  inputStyle,
  isTabComponent,
  dropdownStyle,
  tabComponentStyles,
  created_from,
  created_to,
  inputFormat = YYYY_MM_DD,
  isShowToolbox = true,
  fullWidth,
  ...props
}: RangeDateV2Props) => {
  const theme = useTheme();
  const [date, setDate] = useState<any>({
    dateValue: defaultDateValue,
    created_from: null,
    created_to: null,
    valueDateRange: [null, null],
  });
  const [open, setOpen] = useState(false);
  const startDateInputRef: any = useRef();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [hoveredDayTo, _setHoveredDayTo] = React.useState<Dayjs | null>(null);

  useEffect(() => {
    setDate({
      ...date,
      dateValue: defaultDateValue,
      created_from: created_from || null,
      created_to: created_to || null,
      valueDateRange: [created_from || null, created_to || null],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDateValue, created_from, created_to]);

  const handleChangeRangePicker = (value: any) => {
    setDate({
      ...date,
      valueDateRange: value,
    });
  };

  const handleSelectDate = (objData?: any) => {
    if (objData) {
      switch (objData?.value) {
        case "custom_date":
        case "custom_compare_date": {
          setDate({ ...date, dateValue: objData?.value });
          startDateInputRef?.current?.focus();
          break;
        }
        case "all": {
          setDate({
            ...date,
          });

          handleSubmit?.("all", "all", "all");
          toggle();
          break;
        }
        default: {
          const checkOption = filter(
            RANGE_DATE_OPTIONS,
            (day) => parseInt(objData?.value?.toString()) === day.value,
          );

          const haveToday = checkOption?.[0]?.haveToday ? true : false;

          setDate({
            ...date,
            dateValue: objData.value,
            created_from: transformDateFilter(objData.value, dd_mm_yyyy, haveToday).created_from,
            created_to: transformDateFilter(objData.value, dd_mm_yyyy, haveToday).created_to,
          });

          handleSubmit?.(
            transformDateFilter(objData.value, inputFormat, haveToday).created_from,
            transformDateFilter(objData.value, inputFormat, haveToday).created_to,
            objData.value,
          );

          toggle();
        }
      }
    }
  };

  const handleSubmitRangeDate = () => {
    setDate({
      ...date,
      dateValue: "custom_date",
      created_from: date.valueDateRange[0],
      created_to: date.valueDateRange[1],
    });
    date.valueDateRange[0] &&
      date.valueDateRange[1] &&
      handleSubmit?.(
        format(new Date(date.valueDateRange[0].toString()), yyyy_MM_dd),
        format(new Date(date.valueDateRange[1].toString()), yyyy_MM_dd),
        "custom_date",
      );

    toggle();
  };

  const newValue = useMemo(() => {
    if (date.dateValue === "custom_date") {
      return {
        value: "custom_date",
        label: `${dateIsValid(date.valueDateRange[0]) ? fDate(date.valueDateRange[0]) : ""} - ${
          dateIsValid(date.valueDateRange[1]) ? fDate(date.valueDateRange[1]) : ""
        }`,
      };
    }
    return findOption(RANGE_DATE_OPTIONS, date.dateValue, "value") || RANGE_DATE_OPTIONS[0];
  }, [date.dateValue, date.valueDateRange]);

  const toggle = () => {
    setOpen(!open);
  };

  const inputDateProps: TextFieldProps = {
    variant: "outlined",
    size,
    sx: {
      width: isMobile ? 150 : 200,
      ...inputStyle,
    },
    InputLabelProps: { shrink: true },
  };

  const variant: any = standard ? "standard" : "outlined";

  if (isTabComponent)
    return (
      <Box sx={tabComponentStyles?.container}>
        <Tabs
          value={newValue}
          onChange={(_event: any, value: any) => handleSelectDate(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={tabComponentStyles?.tabs}
        >
          {map(RANGE_DATE_OPTIONS, (option, index) => (
            <Tab value={option} label={option.label} key={index} sx={tabComponentStyles?.tab} />
          ))}
        </Tabs>
      </Box>
    );

  return (
    <>
      <TextField
        size={size}
        variant={variant}
        label={dropdownStyle ? "" : label}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          readOnly: true,
          disableUnderline: dropdownStyle ? true : false,
          endAdornment: (
            <InputAdornment position="end">
              {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </InputAdornment>
          ),
        }}
        sx={{
          cursor: "pointer",
          transition: theme.transitions.create("all", {
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.easeInOut,
          }),
          ...(dropdownStyle && {
            "&: hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: "4px",
          }),
          ".MuiInput-input": {
            cursor: "pointer",
            ...(dropdownStyle && {
              padding: "8px",
              fontWeight: 500,
            }),
          },
        }}
        onClick={toggle}
        value={newValue.label}
        fullWidth={fullWidth}
        {...inputProps}
      />
      <Dialog onClose={toggle} open={open} maxWidth="md" fullWidth>
        <DialogTitle>{LABEL.SELECT_DATE}</DialogTitle>
        <DialogContent sx={{ p: "24px!important" }}>
          <Stack
            direction={isMobile ? "column-reverse" : "row"}
            spacing={1}
            display="flex"
            alignItems="flex-start"
          >
            <Stack direction="column" spacing={1} width={"100%"}>
              {/* Nhập ngày */}
              <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={1} display="flex" alignItems="center">
                  <Point />
                  <TitleGroup>{LABEL.OPTION_DATE}</TitleGroup>
                </Stack>
                <Grid container gap={1} alignItems={"center"}>
                  <DateField
                    {...(inputDateProps as any)}
                    label={LABEL.FROM}
                    value={date.valueDateRange[0] ? dayjs(date.valueDateRange[0]) : null}
                    inputRef={startDateInputRef}
                    format={dd_mm_yyyy}
                    size="small"
                    onChange={(value) => handleChangeRangePicker([value, value])}
                  />
                  <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                  <DateField
                    {...(inputDateProps as any)}
                    label={LABEL.TO}
                    value={date.valueDateRange[1] ? dayjs(date.valueDateRange[1]) : null}
                    onChange={(value: any) => {
                      const toTime = new Date(value).getTime();
                      const fromTime = date.valueDateRange[0]
                        ? new Date(date.valueDateRange[0]).getTime()
                        : 0;
                      if (toTime < fromTime) {
                        showWarning(LABEL.SELECT_HEIGHT_DATE);
                        return;
                      }
                      handleChangeRangePicker([date.valueDateRange[0], value]);
                    }}
                    format={dd_mm_yyyy}
                    size="small"
                  />
                </Grid>
              </Stack>
              {isMobile ? null : (
                <Stack
                  direction={"row"}
                  border="1px solid"
                  borderColor={"divider"}
                  borderRadius={2}
                >
                  <DateCalendar
                    value={date.valueDateRange[0] ? dayjs(date.valueDateRange[0]) : null}
                    onChange={(value) => handleChangeRangePicker([value, value])}
                    slots={{ day: Day }}
                    slotProps={{
                      day: (ownerState) => {
                        return {
                          // selectedDay: date.valueDateRange[0] ? dayjs(date.valueDateRange[0]) : null,
                          // hoveredDay: hoveredDayFrom,
                          isSelected: isInSameDate(
                            ownerState.day,
                            date.valueDateRange[0] ? dayjs(date.valueDateRange[0]) : null,
                          ),
                          isHovered:
                            (date.valueDateRange[1] || hoveredDayTo) && date.valueDateRange[0]
                              ? isInBetween(
                                  ownerState.day,
                                  dayjs(dayjs(date.valueDateRange[0])),
                                  dayjs(hoveredDayTo || date.valueDateRange[1]),
                                )
                              : undefined,
                          // onPointerEnter: () => setHoveredDayFrom(ownerState.day),
                          // onPointerLeave: () => setHoveredDayFrom(null),
                        } as any;
                      },
                    }}
                    {...props}
                  />
                  <Divider orientation="vertical" variant="middle" flexItem />
                  <DateCalendar
                    value={date.valueDateRange[1] ? dayjs(date.valueDateRange[1]) : null}
                    shouldDisableDate={
                      date.valueDateRange[0]
                        ? (day) => isLessDay(day, dayjs(date.valueDateRange[0]))
                        : undefined
                    }
                    shouldDisableMonth={
                      date.valueDateRange[0]
                        ? (day) => isLessMonth(day, dayjs(date.valueDateRange[0]))
                        : undefined
                    }
                    shouldDisableYear={
                      date.valueDateRange[0]
                        ? (day) => isLessYear(day, dayjs(date.valueDateRange[0]))
                        : undefined
                    }
                    onChange={(value) => {
                      if (date.valueDateRange[0]) {
                        handleChangeRangePicker([date.valueDateRange[0], value]);
                      } else {
                        handleChangeRangePicker([value, value]);
                      }
                    }}
                    slots={{ day: Day }}
                    slotProps={{
                      day: (ownerState) => {
                        // const ownerDay = ownerState.day;
                        return {
                          // selectedDay: date.valueDateRange[1] ? dayjs(date.valueDateRange[1]) : null,
                          // hoveredDay: hoveredDayFrom,
                          isSelected: isInSameDate(
                            ownerState.day,
                            date.valueDateRange[1] ? dayjs(date.valueDateRange[1]) : null,
                          ),
                          isHovered:
                            (date.valueDateRange[1] || hoveredDayTo) && date.valueDateRange[0]
                              ? isInBetween(
                                  ownerState.day,
                                  dayjs(dayjs(date.valueDateRange[0])),
                                  dayjs(hoveredDayTo || date.valueDateRange[1]),
                                )
                              : undefined,
                          // onPointerEnter: () => setHoveredDayTo(ownerDay),
                          // onPointerLeave: () => setHoveredDayTo(null),
                        } as any;
                      },
                    }}
                    {...props}
                  />
                </Stack>
              )}
            </Stack>

            {/* Chọn ngày có sẵn */}
            {isShowToolbox && (
              <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={1} display="flex" alignItems="center">
                  <Point />
                  <TitleGroup>{LABEL.DEFAULT_DATE}</TitleGroup>
                </Stack>
                <StyledList>
                  {map(RANGE_DATE_OPTIONS, (option, index) => (
                    <StyledListItem
                      onMouseDown={() => handleSelectDate(option)}
                      key={index}
                      sx={{
                        ...(date.dateValue === option.value && {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        }),
                      }}
                    >
                      {option.label}
                      {date.dateValue === option.value && (
                        <Box sx={{ pl: 2 }}>
                          <Point sx={{ width: 10, height: 10, borderRadius: "50%" }} />
                        </Box>
                      )}
                    </StyledListItem>
                  ))}
                </StyledList>
              </Stack>
            )}
          </Stack>
          <Stack
            direction="row"
            display="flex"
            justifyContent={isMobile ? "flex-start" : "flex-end"}
            sx={{ pt: 2 }}
          >
            <Button
              onClick={handleSubmitRangeDate}
              variant="contained"
              sx={{
                width: 120,
              }}
              disabled={
                !date.valueDateRange[0] ||
                !date.valueDateRange[1] ||
                !dateIsValid(date.valueDateRange[0]) ||
                !dateIsValid(date.valueDateRange[1])
              }
            >
              {BUTTON.SELECT}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Point = styled(Box)(({ theme }: { theme: Theme }) => ({
  width: 12,
  height: 12,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 4,
}));

const StyledList = styled(List)(({ theme }: { theme: Theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  padding: `8px 0px 8px 0px`,
  maxHeight: 451,
  overflow: "auto",
}));

const StyledListItem = styled(ListItem)(({ theme }: { theme: Theme }) => ({
  fontSize: "0.82rem",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  transition: theme.transitions.create("all", {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));
