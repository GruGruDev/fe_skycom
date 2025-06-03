import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { productApi } from "apis/product";
import { ZINDEX_SYSTEM } from "constants/index";
import useDebounce from "hooks/useDebounce";
import { memo, useCallback, useEffect, useState } from "react";
import { TVariant } from "types/Product";
import { VariantItem } from "./VariantItem";
import { FieldError } from "react-hook-form";
// ----------------------------------------------------------

export interface SearchVariantProps {
  value?: Partial<TVariant>[];
  placeholder?: string;
  limitTags?: number;
  disabled?: boolean;
  isMultiple?: boolean;
  params?: Partial<any>;
  handleDisableItem?: (variant: Partial<TVariant>) => boolean;
  handleSelectVariant?: (variants: Partial<TVariant>[] | Partial<TVariant> | null) => void;
  handleDataItem?: (variants: Partial<TVariant>[]) => Partial<TVariant>[];
  error?: FieldError;
  textFieldProps?: TextFieldProps;
}

export const SearchVariantPopover = memo(
  ({
    value,
    disabled = false,
    isMultiple = false,
    placeholder = "",
    limitTags = 1,
    params,
    handleSelectVariant,
    textFieldProps,
    error,
  }: SearchVariantProps) => {
    const [isLoadingSearch, setLoadingSeach] = useState(false);
    const [search, setSearch] = useState("");
    const [dataVariants, setDataVariants] = useState<Partial<TVariant>[]>([]);

    const debounceSearch = useDebounce(search, 400);

    const getAllVariant = useCallback(async () => {
      if (disabled) return;
      setLoadingSeach(true);
      const result = await productApi.get<Partial<TVariant>>({
        params: {
          is_active: "true",
          limit: 50,
          page: 1,
          search: debounceSearch,
          ...params,
        },
        endpoint: "variants/",
      });

      if (result?.data) {
        const { results = [] } = result.data;

        setDataVariants(results);
      }
      setLoadingSeach(false);
    }, [debounceSearch, params, disabled]);

    useEffect(() => {
      getAllVariant();
    }, [getAllVariant]);

    return (
      <Autocomplete
        id="controlled-demo"
        value={value}
        fullWidth
        multiple={isMultiple}
        limitTags={limitTags}
        disabled={disabled}
        filterOptions={(x) => x}
        isOptionEqualToValue={(option, value) => `${value?.id}` === `${option?.id}`}
        getOptionLabel={({ name = "", SKU_code = "" }) => name + SKU_code}
        getOptionDisabled={() => disabled}
        options={dataVariants}
        clearOnBlur={false}
        onChange={(_, newValue) => handleSelectVariant?.(newValue)}
        renderOption={(props, option) => (
          <li {...props}>
            <VariantItem
              value={option}
              isShowStatus
              hiddenColumns={["combo", "quantity", "price", "cross_sale", "total"]}
            />
          </li>
        )}
        sx={{ zIndex: ZINDEX_SYSTEM.selector }}
        loading={isLoadingSearch}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            placeholder={placeholder}
            onChange={(event) => setSearch(event.target.value)}
            error={!!error}
            helperText={error?.message}
            InputProps={{
              ...params?.InputProps,
              endAdornment: (
                <>
                  {isLoadingSearch ? <CircularProgress color="inherit" size={20} /> : null}
                  {params?.InputProps?.endAdornment}
                </>
              ),
            }}
            {...textFieldProps}
          />
        )}
      />
    );
  },
);
