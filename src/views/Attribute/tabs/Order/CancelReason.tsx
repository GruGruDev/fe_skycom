import { orderApi } from "apis/order";
import { ORDER_LABEL } from "constants/order/label";
import { useCallback, useEffect, useState } from "react";
import AttributeService from "./AttributeService";

const OrderCancelReason = () => {
  const [cancelReasons, setCancelReasons] = useState<{
    data: { id: string; name: string }[];
    loading: boolean;
  }>({
    data: [],
    loading: false,
  });

  const getData = useCallback(async () => {
    setCancelReasons((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.get<{ id: string; name: string }>({
      endpoint: "cancel-reason/",
      params: { limit: 200, page: 1 },
    });
    if (result?.data) {
      setCancelReasons((prev) => ({ ...prev, data: result.data.results }));
    }
    setCancelReasons((prev) => ({ ...prev, loading: false }));
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <AttributeService
      data={cancelReasons.data}
      loading={cancelReasons.loading}
      setData={setCancelReasons}
      attributeName="cancel_reason"
      endpoint="cancel-reason"
      title={ORDER_LABEL.cancel_reason}
    />
  );
};

export default OrderCancelReason;
