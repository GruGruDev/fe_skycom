import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LABEL } from "constants/label";
import { useEffect, useRef, useState } from "react";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

const VirtualizedList = ({
  data,
  count,
  itemComponent,
  setPage,
  page,
  totalCount,
  limit,
  itemHeight = 50,
}: {
  data: any[];
  count: number;
  totalCount: number;
  itemComponent: (row: any, index: number) => JSX.Element;
  page: number;
  limit: number;
  itemHeight: number;
  setPage: (page: number) => void;
}) => {
  const [itemStatusMap, setItemStatusMap] = useState<number>(limit);
  const parentRef = useRef(null);
  const [parentHeight, setParentHeight] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      setParentHeight((parentRef.current as any).clientHeight);
    }
  }, []);

  useEffect(() => {
    if (page === 1) {
      setItemStatusMap(limit);
    }
  }, [page, limit]);

  return (
    <Box
      sx={{
        ".list-virtual": {
          "::-webkit-scrollbar": {
            width: 0,
          },
        },
        height: "calc(100vh - 234px)",
        "::-webkit-scrollbar": {
          width: 0,
        },
      }}
      ref={parentRef}
    >
      <InfiniteLoader
        isItemLoaded={(index) => index < itemStatusMap}
        itemCount={count}
        loadMoreItems={(_, stopIndex) => {
          if (stopIndex > limit * page && itemStatusMap <= limit * page && limit * page < count) {
            setItemStatusMap(limit * page);
            setPage(page + 1);
          }
        }}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            className="list-virtual"
            height={parentHeight}
            // height={1000}
            itemCount={count}
            itemSize={itemHeight}
            width={"100%"}
            onItemsRendered={onItemsRendered}
            ref={ref}
          >
            {({ index, style }) => (
              <div style={style}>
                {data[index] ? itemComponent(data[index], index) : <Loading />}
              </div>
            )}
          </FixedSizeList>
        )}
      </InfiniteLoader>
      {limit * page > totalCount && (
        <Typography width={"100%"} textAlign={"center"} fontSize={"0.7rem"}>
          {LABEL.SHOW_FULL_DATA}
        </Typography>
      )}
    </Box>
  );
};

export default VirtualizedList;

const Loading = () => {
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
