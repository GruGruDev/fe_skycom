import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { warehouseApi } from "apis/warehouse";
import { ZINDEX_SYSTEM } from "constants/index";
import useDebounce from "hooks/useDebounce";
import { memo, useCallback, useEffect, useState } from "react";
import { TVariantDetail } from "types/Product";
import InventoryItem from "./InventoryItem";
// ----------------------------------------------------------

export const SearchVariantInWarehousePopover = memo(
  ({
    value,
    message,
    disabled = false,
    isMultiple = false,
    placeholder = "",
    limitTags = 1,
    params = {},
    handleSelectVariant,
  }: {
    value: Partial<TVariantDetail>[];
    message?: string;
    placeholder?: string;
    limitTags?: number;
    disabled?: boolean;
    isMultiple?: boolean;
    params?: Partial<any>;
    handleSelectVariant: (variants: Partial<TVariantDetail>[]) => void;
  }) => {
    const [isLoadingSearch, setLoadingSeach] = useState(false);
    const [search, setSearch] = useState("");
    const [dataVariants, setDataVariants] = useState<Partial<TVariantDetail>[]>([]);

    const debounceSearch = useDebounce(search, 400);

    const getAllInventory = useCallback(async () => {
      if (disabled) {
        return;
      }
      setLoadingSeach(true);
      const result = await warehouseApi.get<TVariantDetail>({
        params: { limit: 50, page: 1, search: debounceSearch, ...params },
        endpoint: "inventory-with-variant/",
      });

      if (result?.data) {
        const { results = [] } = result.data;

        setDataVariants(results);
      }
      setLoadingSeach(false);
    }, [debounceSearch, params, disabled]);

    useEffect(() => {
      getAllInventory();
    }, [getAllInventory]);

    const error = !!message;

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
        getOptionLabel={(item) => item?.name || ""}
        getOptionDisabled={() => disabled}
        options={dataVariants}
        clearOnBlur={false}
        onChange={(_, newValue) => handleSelectVariant(newValue as TVariantDetail[])}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <InventoryItem {...option} />
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
            error={error}
            helperText={message}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoadingSearch ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    );
  },
);
