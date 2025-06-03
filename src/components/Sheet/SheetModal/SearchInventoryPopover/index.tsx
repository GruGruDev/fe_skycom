import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { warehouseApi } from "apis/warehouse";
import useDebounce from "hooks/useDebounce";
import { memo, useCallback, useEffect, useState } from "react";
import InventoryItem from "./InventoryItem";
import { TInventory } from "types/Warehouse";
import reduce from "lodash/reduce";
import { TBatch } from "types/Product";
import { WAREHOUSE_LABEL } from "constants/warehouse/label";
import { ZINDEX_SYSTEM } from "constants/index";
// ----------------------------------------------------------

export const SearchInventoryPopover = memo(
  ({
    value,
    message,
    disabled = false,
    isMultiple = false,
    limitTags = 1,
    params = {},
    handleSelectVariant,
  }: {
    value: Partial<TInventory & TBatch>[];
    message?: string;
    limitTags?: number;
    disabled?: boolean;
    isMultiple?: boolean;
    params?: Partial<any>;
    handleSelectVariant: (variants: Partial<TInventory & TBatch>[]) => void;
  }) => {
    const [isLoadingSearch, setLoadingSeach] = useState(false);
    const [search, setSearch] = useState("");
    const [dataVariants, setDataVariants] = useState<Partial<TInventory & TBatch>[]>([]);

    const debounceSearch = useDebounce(search, 400);

    const handleFormatData = (data: TInventory[]) => {
      return reduce(
        data,
        (prev: Partial<TInventory & TBatch>[], cur) => {
          return [...prev, { ...cur, ...cur.product_variant_batch }];
        },
        [],
      );
    };

    const getAllInventory = useCallback(async () => {
      setLoadingSeach(true);
      const result = await warehouseApi.get<TInventory>({
        params: { limit: 50, page: 1, search: debounceSearch, ...params },
        endpoint: "inventory/",
      });

      if (result?.data) {
        const { results = [] } = result.data;

        setDataVariants(handleFormatData(results));
      }
      setLoadingSeach(false);
    }, [debounceSearch, params]);

    useEffect(() => {
      getAllInventory();
    }, [getAllInventory]);

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
        onChange={(_, newValue) => handleSelectVariant(newValue as Partial<TInventory & TBatch>[])}
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
            placeholder={WAREHOUSE_LABEL.search_batches}
            onChange={(event) => setSearch(event.target.value)}
            error={!!message}
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
