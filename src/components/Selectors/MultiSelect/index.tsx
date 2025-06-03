import { styled, SxProps, Theme } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import TextField, { BaseTextFieldProps } from "@mui/material/TextField";
import { NoDataPanel } from "components/NoDataPanel";
import { BUTTON } from "constants/button";
import { ALL_OPTION, ZINDEX_SYSTEM } from "constants/index";
import filter from "lodash/filter";
import find from "lodash/find";
import isEqual from "lodash/isEqual";
import join from "lodash/join";
import map from "lodash/map";
import reduce from "lodash/reduce";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { FieldError } from "react-hook-form";
import { TSelectOption } from "types/SelectOption";
import { TStyles } from "types/Styles";
import { isEnterPress } from "utils/keyBoard";
import { ArrowDropAdornment } from "./ArrowDropAdornment";
import { ClearAdornment } from "./ClearAdornment";
import { Option } from "./Option";
import { searchAlgorithm } from "utils/strings";

export type ValueSelectorType = "all" | (string | number)[] | string | number;

export const formatValueChangeMultiSelector = (value: ValueSelectorType) => {
  let formatValue: string | undefined | number | null | (string | number)[] = value;
  if (value === "all") {
    formatValue = undefined;
  } else if (value === "none") {
    formatValue = "null";
  }
  return formatValue;
};

// ---------------------------------------------------
export interface MultiSelectProps {
  options: TSelectOption[];
  title?: string;
  onChange?: (values: ValueSelectorType) => void;
  label?: string;
  simpleSelect?: boolean;
  value?: number | string | (string | number | object | null)[];
  outlined?: boolean;
  style?: React.CSSProperties;
  isShowLoading?: boolean;
  loadMoreData?: () => void;
  handleGetOptions?: (input: string) => void;
  fullWidth?: boolean;
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium";
  placeholder?: string;
  /** Used to get the width of the selector to set the width of the popover. */
  selectorId?: string;
  inputStyle?: React.CSSProperties;
  contentRender?: React.ReactNode;
  zIndex?: number;
  shrink?: boolean;
  autoFocus?: boolean;
  renderOptionTitleFunc?: ({
    idx,
    option,
    onClick,
  }: {
    option: TSelectOption;
    idx: number;
    onClick?: () => void;
  }) => React.ReactNode;
  inputProps?: BaseTextFieldProps;
  onAddOption?: (value: TSelectOption) => Promise<boolean>;
  optionSx?: SxProps<Theme>;
  getSxCondition?: (option: TSelectOption) => boolean;
}
export const MultiSelect = forwardRef(
  (props: MultiSelectProps, ref: React.ForwardedRef<unknown>) => {
    const {
      title,
      size = "small",
      options = [],
      onChange,
      onAddOption,
      value,
      simpleSelect,
      outlined,
      style,
      fullWidth,
      isShowLoading = false,
      autoFocus,
      error,
      shrink,
      handleGetOptions,
      loadMoreData,
      optionSx,
      disabled,
      required,
      selectorId,
      inputStyle,
      contentRender,
      zIndex = ZINDEX_SYSTEM.selector,
      getSxCondition,
      renderOptionTitleFunc,
      placeholder,
      inputProps,
    } = props;
    const isAllOption = options.find((item) => item.value === ALL_OPTION.value);

    const defaultOptions = useRef<TSelectOption[] | null>(null);
    let anchorRef = useRef<HTMLButtonElement>(null);
    const [selected, setSelected] = useState<TSelectOption[]>([]);
    const [preSelect, setPreSelect] = useState<TSelectOption[]>([]);
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState<any>("");
    const [loading, setLoading] = useState(isShowLoading);

    const dataSearch = useMemo(
      () =>
        filter(options, (option) => {
          return searchAlgorithm(option.label, input);
        }),
      [input, options],
    );

    const id = open ? "selector-popover" : undefined;

    const handleAddOption = async (option: TSelectOption) => {
      setLoading(true);
      await onAddOption?.(option);
      setLoading(false);
    };

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current!.focus();
      }
      prevOpen.current = open;
    }, [open]);

    useEffect(() => {
      const selected = reduce(
        options,
        (prev: TSelectOption[], cur) => {
          if (
            value?.toString()?.includes(cur.value.toString()) ||
            cur.value.toString().includes(value?.toString() || "undefined")
          )
            return [...prev, cur];
          return prev;
        },
        [],
      );
      setSelected(selected);
    }, [value, options]);

    //get preSelect from selected
    useEffect(() => {
      if (open) {
        const isFullOption = selected.find((option) => option.value === ALL_OPTION.value);
        if (isFullOption) {
          setPreSelect(options);
          defaultOptions.current = options;
        } else {
          setPreSelect(selected);
          defaultOptions.current = selected;
        }
      }
    }, [open, selected, options]);

    useEffect(() => {
      if (open) setInput("");
    }, [open]);

    const inputDefault = join(map(selected, (option) => option.label));
    useEffect(() => {
      if (!open && !input) {
        setInput(inputDefault);
      }
    }, [open, inputDefault, input]);

    const handleScroll = (e: any) => {
      const bottom =
        e.target.scrollHeight - Math.round(e.target.scrollTop) === e.target.clientHeight;
      if (bottom) {
        loadMoreData?.();
      }
    };

    const handleClose = (event: MouseEvent | TouchEvent) => {
      if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
        return;
      }
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    /**
     * Chức năng này xử lý việc lựa chọn nhiều tùy chọn và cập nhật trạng thái tương ứng.
     * @param option
     */
    const handleMultiChange = (option: { label: string; value: string | number }) => {
      if (option.value === "all") {
        //if option is all
        find(preSelect, (item) => item.value === option.value) //  check is is exist in state
          ? setPreSelect([]) //if true set state to empty array
          : setPreSelect(options); //if false set state = option
      } else {
        //if single option
        let result: TSelectOption[] = [];
        const isSelected = find(preSelect, (item) => item.value === option.value);
        // nếu option đã được chọn trước đó
        if (isSelected) {
          // if full state
          if (preSelect.length === options.length) {
            // remove option in state and option "all"
            result = filter(
              preSelect,
              (name) => name.value !== "all" && name.value !== option.value,
            );
          } else {
            //remove optoin in state
            result = filter(preSelect, (name) => name.value !== option.value);
          }
        } else {
          // option chưa được chọn trước đó
          if (preSelect.length === options.length - 2 && isAllOption) {
            //set state to full
            result = options;
            //else state not asymptotic full
          } else {
            // add option into state
            result = [...preSelect, option];
          }
        }
        //set state
        setPreSelect(result);
      }
    };

    const handleSimpleChange = (option: { label: string; value: string | number }) => {
      onChange?.(option.value);
      setInput(option.label);
      handleToggle();
    };

    const onSubmitMultiOptions = () => {
      if (isAllOption && (preSelect.length === options.length || preSelect.length === 0)) {
        const preSelectedIsAll = find(selected, (option) => option.value === "all");
        //if option is "all" and selected not all then update else not update
        if (!preSelectedIsAll) {
          onChange?.("all");
          setInput("");
        }
        //else option not "all"
      } else {
        // while popover close to selected get by value of preselect
        const formatOptions = map(preSelect, (option) => option.value);
        setInput(join(map(preSelect, (option) => option.label)));
        onChange?.(formatOptions);
      }
      handleToggle();
    };

    const onKeyPress = (event: any) => {
      if (isEnterPress(event)) {
        setOpen(true);
      }
    };

    const fullWidthSelector = selectorId && document.getElementById(selectorId)?.offsetWidth;

    return onChange ? (
      <ClickAwayListener onClickAway={handleClose}>
        <FormControl
          style={{
            width: fullWidth ? "100%" : undefined,
            ...styles.formControl,
            ...style,
          }}
          sx={{ ".MuiInputBase-root": { paddingRight: 0 } }}
          id={selectorId}
        >
          <TextField
            ref={ref as any}
            style={inputStyle}
            value={input}
            size={size}
            onClick={() => setOpen(true)}
            inputRef={anchorRef as any}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            label={title}
            autoFocus={autoFocus}
            InputProps={{
              endAdornment: loading ? (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              ) : open ? (
                <ClearAdornment onClear={() => setInput("")} />
              ) : (
                <ArrowDropAdornment />
              ),
              autoComplete: "off",
            }}
            sx={{ pointerEvents: disabled ? "none" : "auto" }}
            variant={outlined ? "outlined" : "standard"}
            onChange={(e) => {
              setInput(e.target.value);
              handleGetOptions?.(e.target.value);
            }}
            error={!!error?.message}
            helperText={error?.message}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            onKeyDown={onKeyPress}
            InputLabelProps={{ shrink }}
            {...inputProps}
          />
          <Popper
            id={id}
            open={open}
            transition
            anchorEl={anchorRef.current}
            placement="bottom-start"
            // disablePortal
            className="popper-selector"
            style={{
              width: fullWidth && fullWidthSelector ? fullWidthSelector : undefined,
              zIndex,
            }}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper elevation={3}>
                  <div style={styles.wrapPoperBody}>
                    {!simpleSelect && (
                      <Button
                        onClick={onSubmitMultiOptions}
                        style={styles["mutiSelectButton"]}
                        variant="contained"
                        disabled={isEqual(defaultOptions.current, preSelect)}
                      >
                        {BUTTON.SELECT}
                      </Button>
                    )}
                    {onAddOption && input.length > 0 && (
                      <Option
                        option={{ label: `${BUTTON.ADD} ${input}`, value: input }}
                        onChange={handleAddOption}
                        preSelect={preSelect}
                        simpleSelect={simpleSelect}
                        fullWidth={fullWidth}
                        style={styles.option}
                      />
                    )}
                    {contentRender}
                    <ListOptionWrap
                      onScroll={handleScroll}
                      sx={{ maxHeight: [400, 400, 300, 400, 400] }}
                    >
                      {dataSearch.length ? (
                        map(dataSearch, (option, index) => {
                          const isShowOptionSx = getSxCondition?.(option);
                          return (
                            <Option
                              key={option.label + option.value + index}
                              option={option}
                              onChange={simpleSelect ? handleSimpleChange : handleMultiChange}
                              preSelect={preSelect}
                              simpleSelect={simpleSelect}
                              fullWidth={fullWidth}
                              renderOptionTitle={({ onClick }) =>
                                renderOptionTitleFunc?.({ option, idx: index, onClick })
                              }
                              sx={isShowOptionSx ? optionSx : undefined}
                            />
                          );
                        })
                      ) : (
                        <NoDataPanel />
                      )}
                    </ListOptionWrap>
                  </div>
                </Paper>
              </Fade>
            )}
          </Popper>
        </FormControl>
      </ClickAwayListener>
    ) : null;
  },
);

const ListOptionWrap = styled(List)({
  maxHeight: 300,
  minWidth: 150,
  overflowY: "auto",
});

const styles: TStyles<
  "mutiSelectButton" | "wrapPoperBody" | "formControl" | "option" | "filterLabel"
> = {
  formControl: { minWidth: 150 },
  option: { marginTop: 8, backgroundColor: "#2196f3" },
  mutiSelectButton: {
    cursor: "pointer",
    width: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  wrapPoperBody: { width: "100%" },
  filterLabel: { fontSize: "0.825rem", paddingLeft: 4, paddingRight: 4, borderRadius: 3 },
};
