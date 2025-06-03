import { orderApi } from "apis/order";
import { MultiSelect, MultiSelectProps, ValueSelectorType } from "components/Selectors";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useState } from "react";
import { TOrderV2 } from "types/Order";
import { TSelectOption } from "types/SelectOption";

const OrderSelectorField = (
  props: Omit<MultiSelectProps, "options" | "onChange"> & {
    order?: Partial<TOrderV2>;
    onChange: (order: Partial<TOrderV2>) => void;
  },
) => {
  const [orderParams, setOrderParams] = useState({ limit: 15, page: 1, search: "" });
  const [orders, setOrders] = useState<{
    data: Partial<TOrderV2>[];
    count: number;
    options: TSelectOption[];
  }>({ data: [], options: [], count: 0 });

  const getOrder = useCallback(async () => {
    if (props.order) return;
    const res = await orderApi.get<TOrderV2>({ params: orderParams });
    if (res.data) {
      const { results = [], count = 0 } = res.data;
      const options = reduce(
        results,
        (prev: TSelectOption[], cur) => {
          return [...prev, { label: cur.order_key || "", value: cur.id || "" }];
        },
        [],
      );
      setOrders((prev) => ({
        ...prev,
        data: [...prev.data, ...results],
        options: [...prev.options, ...options],
        count,
      }));
    }
  }, [orderParams, props.order]);

  const handleGetOrder = (input: string) => {
    if (orders.options.length > orders.count) {
      return;
    }

    if (orderParams.limit * orderParams.page >= orders.count) {
      return;
    }

    if (orderParams.search != input) {
      setOrders({ options: [], data: [], count: 0 });
    }
    setOrderParams((prev) => ({
      ...prev,
      page: input != prev.search ? 1 : prev.page + 1,
      search: input,
    }));
  };

  const onChangeOrder = (value: ValueSelectorType) => {
    const order = orders.data.find((item) => item.id === value.toString());
    if (order) {
      props.onChange(order);
    }
  };

  useEffect(() => {
    getOrder();
  }, [getOrder]);
  useEffect(() => {
    if (props.order) {
      setOrders((prev) => ({
        ...prev,
        data: [{ ...(props.order || {}) }],
        options: [{ label: props.order?.order_key || "", value: props.order?.id || "" }],
      }));
    }
  }, [props.order]);

  return (
    <MultiSelect
      {...props}
      options={orders.options}
      onChange={onChangeOrder}
      fullWidth
      simpleSelect
      outlined
      shrink
      selectorId="order-selector"
      handleGetOptions={handleGetOrder}
    />
  );
};

export default OrderSelectorField;
