import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import DateRangePicker from "@mui/lab/DateRangePicker";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { RANGE_MONTH_OPTIONS, YYYY_MM_DD } from "constants/time";
import { transformMonthFilter } from "utils/date";
import dayjs from "dayjs";
import { TStyles } from "types/Styles";
import { LABEL } from "constants/label";
import { findOption } from "utils/option";

interface Props {
  handleSubmit: (created_from: string, created_to: string, dateValue: string | number) => void;
  defaultDateValue?: number | string;
  created_from?: string;
  created_to?: string;
  label?: string;
  style?: React.CSSProperties;
  size?: "small" | "medium";
  standard?: boolean;
  inputStyle?: React.CSSProperties;
}

export const RangeMonthDate = ({
  standard,
  size,
  style,
  label = LABEL.TIME,
  handleSubmit,
  defaultDateValue = "all",
  created_from = dayjs(new Date()).subtract(0, "day").format(YYYY_MM_DD),
  created_to = dayjs(new Date()).subtract(0, "day").format(YYYY_MM_DD),
  inputStyle,
}: Props) => {
  const [date, setDate] = useState<any>({
    dateValue: defaultDateValue,
    created_from: dayjs(new Date()).subtract(0, "day").format(YYYY_MM_DD),
    created_to: dayjs(new Date()).subtract(0, "day").format(YYYY_MM_DD),
    isShowRangePicker: false,
    valueDateRange: [null, null],
  });

  useEffect(() => {
    setDate({
      ...date,
      dateValue: defaultDateValue,
      created_from,
      created_to,
      valueDateRange: [created_from, created_to],
      isShowRangePicker: defaultDateValue === "custom_date" ? true : false,
    });
  }, [defaultDateValue, date, created_from, created_to]);

  const handleChangeRangePicker = (newValue: any) => {
    setDate({
      ...date,
      valueDateRange: newValue,
    });
  };

  const handleSelectDate = (objData?: any) => {
    if (objData) {
      switch (objData?.value) {
        case "custom_date": {
          setDate({
            ...date,
            dateValue: "custom_date",
            isShowRangePicker: true,
          });
          break;
        }
        case "all": {
          setDate({
            ...date,
            isShowRangePicker: false,
          });

          handleSubmit("all", "all", "all");
          break;
        }
        default: {
          setDate({
            ...date,
            isShowRangePicker: false,
            dateValue: objData.value,
            created_from: transformMonthFilter(objData.value, YYYY_MM_DD).created_from,
            created_to: transformMonthFilter(objData.value, YYYY_MM_DD).created_to,
          });

          handleSubmit(
            transformMonthFilter(objData.value, YYYY_MM_DD).created_from,
            transformMonthFilter(objData.value, YYYY_MM_DD).created_to,
            objData.value,
          );
        }
      }
    }
  };

  const newValue = useMemo(() => {
    return findOption(RANGE_MONTH_OPTIONS, date.dateValue, "value") || RANGE_MONTH_OPTIONS[0];
  }, [date.dateValue]);

  return (
    <div style={styles.wrapper}>
      <Autocomplete
        fullWidth={date.isShowRangePicker ? false : true}
        style={{ width: date.isShowRangePicker ? 150 : undefined, ...style }}
        openOnFocus
        autoHighlight
        value={newValue}
        onChange={(_e: any, value: any) => handleSelectDate(value)}
        options={RANGE_MONTH_OPTIONS}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => (
          <li {...props} style={styles.option}>
            {option.label}
          </li>
        )}
        sx={{ marginTop: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            size={size}
            variant={standard ? "standard" : "outlined"}
            label={label}
          />
        )}
      />
      {date.isShowRangePicker ? (
        <div style={styles.wrapPicker}>
          <DateRangePicker
            calendars={2}
            value={date.valueDateRange}
            onChange={handleChangeRangePicker}
            renderInput={(startProps: any, endProps: any) => (
              <>
                <TextField
                  variant="standard"
                  {...startProps}
                  size={size}
                  label={LABEL.FROM}
                  style={{ ...styles.input, ...inputStyle }}
                />
                <Box mx={2}>
                  <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                </Box>
                <TextField
                  variant="standard"
                  {...endProps}
                  size={size}
                  label={LABEL.TO}
                  style={{ ...styles.input, ...inputStyle }}
                />
              </>
            )}
          />
          <Button
            onClick={() =>
              handleSubmit(
                dayjs(date.valueDateRange[0]).format(YYYY_MM_DD),
                dayjs(date.valueDateRange[1]).format(YYYY_MM_DD),
                "custom_date",
              )
            }
          >
            <ArrowForwardIcon />
          </Button>
        </div>
      ) : null}
    </div>
  );
};

const styles: TStyles<"wrapper" | "option" | "wrapPicker" | "input"> = {
  wrapper: { display: "flex", flexWrap: "wrap" },
  option: { fontSize: "0.82rem" },
  wrapPicker: { display: "flex", margin: 8 },
  input: { width: 100 },
};
