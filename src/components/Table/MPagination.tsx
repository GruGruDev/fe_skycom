import { useMediaQuery, useTheme } from "@mui/material";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { LABEL } from "constants/label";
import map from "lodash/map";
import { useEffect, useState } from "react";
import { TStyles, TSx } from "types/Styles";
import { isEnterPress } from "utils/keyBoard";

const REGEX_NUMBER = /^[+-]?\d*(?:[.,]\d*)?$/;

const formatPaginationLabel = ({
  totalCount,
}: {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}) => {
  // const isEmpty = totalCount ? 1 : 0;
  // const from = (currentPage - 1) * pageSize + isEmpty;
  // const target = (currentPage - 1) * pageSize + (totalCount ? pageSize : 0);
  // const to = currentPage === totalPages ? totalCount : target;
  // return `${from} - ${to} / ${totalCount}`;
  return `/ ${totalCount}`;
};

export interface MPaginationProps {
  totalPages: number;
  currentPage: number;
  onCurrentPageChange?: (value: number) => void;
  onPageSizeChange?: (value: number) => void;
  pageSize: number;
  totalCount: number;
  pageSizes: number[];
  isCustom?: boolean;
}

export function MPagination({
  totalPages, //total currentPage
  currentPage, //curren currentPage
  onCurrentPageChange,
  pageSize,
  onPageSizeChange,
  totalCount,
  pageSizes,
  isCustom = false,
}: MPaginationProps) {
  const [page, setPage] = useState<any>(currentPage);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const limitMax = pageSizes[pageSizes.length - 1];
  const limitMin = pageSizes[0];

  const [limitInput, setLimitInput] = useState(0);

  const handleChangeCustomInput = (event: any) => {
    const limit = parseInt(event.target.value);
    const max = totalCount > limitMax ? limitMax : totalCount;
    const min = limit < limitMin ? limitMin : limit;
    const value = limit > max ? max : limit < min ? min : limit;

    if (value != pageSize) {
      onPageSizeChange?.(value);
    } else {
      setLimitInput(pageSize);
    }
  };

  useEffect(() => {
    setPage(+currentPage);
  }, [currentPage]);

  useEffect(() => {
    setLimitInput(+pageSize);
  }, [pageSize]);

  return (
    <>
      <Divider />

      <Grid
        container
        py={1}
        justifyContent="flex-end"
        alignItems="center"
        sx={{
          "& button": {
            fontSize: "0.82rem",
            width: 32,
            margin: 0,
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {!isMobile && <span style={styles.lineInPage}>{LABEL.ROW_PER_PAGE}</span>}
          <FormControl variant="standard">
            {isCustom ? (
              <TextField
                size="small"
                sx={{ marginX: 1, maxWidth: 100 }}
                type="number"
                onBlur={handleChangeCustomInput}
                onKeyDown={(e) => isEnterPress(e) && handleChangeCustomInput(e)}
                value={limitInput}
                onChange={(e) => setLimitInput(parseInt(e.target.value))}
              />
            ) : (
              <Select
                style={styles.pageOption}
                size="small"
                labelId="pagination-row-in-currentPage-label"
                id="pagination-row-in-currentPage"
                value={pageSize?.toString()}
                onChange={(e) => onPageSizeChange?.(parseInt(e.target.value))}
              >
                {map(pageSizes, (size) => (
                  <MenuItem key={size} value={size} sx={{ fontSize: 12 }}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        </Stack>
        <span style={styles.pageNumber}>
          {formatPaginationLabel({ currentPage, pageSize, totalCount, totalPages })}
        </span>
        <Pagination
          color="primary"
          count={parseInt(`${totalPages}`)}
          page={parseInt(`${currentPage}`)}
          onChange={(_, value) => onCurrentPageChange?.(value)}
          sx={{ "& .MuiPaginationItem-root": { width: 24, fontSize: 12 } }}
          siblingCount={0}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          {/* <span style={styles.lineInPage}>{LABEL.GO_TO_PAGE}</span> */}
          <FormControl>
            <TextField
              sx={styled.currentPage}
              size="small"
              value={page}
              onChange={(e) => {
                const newPage = e.target.value;
                REGEX_NUMBER.test(newPage) && setPage(+newPage > totalPages ? totalPages : newPage);
              }}
              label={LABEL.GO_TO_PAGE}
              onBlur={() => onCurrentPageChange?.(page)}
              onKeyDown={(e) => isEnterPress(e) && onCurrentPageChange?.(page)}
            />
          </FormControl>
        </Stack>
      </Grid>
    </>
  );
}

const styles: TStyles<"lineInPage" | "pageOption" | "pageNumber"> = {
  lineInPage: { fontSize: "0.82rem" },
  pageNumber: {
    fontSize: "0.82rem",
    marginLeft: 8,
    marginRight: 8,
  },
  pageOption: { fontSize: "0.82rem" },
};

const styled: TSx<"currentPage"> = {
  currentPage: {
    ".MuiOutlinedInput-root": {
      fontSize: "0.82rem",
      padding: "0 4px",
    },
    ".MuiOutlinedInput-input": {
      padding: "4px",
    },
    width: 60,
    fontSize: "0.8rem",
  },
};
