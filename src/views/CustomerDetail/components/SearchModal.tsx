import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { customerApi } from "apis/customer";
import { CUSTOMER_LABEL } from "constants/customer/label";
import useDebounce from "hooks/useDebounce";
import { Fragment, useEffect, useState } from "react";
import { CustomerDTO, TCustomer } from "types/Customer";
import { TStyles } from "types/Styles";

const SearchModal = ({
  onSelect,
  defaultValue,
  inputProps,
}: {
  onSelect: (customer: Partial<TCustomer>) => void;
  defaultValue?: Partial<CustomerDTO>;
  inputProps?: TextFieldProps;
}) => {
  const [options, setOptions] = useState<Partial<TCustomer>[]>([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [value, setValue] = useState<Partial<CustomerDTO>>();

  const debounceValue = useDebounce(phone, 500);

  const getData = async (textInput: string) => {
    setLoading(true);
    const result = await customerApi.get({
      endpoint: "",
      params: { limit: 100, page: 1, search: textInput },
    });
    if (result.data) {
      setOptions(result.data.results);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData(phone);
  }, [debounceValue, phone]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-async"
      options={options}
      value={value}
      fullWidth
      loading={loading}
      size="small"
      defaultValue={defaultValue}
      isOptionEqualToValue={(option: Partial<Omit<TCustomer, "tags" | "groups" | "phones">>) =>
        !!option.id
      }
      onChange={(_e, value) => value && onSelect(value)}
      getOptionLabel={(option: Partial<Omit<TCustomer, "tags" | "groups" | "phones">>) =>
        `${option.name}`
      }
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(e) => setPhone(e.target.value)}
          label={CUSTOMER_LABEL.input_phone}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <Fragment>
                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
          {...inputProps}
        />
      )}
      renderOption={(props, option, { selected }) => (
        <MenuItem {...props} selected={selected}>
          <Typography style={styles.name} className="ellipsis-label">{`${option.name}`}</Typography>
        </MenuItem>
      )}
    />
  );
};

export default SearchModal;

const styles: TStyles<"name"> = {
  name: { fontSize: "0.82rem" },
};
