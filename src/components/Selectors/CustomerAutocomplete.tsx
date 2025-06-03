import { ClickAwayListener, Paper } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useTheme } from "@mui/material/styles";
import { customerApi } from "apis/customer";
import { SearchField, SearchFieldProps } from "components/Fields";
import { LABEL } from "constants/label";
import map from "lodash/map";
import reduce from "lodash/reduce";
import slice from "lodash/slice";
import React, { useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import { TCustomer } from "types/Customer";
import { TStyles } from "types/Styles";
import { getPhoneAttribute } from "utils/option";
import { maskedPhone } from "utils/strings";

interface CustomerAutocompleteProps extends Omit<SearchFieldProps, "error"> {
  onSelected?: (customer: Partial<TCustomer>) => void;
  defaultValue?: string;
  disabled?: boolean;
  error?: FieldErrors<TCustomer>;
  required?: boolean;
  autoFocus?: boolean;
  isShowAdornment?: boolean;
  containerStyle?: React.CSSProperties;
}

export const CustomerAutocomplete = (props: CustomerAutocompleteProps) => {
  const { defaultValue = "", error, isShowAdornment, containerStyle, onSelected } = props;

  const theme = useTheme();
  const [phone, setPhone] = useState("");
  const [data, setData] = useState<TCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [params] = useState({ limit: 200, page: 1 });
  const [showModal, setShowModal] = useState(false);
  const [itemFocusIndex, setItemFocusIndex] = useState<number | null>(null);

  const getData = async (value: string) => {
    if (value) {
      setLoading(true);
      const result = await customerApi.get({
        endpoint: "",
        params: { ...params, search: value },
      });
      if (result.data) {
        setData(result.data.results);
      }
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (data.length) {
      if (e.key === "ArrowDown") {
        if (itemFocusIndex === null || itemFocusIndex === data.length - 1) {
          setItemFocusIndex(0);
        } else {
          setItemFocusIndex((prev) => (prev || 0) + 1);
        }
      } else if (e.key === "ArrowUp") {
        if (itemFocusIndex === null || itemFocusIndex === 0) {
          setItemFocusIndex(data.length - 1);
        } else {
          setItemFocusIndex((prev) => (prev || 1) - 1);
        }
      }
    }
  };

  const backgroundFocusItem = (index: number) =>
    index === itemFocusIndex ? (isDarkMode ? "grey.700" : "rgba(0, 0, 0, 0.12)") : "unset";

  const handleSelectCustomer = (customer: Partial<TCustomer>) => {
    const firstPhone = customer.phones?.[0]?.phone ?? "";
    setPhone(firstPhone);
    setShowModal(false);
    onSelected && onSelected(customer);
  };

  useEffect(() => {
    setItemFocusIndex(null);
  }, [showModal]);

  useEffect(() => {
    setPhone(defaultValue);
  }, [defaultValue]);

  const isEmptyData = data.length === 0;
  const isDarkMode = theme.palette.mode === "dark";
  return (
    <ClickAwayListener onClickAway={() => setShowModal(false)}>
      <div style={{ ...styles.wrapper, ...containerStyle }} onKeyDown={handleKeyDown}>
        <SearchField
          {...props}
          isShowEndAdornment={isShowAdornment}
          loading={loading}
          defaultValue={phone}
          onSearch={(value) => {
            if (itemFocusIndex === null) {
              setPhone(value.trim());
              if (value === "") {
                setShowModal(false);
                setData([]);
                // setCount(0);
              } else {
                setShowModal(true);
                getData(value);
              }
            }
          }}
          fullWidth
          placeholder={LABEL.SEARCH}
          error={!!error?.id}
          helperText={error?.id?.message}
        />
        {showModal && (
          <Paper
            elevation={3}
            style={{
              marginTop: props.size === "small" ? 40 : 60,
              ...styles.paper,
            }}
          >
            {isEmptyData ? (
              LABEL.NO_DATA
            ) : (
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  maxHeight: 250,
                  overflow: "auto",
                }}
                aria-label="customers"
                // onKeyDown={itemFocusIndex !== null ? (e) => onKeyDown(e) : undefined}
              >
                {map(
                  slice(data, (params.page - 1) * params.limit, params.limit * params.page),
                  (item, index) => {
                    const phoneNumber = getPhoneAttribute({ options: item.phones });
                    const symbol = phoneNumber.length ? "-" : "";
                    const phoneMasked = reduce(
                      phoneNumber,
                      (prev: string[], item) => [...prev, maskedPhone(item)],
                      [],
                    );
                    return (
                      <ListItem
                        disablePadding
                        key={index}
                        onClick={() => handleSelectCustomer(item)}
                      >
                        <ListItemButton
                          style={styles.itemButton}
                          onMouseOver={() => setItemFocusIndex(index)}
                          sx={{
                            backgroundColor: backgroundFocusItem(index),
                            ":hover": {
                              backgroundColor: backgroundFocusItem(index),
                            },
                          }}
                        >{`${item.name} ${symbol} ${phoneMasked.join("/ ")}`}</ListItemButton>
                      </ListItem>
                    );
                  },
                )}
              </List>
            )}
          </Paper>
        )}
      </div>
    </ClickAwayListener>
  );
};

const styles: TStyles<"itemButton" | "paper" | "wrapper"> = {
  itemButton: { fontSize: "0.82rem", padding: 6 },
  wrapper: { position: "relative", display: "flex", flex: 1 },
  paper: { position: "absolute", top: 0, left: 0, width: "100%", padding: 10, zIndex: 9999 },
};
