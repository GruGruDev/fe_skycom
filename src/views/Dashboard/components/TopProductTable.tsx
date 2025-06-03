import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { orderApi } from "apis/order";
import { TableWrapper } from "components/Table";
import {
  TOP_PRODUCT_BY_REVENUE_COLUMNS,
  TOP_PRODUCT_BY_REVENUE_COLUMN_WIDTH,
} from "constants/dashboard/columnts";
import { DASHBOARD_LABEL } from "constants/dashboard/label";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import useTable from "hooks/useTable";
import { useCallback, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import MTopProduct from "./MTopProduct";
import { TImage } from "types/Media";

type Props = {
  params: TParams;
};

export interface TReportProduct {
  SKU_code: string;
  total_price: number;
  total_quantity: number;
  variant_id: string;
  variant_name: string;
  variant_type: string;
  images?: TImage[];
}

const TopProductTable = (props: Props) => {
  const tableProps = useTable({
    columns: TOP_PRODUCT_BY_REVENUE_COLUMNS,
    columnWidths: TOP_PRODUCT_BY_REVENUE_COLUMN_WIDTH,
  });
  const { tableLayout } = useSettings();
  const isDesktop = useResponsive("up", "sm");

  const [data, setData] = useState<TDGridData<TReportProduct>>({
    count: 0,
    data: [],
    loading: false,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await orderApi.get<TReportProduct>({
      endpoint: "reports/revenue/product",
      params: { ...props.params, limit: 15, page: 1, ordering: "-total_price" },
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
          {DASHBOARD_LABEL.top_product_by_revenue}
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
          <MTopProduct listProduct={data.data} loading={data.loading} />
        )}
      </CardContent>
    </Card>
  );
};

export default TopProductTable;
