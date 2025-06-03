import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { LABEL } from "constants/label";
import { toSimplest } from "utils/strings";

export interface SliderProps {
  slide?: number[];
  setSliceValue: (value: number[]) => void;
  inputFormatFunc?: (value: number) => number | string;
  sliderFormatFunc?: (value: number) => string;
  title: string;
  rangeSliceArr: { label: string; value: number }[];
  step?: number;
}

const SliderFilter = ({
  slide = [],
  step = 10,
  setSliceValue = () => {},
  inputFormatFunc,
  sliderFormatFunc,
  title,
  rangeSliceArr = [],
}: Partial<SliderProps>) => {
  const minRange = rangeSliceArr?.[0]?.value || 0;
  const maxRange = rangeSliceArr?.[rangeSliceArr.length - 1]?.value || 0;

  const onChangeMaxInput = (value: string) => {
    const input = toSimplest(value);
    const minValue = slide?.[0] || minRange;

    parseInt(input) >= minValue && setSliceValue([minValue, parseInt(input)]);
  };

  const onChangeMinInput = (value: string) => {
    const input = toSimplest(value);
    const maxValue = slide?.[1] || maxRange;

    parseInt(input) <= maxValue && setSliceValue([parseInt(input), maxValue]);
  };

  return (
    <Box p={2}>
      <Stack direction="row" alignItems="center">
        <Typography fontSize={14}>{title}</Typography>
        <Stack direction="row" alignItems="center" mx={2}>
          <TextField
            variant="outlined"
            size="small"
            label={LABEL.FROM}
            style={textFieldStyle}
            inputProps={{ min: minRange }}
            value={inputFormatFunc ? inputFormatFunc(slide[0]) : slide?.[0]}
            onChange={(e) => onChangeMinInput(e.target.value)}
          />
          <Box mx={1}>
            <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
          </Box>
          <TextField
            variant="outlined"
            size="small"
            label={LABEL.TO}
            style={textFieldStyle}
            inputProps={{ max: maxRange.toString() }}
            value={inputFormatFunc ? inputFormatFunc(slide?.[1]) : slide?.[1]}
            onChange={(e) => onChangeMaxInput(e.target.value)}
          />
        </Stack>
      </Stack>
      <Slider
        defaultValue={slide}
        onChangeCommitted={(_, value) => setSliceValue(value as number[])}
        getAriaValueText={sliderFormatFunc}
        valueLabelFormat={sliderFormatFunc}
        valueLabelDisplay="auto"
        marks={rangeSliceArr}
        min={minRange}
        max={maxRange}
        step={step}
      />
    </Box>
  );
};

export default SliderFilter;

const textFieldStyle = { width: 125 };
