import DeleteIcon from "@mui/icons-material/Delete";
import { alpha, styled } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { MDatePicker, MDatetimePicker } from "components/Pickers";
import { PIVOT_LABEL } from "constants/pivot/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { useMemo, useRef, useState } from "react";
import { isEnterPress } from "utils/keyBoard";
import { Conjunction, Mode, Operator } from "../AbstractFilterItem";
import {
  AirTableColumnIcons,
  AirTableConjunctionLabel,
  AirTableModeLabels,
  AirTableOperatorLabels,
  MAP_OPERATOR_WITH_COLUMN_TYPE,
} from "../constants";
import { AirTableColumn, AirTableColumnTypes } from "../types";
import ComplexSelect from "./ComplexSelect";
import TextLink from "./TextLink";

interface Props {
  id: string;
  filterItemIndex: number;
  columns: AirTableColumn[];
  columnsObject: { [key: string]: AirTableColumn };
  conjunction: Conjunction;
  columnId?: AirTableColumn["id"];
  operator?: Operator;
  value?: any;
  onChange: (name: string, key: string) => (value: any) => void;
  onDelete: (id: string) => void;
}

const ConditionComponent = (props: Props) => {
  const {
    id,
    filterItemIndex,
    columns,
    columnsObject,
    conjunction,
    columnId,
    operator,
    value,
    onChange,
    onDelete,
  } = props;
  const { users } = useAppSelector(getDraftSafeSelector("users"));
  const inputRef = useRef<any>();
  const inputRefMax = useRef<any>();
  const [_temp, setTemp] = useState<any>();

  const columnType = useMemo(() => {
    return columns.find((column) => column.id === columnId)?.type;
  }, [columnId, columns]);

  const columnKey = useMemo(() => {
    return columns.find((column) => column.id === columnId)?.key || "";
  }, [columnId, columns]);

  const operators = useMemo(() => {
    return (
      (columnType &&
        Object.keys(Operator).filter((operatorKey: unknown) => {
          const key = operatorKey as keyof typeof Operator;
          return MAP_OPERATOR_WITH_COLUMN_TYPE[Operator[key]].includes(columnType);
        })) ||
      []
    );
  }, [columnType]);

  const renderValueComponent = () => {
    if (
      !columnsObject ||
      !columnId ||
      operator === Operator.IS_EMPTY ||
      operator === Operator.IS_NOT_EMPTY
    )
      return null;

    let tempValue: any = {
      mode:
        value?.mode ||
        (operator === Operator.IS_WITHIN ? Mode.THE_PAST_NUMBER_OF_DAYS : Mode.EXACT_DATE),
      value: value?.value,
    };

    switch (operator) {
      case Operator.CONTAINS:
      case Operator.DOES_NOT_CONSTAINS:
      case Operator.EQUAL:
      case Operator.NOT_EQUAL:
      case Operator.GREATER:
      case Operator.GREATER_OR_EQUAL:
      case Operator.SMALLER:
      case Operator.SMALLER_OR_EQUAL:
        return (
          <OutlinedInputStyled
            key={operator}
            inputRef={inputRef}
            defaultValue={value}
            onBlur={() => {
              inputRef.current?.value !== value &&
                onChange("value", columnKey)(inputRef.current?.value);
            }}
            onKeyUp={(event: any) => {
              if (isEnterPress(event)) {
                inputRef?.current?.value !== value &&
                  onChange("value", columnKey)(inputRef?.current?.value);
              }
            }}
            placeholder={PIVOT_LABEL.enter_value}
          />
        );
      case Operator.IS_BETWEEN:
      case Operator.IS_EXCEPT:
        return (
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
            }}
          >
            <OutlinedInputStyled
              inputRef={inputRef}
              defaultValue={value}
              onBlur={() => {
                inputRef.current?.value !== value &&
                  onChange("value", columnKey)({ ...value, min: inputRef.current?.value });
              }}
              onKeyUp={(event: any) => {
                if (isEnterPress(event)) {
                  inputRef?.current?.value !== value &&
                    onChange("value", columnKey)({ ...value, min: inputRef.current?.value });
                }
              }}
              placeholder={PIVOT_LABEL.enter_min_value}
            />
            <OutlinedInputStyled
              inputRef={inputRefMax}
              defaultValue={value}
              onBlur={() => {
                inputRefMax.current?.value !== value &&
                  onChange("value", columnKey)({ ...value, max: inputRefMax.current?.value });
              }}
              onKeyUp={(event: any) => {
                if (isEnterPress(event)) {
                  inputRefMax?.current?.value !== value &&
                    onChange("value", columnKey)({ ...value, max: inputRefMax.current?.value });
                }
              }}
              placeholder={PIVOT_LABEL.enter_max_value}
            />
          </Stack>
        );
      case Operator.IS:
      case Operator.IS_NOT:
        if (
          [AirTableColumnTypes.SINGLE_SELECT, AirTableColumnTypes.SINGLE_USER].includes(
            columnsObject[columnId]?.type,
          )
        ) {
          return (
            <ComplexSelect
              id={id}
              options={
                columnsObject[columnId]?.type === AirTableColumnTypes.SINGLE_USER
                  ? users
                  : columnsObject[columnId].options?.choices || []
              }
              defaultValue={value}
              onChange={onChange("value", columnKey)}
              sx={{
                width: 180,
                p: "6px 16px 6px 12px",
                fieldset: {
                  borderColor: "initial",
                },
                svg: {
                  fontSize: "1.5rem",
                },
              }}
            />
          );
        }

        if (
          columnsObject[columnId]?.type === AirTableColumnTypes.DATE ||
          columnsObject[columnId]?.type === AirTableColumnTypes.DATETIME
        ) {
          const modes = Object.keys(Mode).slice(0, 8);
          return (
            <Stack direction="row" spacing={1} alignItems={"center"}>
              <SelectStyled
                value={tempValue?.mode}
                onChange={(e) =>
                  onChange("value", columnKey)({ ...tempValue, mode: e.target.value })
                }
                input={
                  <OutlinedInputStyled
                    sx={{
                      minWidth: `80px!important`,
                      width: 160,
                    }}
                  />
                }
              >
                {modes.map((key: unknown, idx) => {
                  const itemKey = key as keyof typeof Mode;
                  return (
                    <MenuItem value={Mode[itemKey]} key={idx}>
                      <ItemText>{AirTableModeLabels[Mode[itemKey]]}</ItemText>
                    </MenuItem>
                  );
                })}
              </SelectStyled>
              {tempValue?.mode === Mode.EXACT_DATE && (
                <>
                  {columnsObject[columnId]?.type === AirTableColumnTypes.DATE && (
                    <MDatePickerStyled
                      value={tempValue?.value || null}
                      onChange={(date) => {
                        setTemp(date);
                      }}
                      inputRef={inputRef}
                      onAccept={(date) => {
                        onChange(
                          "value",
                          columnKey,
                        )({
                          mode: tempValue.mode,
                          value: date ? new Date(date).toISOString() : "",
                        });
                      }}
                    />
                  )}
                  {columnsObject[columnId]?.type === AirTableColumnTypes.DATETIME && (
                    <MDatetimePicker
                      value={tempValue?.value || null}
                      onChange={(date) => {
                        setTemp(date);
                      }}
                      inputRef={inputRef}
                      onAccept={(date) => {
                        onChange(
                          "value",
                          columnKey,
                        )({
                          mode: tempValue.mode,
                          value: date ? new Date(date).toISOString() : "",
                        });
                      }}
                    />
                  )}
                </>
              )}
              {[Mode.NUMBER_OF_DAYS_AGO, Mode.THE_PAST_NUMBER_OF_DAYS].includes(tempValue.mode) && (
                <OutlinedInputStyled
                  inputRef={inputRef}
                  defaultValue={tempValue?.value}
                  onBlur={() => {
                    inputRef.current?.value !== tempValue?.value &&
                      onChange(
                        "value",
                        columnKey,
                      )({ mode: tempValue.mode, value: inputRef.current?.value });
                  }}
                  onKeyUp={(event: any) => {
                    if (isEnterPress(event)) {
                      inputRef?.current?.value !== value?.value &&
                        onChange(
                          "value",
                          columnKey,
                        )({ mode: tempValue.mode, value: inputRef?.current?.value });
                    }
                  }}
                  placeholder={PIVOT_LABEL.enter_value}
                />
              )}
            </Stack>
          );
        }

        if (columnsObject[columnId]?.type === AirTableColumnTypes.CHECKBOX) {
          return (
            <Checkbox
              checked={!!value}
              onChange={(e) => onChange("value", columnKey)(e.target.checked)}
              // inputProps={{ "aria-label": "controlled" }}
            />
          );
        }
        if (columnsObject[columnId]?.type === AirTableColumnTypes.SINGLE_SELECT) {
          return (
            <ComplexSelect
              id={id}
              options={
                columnsObject[columnId]?.type === AirTableColumnTypes.SINGLE_USER
                  ? users
                  : columnsObject[columnId].options?.choices || []
              }
              defaultValue={value}
              onChange={onChange("value", columnKey)}
              sx={{
                width: 180,
                p: "6px 16px 6px 12px",
                fieldset: {
                  borderColor: "initial",
                },
                svg: {
                  fontSize: "1.5rem",
                },
              }}
            />
          );
        }
        return (
          <OutlinedInputStyled
            inputRef={inputRef}
            defaultValue={value}
            onBlur={() => {
              inputRef.current?.value !== value &&
                onChange("value", columnKey)(inputRef.current?.value);
            }}
            onKeyUp={(event: any) => {
              if (isEnterPress(event)) {
                inputRef?.current?.value !== value &&
                  onChange("value", columnKey)(inputRef?.current?.value);
              }
            }}
            placeholder={PIVOT_LABEL.enter_value}
          />
        );

      case Operator.IS_EXACTLY:
      case Operator.IS_ANY_OF:
      case Operator.IS_NONE_OF:
      case Operator.HAS_ANY_OF:
      case Operator.HAS_ALL_OF:
      case Operator.HAS_NONE_OF:
        return (
          <ComplexSelect
            id={id}
            options={
              columnsObject[columnId]?.type === AirTableColumnTypes.MULTIPLE_USER ||
              columnsObject[columnId]?.type === AirTableColumnTypes.SINGLE_USER
                ? users
                : columnsObject[columnId].options?.choices || []
            }
            defaultValue={Array.isArray(value) ? value : []}
            onChange={onChange("value", columnKey)}
            sx={{
              width: 180,
              p: "6px 16px 6px 12px",

              fieldset: {
                borderColor: "initial",
              },
              svg: {
                fontSize: "1.5rem",
              },
            }}
            multiple
          />
        );

      // case Operator.IS_BEFORE:
      // case Operator.IS_AFTER:
      // case Operator.IS_ON_OR_BEFORE:
      // case Operator.IS_ON_OR_AFTER:
      //   if (columnsObject[columnId]?.type === AirTableColumnTypes.DATE) {
      //     return (
      //       <DatePicker
      //         value={value || null}
      //         onChange={(date) => {
      //           setTemp(date);
      //         }}
      //         renderInput={(params) => (
      //           <TextFieldStyled
      //             {...params}
      //             onKeyUp={(event: any) => {
      //               if (isEnterPress(event) && temp && dateIsValid(temp)) {
      //                 onChange("value")(new Date(temp).toISOString());
      //               }
      //             }}
      //           />
      //         )}
      //         inputRef={inputRef}
      //         onAccept={(date) => {
      //           onChange("value")(date ? new Date(date).toISOString() : "");
      //         }}
      //       />
      //     );
      //   }
      //   if (columnsObject[columnId]?.type === AirTableColumnTypes.DATETIME) {
      //     return (
      //       <DateTimePicker
      //         value={value || null}
      //         onChange={(date) => {
      //           setTemp(date);
      //         }}
      //         renderInput={(params) => (
      //           <TextFieldStyled
      //             {...params}
      //             onKeyUp={(event: any) => {
      //               if (isEnterPress(event) && temp && dateIsValid(temp)) {
      //                 onChange(new Date(temp).toISOString());
      //               }
      //             }}
      //           />
      //         )}
      //         inputRef={inputRef}
      //         onAccept={(date) => {
      //           onChange(date ? new Date(date).toISOString() : "");
      //         }}
      //       />
      //     );
      //   }

      case Operator.IS_BEFORE:
      case Operator.IS_AFTER:
      case Operator.IS_ON_OR_BEFORE:
      case Operator.IS_ON_OR_AFTER:
      case Operator.IS_WITHIN:
        const modes: Mode[] =
          operator !== Operator.IS_WITHIN
            ? (Object.keys(Mode).slice(0, 8) as Mode[])
            : (Object.keys(Mode).slice(8, Object.keys(Mode).length) as Mode[]);

        return (
          <Stack direction="row" spacing={1} alignItems={"center"}>
            <SelectStyled
              value={tempValue?.mode}
              onChange={(e) => onChange("value", columnKey)({ ...tempValue, mode: e.target.value })}
              input={
                <OutlinedInputStyled
                  sx={{
                    minWidth: `100px!important`,
                    width: 100,
                  }}
                />
              }
            >
              {modes.map((key: unknown, idx) => {
                const itemKey = key as keyof typeof Mode;
                return (
                  <MenuItem value={Mode[itemKey]} key={idx}>
                    <ItemText>{AirTableModeLabels[Mode[itemKey]]}</ItemText>
                  </MenuItem>
                );
              })}
            </SelectStyled>
            {tempValue?.mode === Mode.EXACT_DATE && (
              <>
                {columnsObject[columnId]?.type === AirTableColumnTypes.DATE && (
                  <MDatePickerStyled
                    value={tempValue?.value || null}
                    onChange={(date) => {
                      setTemp(date);
                    }}
                    inputRef={inputRef}
                    onAccept={(date) => {
                      onChange(
                        "value",
                        columnKey,
                      )({
                        mode: tempValue.mode,
                        value: date ? new Date(date).toISOString() : "",
                      });
                    }}
                  />
                )}
                {columnsObject[columnId]?.type === AirTableColumnTypes.DATETIME && (
                  <MDatetimePicker
                    value={tempValue?.value || null}
                    onChange={(date) => {
                      setTemp(date);
                    }}
                    inputRef={inputRef}
                    onAccept={(date) => {
                      onChange(
                        "value",
                        columnKey,
                      )({
                        mode: tempValue.mode,
                        value: date ? new Date(date).toISOString() : "",
                      });
                    }}
                  />
                )}
              </>
            )}
            {[Mode.NUMBER_OF_DAYS_AGO, Mode.THE_PAST_NUMBER_OF_DAYS].includes(tempValue.mode) && (
              <OutlinedInputStyled
                inputRef={inputRef}
                defaultValue={tempValue?.value}
                onBlur={() => {
                  inputRef.current?.value !== tempValue?.value &&
                    onChange(
                      "value",
                      columnKey,
                    )({ mode: tempValue.mode, value: inputRef.current?.value });
                }}
                onKeyUp={(event: any) => {
                  if (isEnterPress(event)) {
                    inputRef?.current?.value !== value?.value &&
                      onChange(
                        "value",
                        columnKey,
                      )({ mode: tempValue.mode, value: inputRef?.current?.value });
                  }
                }}
                placeholder={PIVOT_LABEL.enter_value}
              />
            )}
          </Stack>
        );

      default:
        return null;
    }
  };

  const handleChangeColumn = (value: unknown) => {
    const columnKey = columns.find((column) => column.id === value)?.key || "";
    onChange("columnId", columnKey)(value);
  };

  return (
    <TableRow sx={{ td: { px: 0.5, py: 1 } }}>
      <TableCell>
        {filterItemIndex === 0 ? (
          <SelectStyled
            value={conjunction}
            onChange={(e) => {
              onChange("conjunction", columnKey)(e.target.value);
            }}
            input={
              <OutlinedInputStyled
                sx={{
                  minWidth: `80px!important`,
                  width: 80,
                }}
              />
            }
          >
            <MenuItem value={Conjunction.AND}>
              <ItemText>{AirTableConjunctionLabel[Conjunction.AND]}</ItemText>
            </MenuItem>
            <MenuItem value={Conjunction.OR}>
              <ItemText>{AirTableConjunctionLabel[Conjunction.OR]}</ItemText>
            </MenuItem>
          </SelectStyled>
        ) : (
          <TextLink content={AirTableConjunctionLabel[conjunction]} sx={{ pl: 1 }} />
        )}
      </TableCell>
      <TableCell>
        <SelectStyled
          value={columnId}
          onChange={(e) => handleChangeColumn(e.target.value)}
          input={<OutlinedInputStyled />}
        >
          {columns.map((column) => (
            <MenuItem key={column.id} value={column.id}>
              <ItemIcon>{AirTableColumnIcons[column.type]}</ItemIcon>
              <ItemText>{column.name}</ItemText>
            </MenuItem>
          ))}
        </SelectStyled>
      </TableCell>
      <TableCell>
        <SelectStyled
          value={operator}
          onChange={(e) => {
            onChange("operator", columnKey)(e.target.value);
            onChange("value", columnKey)(null);
          }}
          input={<OutlinedInputStyled />}
          sx={{ minWidth: 120, width: 120 }}
        >
          {operators.map((operatorKey: unknown) => {
            const key = operatorKey as keyof typeof Operator;
            return (
              <MenuItem key={key} value={Operator[key]}>
                <ItemText>{AirTableOperatorLabels[Operator[key]]}</ItemText>
              </MenuItem>
            );
          })}
        </SelectStyled>
      </TableCell>
      <TableCell>{renderValueComponent()}</TableCell>

      <TableCell>
        <ButtonStyled onClick={() => onDelete(id)}>
          <DeleteIcon />
        </ButtonStyled>
      </TableCell>
    </TableRow>
  );
};

export default ConditionComponent;

const SelectStyled = styled(Select)(() => ({
  minWidth: 200,
  fontSize: "0.82rem",
  height: "fit-content",
  ".MuiSelect-select": {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
  },
}));

const OutlinedInputStyled = styled(OutlinedInput)(() => ({
  width: 200,
  ".MuiOutlinedInput-input": {
    padding: "6px 12px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

const ItemText = styled(ListItemText)(() => ({
  ".MuiTypography-root": {
    fontSize: "0.82rem",
    fontWeight: 500,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

const ItemIcon = styled(ListItemIcon)(() => ({
  "&.MuiListItemIcon-root": {
    minWidth: "24px!important",
    marginRight: "4px",
  },

  ".MuiSvgIcon-root": { fontSize: "1rem" },
}));

const ButtonStyled = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  ".MuiSvgIcon-root": { fontSize: "1rem", color: theme.palette.primary.main },
}));

const MDatePickerStyled = styled(MDatePicker)(() => ({
  input: {
    padding: "6px 20px",
  },
}));
