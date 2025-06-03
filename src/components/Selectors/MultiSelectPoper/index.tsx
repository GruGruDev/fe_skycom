import { styled } from "@mui/material";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { NoDataPanel } from "components/NoDataPanel";
import { BUTTON } from "constants/button";
import { ALL_OPTION } from "constants/index";
import filter from "lodash/filter";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import includes from "lodash/includes";
import isBoolean from "lodash/isBoolean";
import isEqual from "lodash/isEqual";
import join from "lodash/join";
import map from "lodash/map";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { TSelectOption } from "types/SelectOption";
import { TStyles } from "types/Styles";
import { toSimplest } from "utils/strings";
import { Option } from "./Option";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// ---------------------------------------------------
export interface MultiSelectPoperProps {
  options: TSelectOption[];
  title?: string;
  onChange?: (values: any) => void;
  label?: string;
  simpleSelect?: boolean;
  value?: number | string | (string | number | object | null)[];
  isShowLoading?: boolean;
  loadMoreData?: () => void;
  fullWidth?: boolean;
  /** Used to get the width of the selector to set the width of the popover. */
  selectorId?: string;
  style?: React.CSSProperties;
  contentRender?: React.ReactNode;
  zIndex?: number;
  badgeContent?: number;
  renderOptionTitleFunc?: ({
    idx,
    option,
    onClick,
  }: {
    option: TSelectOption;
    idx: number;
    onClick?: () => void;
  }) => React.ReactNode;
  isAllOption?: boolean;
  onAddOption?: (value: TSelectOption) => Promise<boolean>;
}
const MultiSelectPoper = forwardRef(
  (props: MultiSelectPoperProps, ref: React.ForwardedRef<unknown>) => {
    const {
      title,
      options,
      onChange,
      onAddOption,
      value,
      simpleSelect,
      fullWidth,
      loadMoreData,
      selectorId,
      style,
      contentRender,
      badgeContent = 0,
      zIndex = 1301,
      renderOptionTitleFunc,
      isAllOption = true,
    } = props;
    const defaultOptions = useRef<TSelectOption[] | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | MouseEvent | null>(null);
    const [selected, setSelected] = useState<TSelectOption[]>([]);
    const [preSelect, setPreSelect] = useState<TSelectOption[]>([]);
    const [searchOption, setSearchOption] = useState<TSelectOption[]>([]);
    const [input, setInput] = useState<any>("");
    const [loading, setLoading] = useState(false);
    const firstOption = options[0]; //is all value

    const handleAddOption = async (option: TSelectOption) => {
      setLoading(true);
      await onAddOption?.(option);
      setLoading(false);
    };

    useEffect(() => {
      const fullSearchOptions = map(options, (item) => {
        const isExist = findIndex(
          preSelect,
          (prev) => prev.value?.toString() === item.value?.toString(),
        );
        if (isExist >= 0) {
          return preSelect[isExist];
        }
        return item;
      });
      const dataSearch =
        input !== join(map(selected, (option) => option.label))
          ? filter(fullSearchOptions, (option) => {
              return includes(toSimplest(option.label), toSimplest(input));
            })
          : options;
      setSearchOption(dataSearch);
    }, [input, options, selected, preSelect]);

    useEffect(() => {
      setInput(join(map(selected, (option) => option.label)));
    }, [selected]);

    /* Nó kiểm tra xem chỗ dựa `value` là trung thực hay không boolean, 
  và nếu vậy, nó lọc mảng `options` để tìm (các) giá trị mặc định và đặt trạng thái `đã chọn` thành (các) giá trị mặc định được tìm thấy. 
  Nếu prop `value` là một mảng và bao gồm tất cả các tùy chọn ngoại trừ một tùy chọn, 
  nó sẽ thêm một đối tượng "ALL_OPTION" vào mảng `findDefault`.*/
    useEffect(() => {
      if (value || value === 0 || value === "" || isBoolean(value)) {
        let findDefault = [];
        if (Array.isArray(value)) {
          findDefault = options.filter((option) => value.includes(option.value));
          if (value.length === options.length - 1) {
            findDefault = isAllOption ? [...options, ALL_OPTION] : findDefault;
          }
        } else {
          findDefault = options.filter((option) => option?.value?.toString() === value.toString());
        }

        if (findDefault) {
          setSelected(findDefault);
        }
      }
      // run one time while mount search input
    }, [value, options, isAllOption]);

    //get preSelect from selected
    useEffect(() => {
      if (!!anchorEl) {
        if (simpleSelect) {
          setPreSelect(selected);
          defaultOptions.current = selected;
        } else {
          const isFullOption = selected.find((option) => option.value === "all");
          if (isFullOption) {
            setPreSelect(options);
            defaultOptions.current = options;
          } else {
            setPreSelect(selected);
            defaultOptions.current = selected;
          }
        }
      } else {
        setInput(join(map(selected, (option) => option.label)));
      }
    }, [anchorEl, options, selected, simpleSelect]);

    const handleScroll = (e: any) => {
      const bottom =
        e.target.scrollHeight - Math.round(e.target.scrollTop) === e.target.clientHeight;
      if (bottom) {
        loadMoreData && loadMoreData();
      }
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      setAnchorEl(event.currentTarget);
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
      //set selected state = option
      setSelected([option]);
      selected.length > 0
        ? option.value !== selected[0].value && onChange?.(option.value) //if option is new
        : onChange?.(option.value); //else option is old

      setAnchorEl(null);
    };

    //for multi selector
    const onSubmit = () => {
      //default select all
      if (isAllOption && (preSelect.length === options.length || preSelect.length === 0)) {
        const preSelectedIsAll = find(selected, (option) => option.value === "all");
        //if option is "all" and selected not all then update else not update
        if (!preSelectedIsAll) {
          onChange?.("all");
          setSelected([firstOption]);
        }
        //else option not "all"
      } else {
        // while popover close to selected get by value of preselect
        setSelected(preSelect);
        const formatOptions = map(preSelect, (option) => option.value);
        setInput(join(map(selected, (option) => option.label)));
        onChange?.(formatOptions);
      }
      setAnchorEl(null);
    };

    useEffect(() => {
      setLoading(loading);
    }, [loading]);

    const fullWidthSelector = selectorId && document.getElementById(selectorId)?.offsetWidth;

    return onChange ? (
      <ClickAwayListener onClickAway={handleClose}>
        <FormControl
          style={{
            width: fullWidth ? "100%" : undefined,
            ...style,
          }}
          sx={{ ".MuiInputBase-root": { paddingRight: 0 } }}
          id={selectorId}
        >
          <Badge badgeContent={value === "all" ? 0 : badgeContent} color="error">
            <Stack
              direction={"row"}
              alignItems="center"
              sx={{
                backgroundColor: (theme) =>
                  value === "all"
                    ? theme.palette.divider
                    : badgeContent
                      ? theme.palette.info.main
                      : theme.palette.divider,
              }}
            >
              <Typography style={styles.filterLabel} onClick={handleClick} ref={ref as any}>
                {title}
              </Typography>
              <ArrowDropDownIcon />
            </Stack>
          </Badge>
          <Popover
            onClose={handleClose}
            id={"popover-filter"}
            open={!!anchorEl}
            anchorEl={anchorEl as any}
            // disablePortal
            className="popper-selector"
            style={{
              width: fullWidth && fullWidthSelector ? fullWidthSelector : undefined,
              zIndex,
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Paper elevation={3}>
              <div style={styles.wrapPoperBody}>
                {!simpleSelect && (
                  <Button
                    onClick={onSubmit}
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
                  {searchOption.length ? (
                    map(searchOption, (option, index) => {
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
                        />
                      );
                    })
                  ) : (
                    <NoDataPanel />
                  )}
                </ListOptionWrap>
              </div>
            </Paper>
          </Popover>
        </FormControl>
      </ClickAwayListener>
    ) : null;
  },
);

export default MultiSelectPoper;

const ListOptionWrap = styled(List)({
  maxHeight: 300,
  minWidth: 150,
  overflowY: "auto",
});

const styles: TStyles<"mutiSelectButton" | "wrapPoperBody" | "option" | "filterLabel"> = {
  option: { marginTop: 8, backgroundColor: "#2196f3" },
  mutiSelectButton: {
    cursor: "pointer",
    width: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  wrapPoperBody: { width: "100%" },
  filterLabel: {
    fontSize: "0.825rem",
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 3,
  },
};
