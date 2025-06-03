import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { TSelectOption } from "types/SelectOption";

export interface MAutocompleteProps {
  loading?: boolean;
  options: TSelectOption[];
}

export function Asynchronous({ options, loading }: MAutocompleteProps) {
  return (
    <Autocomplete
      isOptionEqualToValue={(option: TSelectOption, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
