import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { orderApi } from "apis/order";
import { TableWrapper } from "components/Table";
import {
  TOP_TELESALE_BY_REVENUE_COLUMNS,
  TOP_TELESALE_BY_REVENUE_COLUMN_WIDTH,
} from "constants/dashboard/columnts";
import { DASHBOARD_LABEL } from "constants/dashboard/label";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import useTable from "hooks/useTable";
import { useCallback, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import MTopSale from "./MTopSales";

type Props = {
  params: TParams;
};

export interface TReportSale {
  modified_by: string;
  sale_name: string;
  total_order: number;
  total_revenue: number;
}

const TopTelesaleTable = (props: Props) => {
  const tableProps = useTable({
    columns: TOP_TELESALE_BY_REVENUE_COLUMNS,
    columnWidths: TOP_TELESALE_BY_REVENUE_COLUMN_WIDTH,
  });
  const { tableLayout } = useSettings();
  const isDesktop = useResponsive("up", "sm");

  const [data, setData] = useState<TDGridData<TReportSale>>({ count: 0, data: [], loading: false });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const res = await orderApi.get<TReportSale>({
      endpoint: "reports/revenue/sale",
      params: { ...props.params, ordering: "-total_revenue", limit: 15, page: 1 },
    });
    if (res.data) {
      const { results = [], count = 0 } = res.data;
      setData((prev) => ({ ...prev, data: results, count, loading: false }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [props.params]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent sx={{ padding: 0 }}>
        <Typography fontSize={18} fontWeight={"bold"} m={2}>
          {DASHBOARD_LABEL.top_telesale_by_revenue}
        </Typography>
        {isDesktop ? (
          <TableWrapper
            {...tableProps}
            heightTable={data.data.length > 3 ? 690 : 350}
            cellStyle={{ height: tableLayout === "group" ? 160 : SIMPLE_CELL_HEIGHT }}
            data={data}
            hiddenPagination
          />
        ) : (
          <MTopSale listSales={data.data} loading={data.loading} />
        )}
      </CardContent>
    </Card>
  );
};

export default TopTelesaleTable;
