import { Divider, SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AxiosResponse } from "axios";
import { SearchField, SearchFieldProps } from "components/Fields";
import { NoDataPanel } from "components/NoDataPanel";
import { LABEL } from "constants/label";
import { useCancelToken } from "hooks/useCancelToken";
import { useCallback, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import { CANCEL_REQUEST, TMultiResponse } from "types/ResponseApi";
import MSortButton from "./Header/MSortButton";
import { TSelectOption } from "types/SelectOption";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ZINDEX_SYSTEM } from "constants/index";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { BUTTON } from "constants/button";
import VirtualizedList from "components/VirtualizedList";

export interface MTableProps
  extends Omit<
    SearchFieldProps,
    | "defaultValue"
    | "placeholder"
    | "fullWidth"
    | "style"
    | "sx"
    | "place"
    | "minLength"
    | "error"
    | "disabled"
  > {
  filterComponent?: JSX.Element;
  itemComponent: (row: any, index: number) => JSX.Element;
  params?: TParams;
  setParams?: (newParams: TParams) => void;
  /**
   *
   * @function onGetData is useCallback function
   * @returns
   */
  onGetData: (
    params?: TParams,
  ) => Promise<
    | AxiosResponse<TMultiResponse<any>, any>
    | { data: null; error: Error }
    | { data: null; error: { name: string } }
  >;
  containerSx?: SxProps<Theme>;
  orderingOptions?: TSelectOption[];
  rightHeaderChildren?: React.ReactNode;
  filterDrawer?: (params: TParams, setParams: (params: TParams) => void) => React.ReactNode;
  itemHeight: number;
  searchPlaceholder?: string;
}

const MTableWrapper = (props: MTableProps) => {
  const {
    filterComponent,
    itemComponent,
    params,
    setParams,
    onGetData,
    onSearch,
    containerSx,
    orderingOptions,
    rightHeaderChildren,
    filterDrawer,
    itemHeight,
    searchPlaceholder,
  } = props;

  const { newCancelToken } = useCancelToken([params]);
  const [openFilter, setOpenFilter] = useState(false);
  const [drawerParams, setDrawerParams] = useState<TParams>({});

  const [data, setData] = useState<TDGridData<any>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await onGetData({ ...params, cancelToken: newCancelToken() });
    if (result?.data) {
      const { count = 0, results = [] } = result.data;
      setData((prev) => {
        const resultByPage = params?.page === 1 ? results : [...prev.data, ...results];
        return { data: resultByPage, count, loading: false };
      });
      return;
    }
    if (result.error.name === CANCEL_REQUEST) {
      return;
    }

    setData((prev) => ({ ...prev, loading: false }));
  }, [params, newCancelToken, onGetData]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (openFilter) {
      setDrawerParams({ ...params });
    } else {
      setDrawerParams({});
    }
  }, [openFilter, params]);

  return (
    <Stack gap={0.5} position={"relative"} sx={containerSx} className="table-wrapper">
      <Box my={1}>
        <Stack direction="row" alignItems={"center"}>
          <SearchField onSearch={onSearch} fullWidth placeholder={searchPlaceholder} />
          <MSortButton
            setOrdering={(ordering) => setParams?.({ ...params, ordering })}
            ordering={params?.ordering as string}
            orderingOptions={orderingOptions}
          />
          {rightHeaderChildren}
        </Stack>
        {(filterDrawer || filterComponent) && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={1.5}
            overflow={"auto"}
            whiteSpace={"nowrap"}
            sx={{
              height: 40,
              "::-webkit-scrollbar": {
                height: 2,
              },
              ".MuiBadge-badge": {
                fontSize: "0.7rem",
                height: 14,
              },
            }}
          >
            {filterDrawer && (
              <>
                <FilterAltIcon color="secondary" onClick={() => setOpenFilter(true)} />
                <Drawer
                  anchor={"right"}
                  open={openFilter}
                  onClose={() => setOpenFilter(false)}
                  sx={{
                    zIndex: ZINDEX_SYSTEM.drawer,
                    ".MuiPaper-root": { width: "100%" },
                    position: "relative",
                  }}
                >
                  <Box position={"absolute"} top={0} width={"100%"} zIndex={1}>
                    <Stack height={40} direction={"row"} alignItems={"center"} spacing={1}>
                      <KeyboardArrowLeftIcon onClick={() => setOpenFilter(false)} />
                      <Typography>{LABEL.FILTER}</Typography>
                    </Stack>
                    <Divider />
                  </Box>
                  <Box p={2} my={5} sx={{ overflowY: "auto", height: "100%" }}>
                    {filterDrawer(drawerParams, setDrawerParams)}
                  </Box>
                  <Box position={"absolute"} bottom={0} width={"100%"}>
                    <Divider />
                    <Stack height={40} direction={"row"} alignItems={"center"}>
                      <Box
                        sx={{ width: "50%" }}
                        // bgcolor="error.main"
                        height={40}
                        onClick={() => setOpenFilter(false)}
                      >
                        <Typography lineHeight={2.5} textAlign={"center"}>
                          {BUTTON.CLOSE}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ width: "50%" }}
                        bgcolor="secondary.main"
                        height={40}
                        onClick={() => {
                          setParams?.({ ...params, ...drawerParams, page: 1 });
                          setOpenFilter(false);
                        }}
                      >
                        <Typography
                          color={(theme) => theme.palette.background.paper}
                          lineHeight={2.5}
                          textAlign={"center"}
                        >
                          {BUTTON.APPLY}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Drawer>
              </>
            )}
            {filterComponent}
          </Stack>
        )}
      </Box>
      {!data.data.length ? (
        data.loading ? (
          <Stack spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </Stack>
        ) : (
          <NoDataPanel showImage />
        )
      ) : (
        <Stack gap={1} position={"relative"}>
          {/* {data.loading && <LoadingModal fixed />} */}
          {/* {data.data.map((item, index) => {
            return <Box key={index}>{itemComponent(item, index)}</Box>;
          })} */}
          <VirtualizedList
            data={data.data}
            itemComponent={itemComponent}
            count={data.data.length >= data.count ? data.count : data.data.length + 2}
            totalCount={data.count}
            setPage={(newPage) => setParams?.({ ...params, page: newPage })}
            page={(params?.page as number) || 0}
            limit={(params?.limit as number) || 0}
            itemHeight={itemHeight}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default MTableWrapper;

const ProductSkeleton = () => {
  return (
    <Stack spacing={1} direction={"row"} alignItems={"center"}>
      <Skeleton variant="circular" height={40} width={40} />
      <Stack spacing={0.5} width={"100%"}>
        <Skeleton variant="rectangular" height={18} />
        <Skeleton variant="rounded" height={18} />
      </Stack>
    </Stack>
  );
};
