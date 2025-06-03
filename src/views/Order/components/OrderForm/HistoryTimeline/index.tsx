import Timeline from "@mui/lab/Timeline";
import { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { orderApi } from "apis/order";
import { warehouseApi } from "apis/warehouse";
import { NoDataPanel } from "components/NoDataPanel";
import { TitleSection } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import flatten from "lodash/flatten";
import map from "lodash/map";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useState } from "react";
import { getListInventoryReasons } from "store/redux/warehouses/action";
import { HISTORY_ACTIONS, THistoryChangeReasonRes } from "types/History";
import {
  OrderDTOV2,
  OrderPaymentDTO,
  THistoryOrder,
  TOrderStatusValue,
  TOrderV2,
} from "types/Order";
import { TSheet } from "types/Sheet";
import { handleCompareHistoryItem } from "utils/handleCompareHistoryItem";
import { onChangeHistoryFields as onChangeOrderHistoryFields } from "utils/order/onChangeHistoryFields";
import { getApiSheetEndpoint } from "utils/warehouse/getApiSheetEndpoint";
import HistoryItem from "./HistoryItem";

export type ORDER_TIMELINE_TYPE = "ORDER" | "PAYMENT" | "DELIVERY" | "SHEET";

export interface OrderHistoryType {
  histories?: THistoryChangeReasonRes[];
  history_date: string;
  history_action: HISTORY_ACTIONS;
  history_of: ORDER_TIMELINE_TYPE;
  order_status?: TOrderStatusValue;
  order_key?: string;
}

export interface OrderPaymentType extends Partial<OrderPaymentDTO>, Partial<OrderHistoryType> {}
export interface HistorySheetType
  extends Partial<Omit<TSheet, "sheet_detail" | "created_by" | "modified_by" | "type" | "order">>,
    Partial<OrderHistoryType> {}

export default function HistoryTimeline({
  order,
  onRefresh,
}: {
  order: Partial<OrderDTOV2>;
  onRefresh: () => void;
}) {
  const sheetEndpoint = getApiSheetEndpoint("EP");
  const [data, setData] = useState<
    Partial<OrderHistoryType & OrderPaymentType & HistorySheetType>[]
  >([]);
  const { users } = useAppSelector(getDraftSafeSelector("users"));

  const [countLoading, setCountLoading] = useState(0);
  const [fetchTimelineByCategory, setFetchTimelineByCategory] = useState<ORDER_TIMELINE_TYPE[]>([]);

  const getOrderHistory = useCallback(async () => {
    if (!fetchTimelineByCategory.includes("ORDER") && order.id) {
      setFetchTimelineByCategory((prev) => [...prev, "ORDER"]);

      const result = await orderApi.get<THistoryOrder>({
        params: { page: 1, limit: 200 },
        endpoint: `${order.id}/histories/`,
      });
      if (result?.data) {
        const { results = [] } = result.data;
        setCountLoading((prev) => prev + 1);

        let historyChanges: OrderHistoryType[] = [];

        results.map((item, itemIdx) => {
          if (
            item.history_type !== HISTORY_ACTIONS.ADD &&
            item.history_type !== HISTORY_ACTIONS.CREATE
          ) {
            const changeFields = handleCompareHistoryItem({
              curItem: item,
              prevItem: results[itemIdx + 1],
            }).changeFields;

            if (changeFields.length) {
              const histories = onChangeOrderHistoryFields({
                fieldChanges: changeFields,
                old: results[itemIdx + 1],
                cur: item,
              });

              if (histories.length) {
                historyChanges = [
                  ...historyChanges,
                  {
                    histories,
                    history_date: item.history_date,
                    history_action: item.history_type,
                    history_of: "ORDER",
                  },
                ];
              }
            }
          } else {
            historyChanges = [
              ...historyChanges,
              { ...item, history_action: item.history_type, history_of: "ORDER" },
            ];
          }
        });
        setData((prev) => [...flatten(historyChanges), ...prev]);
      }
    }
  }, [order.id, fetchTimelineByCategory]);

  /**
   * Format lại dữ liệu payment cần có history_date và history_action
   * Nếu có ngày xác nhận thì history_date = confirm_date và trạng thái là history_action = CONFIRM
   * Nếu không có ngày xác nhận thì làm history_date = ngày tạo của order (order.created) và trạng thái là history_action = CREATE
   */
  const handleConvertPayment = useCallback(() => {
    if (!fetchTimelineByCategory.includes("PAYMENT") && !!order.payments) {
      let paymentHistory: OrderPaymentType[] = [];

      map(order.payments, (item) => {
        setFetchTimelineByCategory((prev) => [...prev, "PAYMENT"]);
        setCountLoading((prev) => prev + 1);

        let historyDate: Date | undefined;
        historyDate = item.modified
          ? new Date(item.modified)
          : item.created
            ? new Date(item.created)
            : undefined;

        historyDate?.setSeconds(historyDate.getSeconds() + 5);

        paymentHistory = [
          ...paymentHistory,
          {
            ...item,
            history: order.payments as any,
            history_date: historyDate?.toString(),
            history_action: item.modified ? HISTORY_ACTIONS.UPDATE : HISTORY_ACTIONS.ADD,
            history_of: "PAYMENT",
            order_status: order.status,
          },
        ];
      });

      if (paymentHistory.length) setData((prev) => [...flatten(paymentHistory), ...prev]);
    }
  }, [order, fetchTimelineByCategory]);

  const getSheet = useCallback(async () => {
    if (!fetchTimelineByCategory.includes("SHEET") && order?.id) {
      setFetchTimelineByCategory((prev) => [...prev, "SHEET"]);

      const res = await warehouseApi.get<TSheet>({
        params: { page: 1, limit: 10, order_id: order.id },
        endpoint: sheetEndpoint,
      });
      setCountLoading((prev) => prev + 1);
      if (res.data) {
        const { results = [] } = res.data;
        let historyDate: Date | undefined;
        const listSheets = reduce(
          results,
          (prev: HistorySheetType[], cur) => {
            const order = cur.order as Partial<TOrderV2>;
            historyDate = cur.created ? new Date(cur.created) : undefined;
            historyDate?.setSeconds(historyDate.getSeconds() + 5);
            const sheet: HistorySheetType = {
              ...cur,
              order_status: order?.status,
              order_key: order?.order_key,
              history_date: historyDate?.toString(),
              history_action: HISTORY_ACTIONS.CREATE,
              history_of: "SHEET",
            };
            return [...prev, sheet];
          },
          [],
        );

        setData((prev) => [...flatten(listSheets), ...prev]);
      }
    }
  }, [order.id, fetchTimelineByCategory, sheetEndpoint]);

  const handleRefreshHistory = () => {
    setFetchTimelineByCategory([]);
    setCountLoading(0);
    onRefresh();
  };

  useEffect(() => {
    getListInventoryReasons();
  }, []);

  useEffect(() => {
    getOrderHistory();
  }, [getOrderHistory]);

  useEffect(() => {
    handleConvertPayment();
  }, [handleConvertPayment]);

  useEffect(() => {
    getSheet();
  }, [getSheet]);

  const sortedData = data.sort((a, b) =>
    new Date(a.history_date || "") >= new Date(b.history_date || "") ? -1 : 1,
  );

  return (
    <>
      <TitleSection>{ORDER_LABEL.history}</TitleSection>
      {countLoading !== fetchTimelineByCategory.length ? (
        <Suppense />
      ) : (
        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.2,
            },
            padding: 0,
            gap: "8px",
          }}
        >
          {sortedData.length ? (
            map(data, (item, id) => (
              <HistoryItem key={id} value={item} users={users} onRefresh={handleRefreshHistory} />
            ))
          ) : (
            <NoDataPanel showImage />
          )}
        </Timeline>
      )}
    </>
  );
}

const Suppense = () => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={300} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={300} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={300} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={300} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={300} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} width={300} />
      </Stack>
    </Stack>
  );
};
