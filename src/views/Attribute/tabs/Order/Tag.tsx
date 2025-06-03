import { orderApi } from "apis/order";
import { ORDER_LABEL } from "constants/order/label";
import { useCallback, useEffect, useState } from "react";
import AttributeService from "./AttributeService";

const OrderTag = () => {
  const [tags, setTags] = useState<{ data: { id: string; name: string }[]; loading: boolean }>({
    data: [],
    loading: false,
  });

  const getTags = useCallback(async () => {
    setTags((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.get<{ id: string; name: string }>({
      endpoint: "tags/",
      params: { limit: 200, page: 1 },
    });
    if (result?.data) {
      setTags((prev) => ({ ...prev, data: result.data.results }));
    }
    setTags((prev) => ({ ...prev, loading: false }));
  }, []);

  useEffect(() => {
    getTags();
  }, [getTags]);

  return (
    <AttributeService
      data={tags.data}
      loading={tags.loading}
      setData={setTags}
      attributeName="tags"
      title={ORDER_LABEL.tags}
      endpoint="tags"
    />
  );
};

export default OrderTag;
