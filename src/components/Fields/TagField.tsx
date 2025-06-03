import Grid from "@mui/material/Grid";
import FormHelperText from "@mui/material/FormHelperText";
import TextField, { BaseTextFieldProps } from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import map from "lodash/map";
import React, { memo, useEffect, useState } from "react";
import { TAttribute } from "types/Attribute";
import { TStyles } from "types/Styles";
import { BUTTON } from "constants/button";

const filter = createFilterOptions<TAttribute>();

/**
 * @param returnType - Kiểu dữ liệu muốn trả về
 * @type {"id" | "name" | "origin"}
 * @returns
 */
export const TagField = memo(
  ({
    value = null,
    disabled,
    loading,
    onSubmit,
    label,
    options,
    placeholder,
    returnType = "origin",
    helperText,
    size,
    inputStyle,
    onCreateTag,
    onChangeDefault,
    inputProps,
  }: {
    value?: TAttribute[] | string[] | null;
    disabled?: boolean;
    loading?: boolean;
    onSubmit?: (tags: (string | number | TAttribute)[]) => void;
    label?: string;
    placeholder?: string;
    options: TAttribute[];
    returnType?: "id" | "name" | "origin";
    helperText?: string;
    inputStyle?: React.CSSProperties;
    size?: "small" | "medium";
    onCreateTag?: (tag: TAttribute) => Promise<TAttribute | null>;
    inputProps?: BaseTextFieldProps;
    onChangeDefault?: (batch: { id: string; value: boolean; index: number }) => void;
  }) => {
    const [tags, setTags] = useState<TAttribute[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
      if (typeof value?.[0] === "object" || returnType === "origin") {
        setTags(value as TAttribute[]);
      } else {
        const valueClone = value as (string | number)[];
        const convertDefaultOptions = valueClone
          ? options.filter((item) => valueClone?.includes(item[returnType || "name"] || ""))
          : [];

        setTags(convertDefaultOptions);
      }
    }, [options, value, returnType]);

    const handleChangeTags = async (
      _event: React.SyntheticEvent<Element, Event>,
      tagsParams: TAttribute[],
    ) => {
      const [lastTag, ...selectedTags] = tagsParams.reverse();

      //is new tag
      if (lastTag?.inputValue) {
        if (onCreateTag) {
          const resNewTag = await onCreateTag(lastTag);
          if (resNewTag) {
            const newTags: TAttribute[] = [...selectedTags.reverse(), resNewTag];
            setTags(newTags);
            returnType === "name" &&
              onSubmit?.(map(newTags, (item) => item.name?.toString() || ""));
            returnType === "id" && onSubmit?.(map(newTags, (item) => item.id || ""));
            returnType === "origin" && onSubmit?.(newTags);
          }
        }
      } else {
        if (onSubmit) {
          setTags(tagsParams);
          returnType === "name" && onSubmit(map(tagsParams, (item) => item.name?.toString() || ""));
          returnType === "id" && onSubmit(map(tagsParams, (item) => item.id || ""));
          returnType === "origin" && onSubmit(tagsParams);
        }
      }
    };

    const filterTags = ({ id }: { id: string | number; inputValue?: string }) => {
      const result = tags?.filter((tag) => tag?.id !== id);
      setTags(result);
      returnType === "id" && onSubmit?.(map(result, (item) => item?.id || "") || []);
      returnType === "name" && onSubmit?.(map(result, (item) => item.name?.toString() || "") || []);
      returnType === "origin" && onSubmit?.(result || []);
    };

    return (
      <>
        <Grid item xs={12} className="grid-layout-tag-input" style={inputStyle}>
          <Autocomplete
            id="asynchronous-demo"
            disabled={disabled}
            open={open}
            value={tags}
            size={size}
            fullWidth
            filterOptions={(options, params) => {
              const filtered = filter(options, params) as TAttribute[];

              const { inputValue } = params;

              // Suggest the creation of a new value
              const isExisting = options.some((option) => inputValue === option.name);
              if (inputValue !== "" && !isExisting && onCreateTag) {
                filtered.push({
                  name: params.inputValue,
                  inputValue: `${BUTTON.ADD} "${params.inputValue}"`,
                });
              }

              return filtered;
            }}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) =>
              option?.id?.toString() === value?.id?.toString()
            }
            getOptionLabel={(option) => {
              // e.g value selected with enter, right from the input
              if (typeof option === "string") {
                return option;
              }
              const { inputValue = "", name = "", email = "" } = option;
              if (option.inputValue) {
                return inputValue;
              }
              return `${name} ${email ? `- ${email}` : ""}`;
            }}
            options={map(options, (tag) => ({ ...tag, inputValue: undefined })) as TAttribute[]}
            loading={loading}
            multiple
            sx={{
              ".MuiOutlinedInput-root": {
                div: { display: "none" },
              },
              ".MuiChip-root": { height: 24, label: { pr: 1, pl: 1 }, m: 0.25 },
            }}
            onChange={handleChangeTags}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!helperText}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                {...inputProps}
              />
            )}
          />
          <FormHelperText style={styles.helperText} error>
            {helperText}
          </FormHelperText>
          <Stack spacing={0.5} style={styles.tagWrapper}>
            {map(tags, (tag, index) => (
              <Stack key={tag.id} direction={"row"} alignItems={"center"}>
                <Checkbox
                  checked={tag.is_default}
                  onChange={(e) =>
                    onChangeDefault?.({ id: tag.id || "", value: e.target.checked, index })
                  }
                  size="small"
                  sx={{
                    path: { color: (theme) => theme.palette.action.disabled },
                  }}
                />
                <Chip
                  disabled={disabled}
                  label={tag.name}
                  onDelete={onSubmit ? () => tag.id && filterTags({ id: tag.id }) : undefined}
                  size="small"
                />
              </Stack>
            ))}
          </Stack>
        </Grid>
      </>
    );
  },
);

const styles: TStyles<"helperText" | "tagWrapper"> = {
  helperText: { margin: 0 },
  tagWrapper: { display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
};
