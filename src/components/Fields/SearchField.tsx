import ArrowForward from "@mui/icons-material/ArrowForward";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import PasteIcon from "assets/icons/PasteIcon";
import SearchIcon from "assets/icons/SearchIcon";
import { LABEL } from "constants/label";
import React, { useCallback, useEffect, useState } from "react";
import { TStyles } from "types/Styles";

const SEARCH_DELAY_TIMING = 500;

export interface SearchFieldProps {
  label?: string;
  renderIcon?: React.ReactNode;
  standard?: boolean;
  placeholder?: string;
  defaultValue?: string;
  style?: React.CSSProperties;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  sx?: SxProps<Theme>;
  loading?: boolean;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  autoFocus?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
  isShowEndAdornment?: boolean;
  isDebounce?: boolean;
  adornmentPosition?: "start" | "end";
  minLength?: number;
}

export const SearchField = ({
  adornmentPosition = "start",
  isDebounce = true,
  minLength = 0,
  sx,
  label = LABEL.SEARCH,
  renderIcon = <SearchIcon />,
  standard,
  onSearch,
  onChange,
  autoFocus,
  defaultValue = "",
  disabled,
  error,
  fullWidth,
  helperText,
  isShowEndAdornment,
  loading,
  name,
  placeholder = LABEL.SEARCH,
  required,
  size,
  style,
}: SearchFieldProps) => {
  const [, setPasted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPrev, setSearchPrev] = useState("");

  const onKeyPress = (event: any) => {
    if (event.key === "Enter") {
      search();
      event.stopPropagation();
    }
  };

  const handlePaste = async () => {
    const content = await navigator.clipboard.readText();
    onSearch && (content.length >= minLength || !content) && onSearch(content);
    setPasted(true);
  };

  const handleClear = () => {
    onChange?.("");
    setSearchTerm("");
    setPasted(false);
  };

  const search = useCallback(() => {
    if (searchTerm != searchPrev) onSearch?.(searchTerm);
    setSearchPrev(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, searchPrev]);

  const setInput = (value: string) => {
    setSearchTerm(value);
    onChange?.(value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      search();
    }, SEARCH_DELAY_TIMING);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [search]);

  useEffect(() => {
    if (defaultValue) setSearchTerm(defaultValue);
  }, [defaultValue]);

  return onSearch ? (
    <Box position="relative" width="100%">
      <Paper>
        <TextField
          label={label}
          size={size || "small"}
          style={style}
          sx={{
            width: fullWidth ? undefined : 300,
            ...sx,
            ".MuiInputBase-root": { backgroundColor: "rgb(0,0,0,0.01)" },
            input: { fontSize: "0.8rem !important" },
          }}
          variant={standard ? "standard" : "outlined"}
          value={searchTerm}
          fullWidth={fullWidth}
          placeholder={placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={onKeyPress}
          InputProps={{
            autoComplete: "off",
            startAdornment:
              loading && adornmentPosition === "start" ? (
                <CircularProgress size={20} style={styles.loadingIcon} />
              ) : (
                renderIcon && (
                  <InputAdornment position="start" style={styles.adornmentIcon}>
                    {renderIcon}
                  </InputAdornment>
                )
              ),
            endAdornment:
              //check show button search
              loading && adornmentPosition === "end" ? (
                <CircularProgress size={20} style={styles.loadingIcon} />
              ) : isShowEndAdornment && !isDebounce ? (
                <InputAdornment position="end" onClick={search} style={styles.endAdornmentIcon}>
                  <ArrowForward />
                </InputAdornment>
              ) : (
                <InputAdornment
                  position="end"
                  onClick={searchTerm ? handleClear : handlePaste}
                  style={styles.endAdornmentIcon}
                >
                  {searchTerm ? <HighlightOffIcon /> : <PasteIcon />}
                </InputAdornment>
              ),
          }}
          name={name}
          disabled={disabled}
          error={error}
          helperText={helperText}
          required={required}
          autoFocus={autoFocus}
        />
      </Paper>
    </Box>
  ) : null;
};

const styles: TStyles<"loadingIcon" | "adornmentIcon" | "endAdornmentIcon" | "contentSearchIcon"> =
  {
    loadingIcon: { marginRight: 9 },
    adornmentIcon: { marginRight: 8 },
    endAdornmentIcon: { cursor: "pointer" },
    contentSearchIcon: { fontSize: "1.5rem" },
  };
