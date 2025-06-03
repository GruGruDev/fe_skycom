import { Theme } from "@emotion/react";
import { SxProps } from "@mui/material";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { orderApi } from "apis/order";
import HandlerImage from "components/Images/HandlerImage";
import { SlideTransition } from "components/SlideTransition";
import MTableWrapper from "components/Table/MTableWrapper";
import { Span } from "components/Texts";
import { LABEL } from "constants/label";
import { ORDER_SORT_OPTIONS, ORDER_STATUS, ORDER_STATUS_VALUE } from "constants/order";
import { ORDER_LABEL } from "constants/order/label";
import { YYYY_MM_DD, yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import dayjs from "dayjs";
import { MouseEvent, useCallback, useState } from "react";
import { TMOrder } from "types/Order";
import { TParams } from "types/Param";
import { fDateTime } from "utils/date";
import { fNumber, formatFloatToString } from "utils/number";
import { findOption } from "utils/option";
import OrderForm from "./OrderForm";

const MContainer = (props: {
  params?: TParams;
  setParams?: (newParams: TParams) => void;
  isFilterStatus?: boolean;
  integrate?: boolean;
}) => {
  const { params, setParams, isFilterStatus, integrate } = props;

  const getData = useCallback(async (params?: TParams) => {
    const result = await orderApi.get<TMOrder>({
      params,
      endpoint: "mobile/",
    });
    return result;
  }, []);

  return (
    <MTableWrapper
      setParams={setParams}
      params={params}
      itemComponent={(item) => <OrderItem {...item} integrate={integrate} />}
      onGetData={getData}
      onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
      filterComponent={
        <FilterComponent params={params} setParams={setParams} isFilterStatus={isFilterStatus} />
      }
      orderingOptions={ORDER_SORT_OPTIONS}
      itemHeight={162}
    />
  );
};

export default MContainer;

const OrderItem = (item: TMOrder & { integrate?: boolean }) => {
  const {
    created,
    name_shipping,
    order_key,
    phone_shipping,
    price_total_order_actual,
    status,
    variants,
    integrate = true,
  } = item;

  const [open, setOpen] = useState(false);

  const orderStatus = findOption(ORDER_STATUS, status, "value");

  return (
    <Paper elevation={1} sx={{ borderRadius: "3px" }}>
      <Dialog
        TransitionComponent={SlideTransition}
        open={open}
        maxWidth="lg"
        sx={{ ".MuiPaper-root": { width: "100%" } }}
      >
        <OrderForm row={{ id: item.id }} onClose={() => setOpen(false)} />
      </Dialog>
      <Stack spacing={1} onClick={integrate ? () => setOpen(true) : undefined}>
        <Stack
          direction={"row"}
          spacing={1}
          alignItems={"center"}
          justifyContent={"space-around"}
          sx={{
            backgroundColor: "rgb(0,0,0,0.03)",
            borderTopLeftRadius: "3px",
            borderTopRightRadius: "3px",
            py: "4px",
          }}
        >
          <Typography fontSize={"0.825rem"} color={"primary"}>
            {order_key}
          </Typography>
          <Span color={orderStatus?.color} sx={styles.chip}>
            {orderStatus?.label || "---"}
          </Span>
          <Typography fontSize={"0.825rem"}>{fDateTime(created)}</Typography>
        </Stack>
        <Stack direction={"row"} spacing={1} alignItems={"center"} sx={{ px: 1 }}>
          <Chip label={name_shipping} size="small" />
          <Chip label={phone_shipping} size="small" />
          <Chip label={fNumber(price_total_order_actual)} size="small" color="success" />
        </Stack>
        <Stack spacing={1} sx={{ p: 1 }}>
          {variants.map((variant, index) => {
            return (
              <Stack direction={"row"} spacing={1} key={index}>
                <HandlerImage value={variant.images} width={"3.5rem"} height={"3.5rem"} onlyOne />
                <Stack>
                  <Typography fontSize={"0.825rem"}>{variant.name}</Typography>
                  <Typography fontSize={"0.7rem"}>{variant.SKU_code || "SKU"}</Typography>
                  <Stack direction={"row"} spacing={1}>
                    <Chip label={formatFloatToString(variant.quantity)} size="small" />
                    <Chip label={fNumber(variant.price_total_input)} size="small" color="info" />
                  </Stack>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
};

const styles: { [key: string]: SxProps<Theme> } = {
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};

const FilterComponent = ({
  params,
  setParams,
  isFilterStatus,
}: {
  params?: TParams;
  setParams?: (newParams: TParams) => void;
  isFilterStatus?: boolean;
}) => {
  const onSetFilterToday = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setParams?.({
      ...params,
      created_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
      createdToday: true,
      createdThisMonth: undefined,
      page: 1,
    });
  };

  const onClearFilterToday = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setParams?.({
      ...params,
      created_from: undefined,
      created_to: undefined,
      createdToday: undefined,
      page: 1,
    });
  };

  const onSetFilterThisMonth = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setParams?.({
      ...params,
      created_from: dayjs(new Date()).startOf("month").format(YYYY_MM_DD),
      created_to: dayjs(new Date()).format(YYYY_MM_DD),
      createdThisMonth: true,
      createdToday: undefined,
      page: 1,
    });
  };

  const onClearFilterThisMonth = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setParams?.({
      ...params,
      created_from: undefined,
      created_to: undefined,
      createdThisMonth: undefined,
      page: 1,
    });
  };

  return (
    <>
      <Span
        sx={{ fontWeight: "500" }}
        onClick={params?.createdToday ? onClearFilterToday : onSetFilterToday}
        color={params?.createdToday ? "success" : undefined}
      >
        {LABEL.TODAY}
      </Span>
      <Span
        sx={{ fontWeight: "500" }}
        onClick={params?.createdThisMonth ? onClearFilterThisMonth : onSetFilterThisMonth}
        color={params?.createdThisMonth ? "success" : undefined}
      >
        {LABEL.THIS_MONTH}
      </Span>
      {isFilterStatus && (
        <>
          <Span
            sx={{ fontWeight: "500" }}
            onClick={() =>
              setParams?.({
                ...params,
                status: (params?.status as string)?.includes(ORDER_STATUS_VALUE.draft)
                  ? undefined
                  : [ORDER_STATUS_VALUE.draft],
                page: 1,
              })
            }
            color={
              (params?.status as string[])?.includes(ORDER_STATUS_VALUE.draft)
                ? "success"
                : undefined
            }
          >
            {ORDER_LABEL.draft}
          </Span>
          <Span
            sx={{ fontWeight: "500" }}
            onClick={() =>
              setParams?.({
                ...params,
                status: (params?.status as string)?.includes(ORDER_STATUS_VALUE.completed)
                  ? undefined
                  : [ORDER_STATUS_VALUE.completed],
                page: 1,
              })
            }
            color={
              (params?.status as string[])?.includes(ORDER_STATUS_VALUE.completed)
                ? "success"
                : undefined
            }
          >
            {ORDER_LABEL.completed}
          </Span>
          <Span
            sx={{ fontWeight: "500" }}
            onClick={() =>
              setParams?.({
                ...params,
                status: (params?.status as string)?.includes(ORDER_STATUS_VALUE.cancel)
                  ? undefined
                  : [ORDER_STATUS_VALUE.cancel],
                page: 1,
              })
            }
            color={
              (params?.status as string[])?.includes(ORDER_STATUS_VALUE.cancel)
                ? "success"
                : undefined
            }
          >
            {ORDER_LABEL.cancel}
          </Span>
        </>
      )}
    </>
  );
};
