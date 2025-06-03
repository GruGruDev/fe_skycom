import { productApi } from "apis/product";
import { WrapPage } from "components/Page";
import { LinkColumn, TableWrapper } from "components/Table";
import { HeaderWrapper } from "components/Table/Header";

import { SIMPLE_CELL_HEIGHT } from "constants/index";
import {
  ORDER_REPORT_VARIANT_REVENUE_COLUMN_WIDTHS,
  ORDER_REPORT_VARIANT_REVENUE_COLUMNS,
} from "constants/order/columns";
import { ORDER_LABEL } from "constants/order/label";
import { YYYY_MM_DD } from "constants/time";
import dayjs from "dayjs";
import useSettings from "hooks/useSettings";
import useTable from "hooks/useTable";
import { useCallback, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TImage } from "types/Media";
import { compareDateSelected } from "utils/date";

export interface TReportProduct {
  SKU_code: string;
  bar_code: string;
  id: string;
  images: TImage[];
  inventory_quantity: number;
  name: string;
  revenue: number;
  sold_quantity: number;
}

const ReportVariantRevenue = () => {
  const { setParams, params, ...tableProps } = useTable({
    columns: ORDER_REPORT_VARIANT_REVENUE_COLUMNS,
    columnWidths: ORDER_REPORT_VARIANT_REVENUE_COLUMN_WIDTHS,
    params: {
      limit: 30,
      page: 1,
      ordering: "-revenue",
      completeTimeValue: -1,
      complete_time_from: dayjs(new Date()).startOf("month").format(YYYY_MM_DD),
      complete_time_to: dayjs(new Date()).format(YYYY_MM_DD),
    },
    storageKey: "REPORT_VARIANT_REVENUE",
  });
  const { tableLayout } = useSettings();

  const [data, setData] = useState<TDGridData<TReportProduct>>({
    count: 0,
    data: [],
    loading: false,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await productApi.get<TReportProduct>({
      endpoint: "variants/revenue",
      params,
    });
    if (res.data) {
      const { results = [], count = 0 } = res.data;
      setData((prev) => ({ ...prev, data: results, count, loading: false }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [params]);

  useEffect(() => {
    getData();
  }, [getData]);

  const dateParams = params as { [key: string]: string | undefined };

  return (
    <WrapPage>
      <HeaderWrapper
        onRefresh={getData}
        onSearch={(value) => setParams?.({ ...params, search: value })}
        params={params}
        setParams={setParams}
        columns={tableProps.columns}
        filterOptions={[
          {
            type: "time",
            timeProps: {
              label: ORDER_LABEL.complete_time,
              handleSubmit: (from: string, to: string, value: string | number) => {
                const { date_from, date_to, value: toValue } = compareDateSelected(from, to, value);

                setParams?.({
                  ...params,
                  complete_time_from: date_from,
                  complete_time_to: date_to,
                  completeTimeValue: toValue,
                });
              },
              defaultDateValue: dateParams?.completeTimeValue,
              created_from: dateParams?.complete_time_from,
              created_to: dateParams?.complete_time_to,
              size: "small",
              standard: true,
            },
          },
        ]}
        filterChipOptions={[
          {
            type: "date",
            dateFilterKeys: [
              {
                title: ORDER_LABEL.date_confirm,
                keyFilters: [
                  {
                    label: "complete_time_from",
                    color: "#91f7a4",
                    title: ORDER_LABEL.date_confirm_from,
                  },
                  {
                    label: "complete_time_to",
                    color: "#91f7a4",
                    title: ORDER_LABEL.date_confirm_to,
                  },
                  { label: "completeTimeValue" },
                ],
              },
            ],
          },
        ]}
      />
      <TableWrapper
        {...tableProps}
        params={params}
        setParams={setParams}
        heightTable={data.data.length > 3 ? 690 : 350}
        cellStyle={{ height: tableLayout === "group" ? 160 : SIMPLE_CELL_HEIGHT }}
        data={data}
      >
        <LinkColumn
          for={["name"]}
          linkFromRow={(row) => `${window.location.origin}/product/variant/${row?.id}`}
        />
      </TableWrapper>
    </WrapPage>
  );
};

export default ReportVariantRevenue;
