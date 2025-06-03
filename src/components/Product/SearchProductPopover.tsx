import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { productApi } from "apis/product";
import { ZINDEX_SYSTEM } from "constants/index";
import useDebounce from "hooks/useDebounce";
import { memo, useCallback, useEffect, useState } from "react";
import { TProduct } from "types/Product";
import { VariantItem } from ".";
import { PRODUCT_LABEL } from "constants/product/label";
import { findOption } from "utils/option";
// ----------------------------------------------------------

export const SearchProductPopover = memo(
  ({
    value,
    message,
    disabled = false,
    isMultiple = false,
    limitTags = 1,
    params,
    handleSelectProduct,
    isSelectOrigin,
  }: {
    value: string;
    message?: string;
    limitTags?: number;
    disabled?: boolean;
    isMultiple?: boolean;
    params?: Partial<any>;
    isSelectOrigin?: boolean;
    handleDisableItem?: (product: Partial<TProduct>) => boolean;
    handleSelectProduct?: (products: string) => void;
    handleDataItem?: (products: Partial<TProduct>) => Partial<TProduct>[];
  }) => {
    const [isLoadingSearch, setLoadingSeach] = useState(false);
    const [search, setSearch] = useState("");
    const [dataProducts, setDataProducts] = useState<Partial<TProduct>[]>([]);

    const debounceSearch = useDebounce(search, 400);

    const getAllProduct = useCallback(async () => {
      if (disabled) return;
      setLoadingSeach(true);
      const result = await productApi.get<TProduct>({
        params: {
          is_active: true,
          limit: 50,
          page: 1,
          search: debounceSearch,
          ...params,
        },
      });

      if (result?.data) {
        const { results = [] } = result.data;

        setDataProducts(results);
      }
      setLoadingSeach(false);
    }, [debounceSearch, params, disabled]);

    useEffect(() => {
      getAllProduct();
    }, [getAllProduct]);

    const inputValue = findOption(dataProducts, value);

    return (
      <Autocomplete
        id="controlled-demo"
        value={inputValue}
        fullWidth
        multiple={isMultiple}
        limitTags={limitTags}
        disabled={disabled}
        filterOptions={(x) => x}
        isOptionEqualToValue={(option, value) => `${value?.id}` === `${option?.id}`}
        getOptionLabel={({ name = "" }) => name}
        getOptionDisabled={() => disabled}
        options={dataProducts}
        clearOnBlur={false}
        onChange={(_, newValue: any) =>
          handleSelectProduct?.(isSelectOrigin ? newValue : newValue.id || "")
        }
        renderOption={(props, option) => (
          <li {...props}>
            <VariantItem
              value={option}
              isShowStatus
              hiddenColumns={["combo", "quantity", "price", "cross_sale", "total", "sku"]}
            />
          </li>
        )}
        sx={{ zIndex: ZINDEX_SYSTEM.selector }}
        loading={isLoadingSearch}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            placeholder={PRODUCT_LABEL.select_product}
            onChange={(event) => setSearch(event.target.value)}
            error={!!message}
            helperText={message}
            label={PRODUCT_LABEL.list_product}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              ...params?.InputProps,
              endAdornment: (
                <>
                  {isLoadingSearch ? <CircularProgress color="inherit" size={20} /> : null}
                  {params?.InputProps?.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    );
  },
);
