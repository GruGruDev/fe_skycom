import React from "react";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { toSimplest } from "utils/strings";
import { LABEL } from "constants/label";

export interface SliderFieldProps {
  slides: number[];
  onSubmit: (slides: number[]) => void;
  inputFormatFunc?: (value: number) => number | string;
  sliderFormatFunc?: (value: number) => string;
  title: string;
  rangeSliceArr: { label: string; value: number }[];
  style?: React.CSSProperties;
}

const SliderField = ({
  slides,
  onSubmit,
  inputFormatFunc,
  sliderFormatFunc,
  title,
  rangeSliceArr,
  style,
}: SliderFieldProps) => {
  return (
    <Box style={style}>
      <Stack direction="row" alignItems="center">
        <Typography fontSize={14}>{title}</Typography>
        <Stack direction="row" alignItems="center" mx={2}>
          <TextField
            variant="outlined"
            size="small"
            label={LABEL.FROM}
            style={textFieldStyle}
            inputProps={{ min: rangeSliceArr[0].value.toString() }}
            value={inputFormatFunc ? inputFormatFunc(slides[0]) : slides[0]}
            onChange={(e) => {
              const value = toSimplest(e.target.value.toString());
              (parseInt(value) || value === "") && onSubmit([parseInt(value), slides[1]]);
            }}
          />
          <Box mx={1}>
            <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
          </Box>
          <TextField
            variant="outlined"
            size="small"
            label={LABEL.TO}
            style={textFieldStyle}
            inputProps={{
              max: rangeSliceArr[rangeSliceArr.length - 1].value.toString(),
            }}
            value={inputFormatFunc ? inputFormatFunc(slides[1]) : slides[1]}
            onChange={(e) => {
              const value = toSimplest(e.target.value.toString());
              (parseInt(value) || value === "") && onSubmit([slides[0], parseInt(value)]);
            }}
          />
        </Stack>
      </Stack>
      <Slider
        value={slides}
        onChange={(_, value: number[] | number) => onSubmit(value as number[])}
        getAriaValueText={sliderFormatFunc}
        valueLabelFormat={sliderFormatFunc}
        valueLabelDisplay="auto"
        marks={rangeSliceArr}
        min={rangeSliceArr[0].value}
        max={rangeSliceArr[rangeSliceArr.length - 1].value}
      />
    </Box>
  );
};

export default SliderField;

const textFieldStyle = { width: 125 };
