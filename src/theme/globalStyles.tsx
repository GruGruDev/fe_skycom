// material
import { useTheme } from "@mui/material/styles";
import { GlobalStyles as GlobalThemeStyles } from "@mui/material";
import { useEffect } from "react";
import { ZINDEX_SYSTEM } from "constants/index";

// ----------------------------------------------------------------------

export default function GlobalStyles() {
  const theme = useTheme();

  useEffect(() => {
    document.onclick = (e) => applyCursorRippleEffect(e);
  }, []);

  function applyCursorRippleEffect(_e: MouseEvent) {
    // const ripple = document.createElement("div");
    // ripple.className = "ripple";
    // document.body.appendChild(ripple);
    // ripple.style.left = `${e.clientX}px`;
    // ripple.style.top = `${e.clientY}px`;
    // ripple.style.animation = "ripple-effect .3s  linear";
    // ripple.onanimationend = () => document.body.removeChild(ripple);
  }

  return (
    <GlobalThemeStyles
      styles={{
        "*": {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
        html: {
          width: "100%",
          height: "100%",
          WebkitOverflowScrolling: "touch",
        },
        body: {
          width: "100%",
          height: "100%",
          "& > div": {},
        },
        svg: { padding: "0px !important" },
        ".MuiButton-root": {
          textTransform: "unset !important" as any,
          padding: "3px 8px !important",
          fontSize: "0.9rem !important",
          fontWeight: "500 !important",
          svg: {
            fontSize: "1.2rem !important",
          },
        },
        // ".MuiInputAdornment-root": {
        //   button: {
        //     padding: "5px !important",
        //   },
        // },
        "#root": {
          width: "100%",
          height: "max-content",
          position: "relative",
          backgroundColor: "rgb(0, 0, 0,0.05)",
        },
        ".MuiLink-root": { width: "fit-content" },
        ".ellipsis-label": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        },
        ".text-max-line": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box !important",
          // -webkit-line-clamp: 2; /* number of lines to show */
          // line-clamp: 2;
          WebkitBoxOrient: "vertical",
        },
        //virtual table
        // header sort table
        table: {
          // thead: {
          //   top: "-1px !important",
          //   "& > tr > th:last-child": {
          //     display: "none",
          //   },
          // },
          // tbody: {
          //   "& > tr > td:last-child": {
          //     display: "none",
          //   },
          //   ".TableDetailCell-active": {
          //     display: "table-cell !important",
          //   },
          // },
          borderCollapse: "collapse !important",
          ".MuiTableSortLabel-icon": {
            display: "none",
          },
          "th:hover": {
            ".MuiTableSortLabel-icon": {
              display: "inline-block",
            },
          },
        },
        "table:last-child": {
          marginBottom: "0px !important",
        },
        "table:nth-of-type(2)": {
          zIndex: 0,
        },
        //header table
        ".MuiDataGrid-columnHeader": {
          ".MuiDataGrid-columnHeaderTitle": {
            width: "100%",
          },
        },
        th: { borderBottomLeftRadius: "0px !important" },
        ".MuiTableCell-root": {
          borderBottom: `2px solid !important`,
          borderColor: `${theme.palette.mode === "light" ? "#ecf0f1" : "#34495e"} !important`,
          p: {
            fontSize: "0.82rem",
          },
        },

        ".MuiPaper-root": {
          borderWidth: 0,
        },
        ".relative": { position: "relative" },
        ".MuiToolbar-root": {
          height: 0,
          minHeight: 0,
        },
        ".MuiFormControlLabel-root > span": {
          svg: { fontSize: "1.5rem !important" },
        },
        input: {
          fontSize: "0.9rem !important",
          "&[type=number]": {
            MozAppearance: "textfield",
            "&::-webkit-outer-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
            "&::-webkit-inner-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
          },
          padding: "5.5px 11px",
        },
        textarea: {
          fontSize: "0.9rem !important",
          "&::-webkit-input-placeholder": {
            color: theme.palette.text.disabled,
          },
          "&::-moz-placeholder": {
            opacity: 1,
            color: theme.palette.text.disabled,
          },
          "&:-ms-input-placeholder": {
            color: theme.palette.text.disabled,
          },
          "&::placeholder": {
            color: theme.palette.text.disabled,
          },
        },
        "::placeholder": {
          color: `${theme.palette.action.disabled} !important`,
          opacity: 1 /* Firefox */,
        },

        ":-ms-input-placeholder": {
          /* Internet Explorer 10-11 */ color: `${theme.palette.action.disabled} !important`,
        },

        "::-ms-input-placeholder": {
          /* Microsoft Edge */ color: `${theme.palette.action.disabled} !important`,
        },

        img: { display: "block", maxWidth: "100%" },

        ".PrivatePickersFadeTransitionGroup-root > div": {
          fontSize: "0.82rem",
        },

        // date picker
        ".MuiPickersPopper-root": { zIndex: `${ZINDEX_SYSTEM.picker} !important` },

        // Lazy Load Img
        ".blur-up": {
          WebkitFilter: "blur(5px)",
          filter: "blur(5px)",
          transition: "filter 400ms, -webkit-filter 400ms",
        },
        ".blur-up.lazyloaded ": {
          WebkitFilter: "blur(0)",
          filter: "blur(0)",
        },
        //helper text input
        ".MuiFormControl-root > p": {
          margin: 0,
        },
        /* width */
        "::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },

        /* Track */
        "::-webkit-scrollbar-track": {
          borderRadius: 7,
          background: "#f1f1f1",
        },

        /* Handle */
        "::-webkit-scrollbar-thumb": {
          background: "rgb(182, 182, 182)",
          borderRadius: 7,
        },

        /* Handle on hover */
        "::-webkit-scrollbar-thumb:hover": {
          background: "rgb(143, 143, 143)",
        },
        // tripple click
        ".ripple": {
          width: 10,
          height: 10,
          backgroundColor: "transparent",
          position: "fixed",
          borderRadius: "50%",
          // border: "1px solid red",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: theme.palette.primary.main,
        },
        "@keyframes ripple-effect": {
          to: {
            transform: "scale(5)",
            opacity: 0.01,
          },
        },
        ".product-item-box:last-child > hr": {
          display: "none",
        },
      }}
    />
  );
}
