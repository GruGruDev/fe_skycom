import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { TextField, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { NoDataPanel } from "components/NoDataPanel";
import { SCAN_CODE_LABEL } from "constants/warehouse/label";
import { TStyles } from "types/Styles";

interface Props {
  sheets: {
    order_key: string;
    is_confirm: boolean | string;
    message?: string;
  }[];
}

function TableResultSheetScanned(props: Props) {
  const { sheets } = props;
  const theme = useTheme();
  const [count, setCount] = useState({
    success: 0,
    error: 0,
    duplicate: 0,
  });

  useEffect(() => {
    const newCount = sheets.reduce(
      (
        prev,
        current: {
          order_key: string;
          is_confirm: boolean | string;
          message?: string;
        },
        currentIndex: number,
      ) => {
        if (current.is_confirm) prev.success += 1;
        else prev.error += 1;
        const indexDuplicate = sheets.findIndex(
          (item, index) => item.order_key === current.order_key && index > currentIndex,
        );
        if (indexDuplicate !== -1) {
          prev.duplicate += 1;
        }
        return prev;
      },
      {
        success: 0,
        error: 0,
        duplicate: 0,
      },
    );
    setCount({ ...newCount });
  }, [sheets]);

  return (
    <Box sx={{ ...styles.container }}>
      <Stack direction="row" spacing={1} width="100%" my={1}>
        <TextField label={SCAN_CODE_LABEL.all_code} value={sheets?.length || 0} />
        <TextField label={SCAN_CODE_LABEL.confirmed} value={count.success} />
        <TextField label={SCAN_CODE_LABEL.error} value={count.error} />
        <TextField label={SCAN_CODE_LABEL.duplicate} value={count.duplicate} />
      </Stack>
      <table style={styles.table}>
        <colgroup>
          {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
          <col style={{ width: "20%" }} />
          {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
          <col style={{ width: "30%" }} />
          {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
          <col style={{ width: "50%" }} />
        </colgroup>
        <thead>
          <tr>
            <Th style={styles.th}>{SCAN_CODE_LABEL.stt}</Th>
            <Th style={styles.th}>{SCAN_CODE_LABEL.code}</Th>
            <Th style={styles.th}>{SCAN_CODE_LABEL.result}</Th>
          </tr>
        </thead>
        <tbody>
          {sheets.reverse().map((sheet, index) => (
            <tr key={index}>
              <td>{sheets.length - index}</td>
              <td>
                <Typography
                  sx={{
                    ...styles.mainText,
                    color: sheet.is_confirm ? theme.palette.text.primary : theme.palette.error.main,
                    transition: "all .15s ease-in-out",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                  component="a"
                  href={`/warehouse/exports?sheet_code=${sheet.order_key.slice(1)}`}
                >
                  {sheet.order_key || ""}
                </Typography>
              </td>
              <td>
                {sheet.is_confirm ? (
                  <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                    <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                    <Typography>{sheet.message}</Typography>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                    <ErrorIcon sx={{ color: theme.palette.error.main }} />
                    <Typography>{sheet.message}</Typography>
                  </Stack>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sheets.length === 0 ? (
        <NoDataPanel
          message={SCAN_CODE_LABEL.no_data}
          wrapImageSx={{ height: "120px", width: "100%" }}
          showImage
        />
      ) : null}
    </Box>
  );
}

export default TableResultSheetScanned;

const styles: TStyles<"container" | "table" | "mainText" | "td" | "th"> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minWidth: "320px",
    marginTop: "3rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  mainText: {
    fontWeight: 600,
    fontSize: "0.82rem",
    cursor: "pointer",
    textDecoration: "none",
  },
  td: {
    border: "1px solid #eee",
    padding: 3,
    textAlign: "center",
  },
  th: {
    border: "1px solid #eee",
    padding: 3,
    textAlign: "center",
  },
};
const Th = styled("th")(() => {
  const theme = useTheme();
  return {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  };
});
