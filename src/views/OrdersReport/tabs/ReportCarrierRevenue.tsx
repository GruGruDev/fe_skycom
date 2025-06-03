import { orderApi } from "apis/order";
import { WrapPage } from "components/Page";
import { TableWrapper } from "components/Table";
import { HeaderWrapper } from "components/Table/Header";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import {
  CARRIER_BY_REVENUE_COLUMN_WIDTH,
  CARRIER_BY_REVENUE_COLUMNS,
} from "constants/order/columns";
import { ORDER_LABEL } from "constants/order/label";
import { YYYY_MM_DD } from "constants/time";
import dayjs from "dayjs";
import useSettings from "hooks/useSettings";
import useTable from "hooks/useTable";
import { useCallback, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { compareDateSelected } from "utils/date";

export interface TReportSale {
  modified_by: string;
  sale_name: string;
  total_order: number;
  total_revenue: number;
  sale_id: string;
  total_addition_price: number;
  total_commission: number;
  total_cross_sale: number;
  total_discount: number;
  total_revenue_crm: number;
}

const ReportCarrierRevenue = () => {
  const { setParams, params, ...tableProps } = useTable({
    columns: CARRIER_BY_REVENUE_COLUMNS,
    columnWidths: CARRIER_BY_REVENUE_COLUMN_WIDTH,
    params: {
      limit: 30,
      page: 1,
      completeTimeValue: -1,
      ordering: "-total_revenue",
      complete_time_from: dayjs(new Date()).startOf("month").format(YYYY_MM_DD),
      complete_time_to: dayjs(new Date()).format(YYYY_MM_DD),
    },
    storageKey: "REPORT_CARRIER_BY_REVENUE",
  });
  const { tableLayout } = useSettings();

  const [data, setData] = useState<TDGridData<TReportSale>>({ count: 0, data: [], loading: false });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const res = await orderApi.get<TReportSale>({
      endpoint: "reports/revenue/sale",
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
        {/* <LinkColumn
          for={["sale_name"]}
          linkFromRow={(row) => `${window.location.origin}/customer/${row?.sale_id}`}
        /> */}
      </TableWrapper>
    </WrapPage>
  );
};

export default ReportCarrierRevenue;
