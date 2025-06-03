import { orderApi } from "apis/order";
import Pivot from "components/Pivot";
import map from "lodash/map";
import StatusColumn from "components/Table/columns/StatusColumn";
import { alpha, useTheme } from "@mui/material";
import { ORDER_STATUS } from "constants/order";
import { ORDER_REPORT_DIMENTIONS, ORDER_REPORT_METRICS } from "constants/order/columns";
import { useState } from "react";
import { TParams } from "types/Param";
import { TSelectOption } from "types/SelectOption";
import { searchAlgorithm, toSimplest } from "utils/strings";
import { PaletteColor } from "types/Styles";
import { AirTableColumnTypes } from "components/Pivot/Filter/types";
import useAddressHook from "hooks/useAddressHook";
import { ORDER_LABEL } from "constants/order/label";
import { findOption } from "utils/option";

const END_DIMENSION_COLUMN = { name: "created_date", title: ORDER_LABEL.created };

const OPTION_COLUMNS: { columnName: string; options: TSelectOption[] }[] = [
  { columnName: "status", options: ORDER_STATUS },
];

const ReportOrder = () => {
  const { provinces } = useAddressHook();
  const theme = useTheme();

  const [data, setData] = useState<
    { [key in keyof typeof ORDER_REPORT_METRICS]: string | number }[]
  >([]);

  const [dataCompare, setDataCompare] = useState<
    { [key in keyof typeof ORDER_REPORT_METRICS]: string | number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const getReport = async (params: TParams) => {
    setLoading(true);

    const result = await orderApi.get<{
      [key in keyof typeof ORDER_REPORT_METRICS]: string | number;
    }>({
      endpoint: `reports/pivot`,
      params,
    });
    if (result?.data) {
      const { results = [] } = result.data;
      setData(results);
    }
    setLoading(false);
  };

  const getReportCompare = async (params: TParams, isReset?: boolean) => {
    if (isReset) {
      setDataCompare([]);
      return;
    }
    setLoading(true);

    const result = await orderApi.get<{
      [key in keyof typeof ORDER_REPORT_METRICS]: string | number;
    }>({
      endpoint: `reports/pivot/compare`,
      params,
    });
    if (result?.data) {
      const { results = [] } = result.data;
      setData(results);
    }
    setLoading(false);
  };

  const isMatchOptions = ({
    options,
    filterValue,
    rowValue,
  }: {
    options: TSelectOption[];
    filterValue: string;
    rowValue: string;
  }) => {
    let result = true;
    const simpleFilterValue = toSimplest(filterValue);
    const orderItem = findOption(options, rowValue, "value");
    const isMatchOrderStatus = searchAlgorithm(toSimplest(orderItem?.label), simpleFilterValue);

    result = !!isMatchOrderStatus;

    return result;
  };

  const onFilterColumnExtensions = (filter: {
    rowValue: string;
    columnName: string;
    filterValue: string;
  }) => {
    let result = true;
    const { columnName, filterValue, rowValue } = filter;

    const matchColumn = findOption(OPTION_COLUMNS, columnName, "columnName");
    if (matchColumn) {
      return isMatchOptions({ options: matchColumn.options, filterValue, rowValue });
    }
    return result;
  };

  const dimensionFilterColumns = map(ORDER_REPORT_DIMENTIONS, (item) => {
    let choiceData;
    const filterColumn = findOption(OPTION_COLUMNS, item.name, "columnName");
    if (filterColumn) {
      choiceData = map(filterColumn?.options, (option) => {
        // thêm color cho các filter như trạng thái, trạng thái vận đơn...
        const optionThemeColor: PaletteColor = option?.color || "info";
        return {
          name: option.label,
          id: option.value as string,
          color: alpha(theme.palette[optionThemeColor].main, 0.16),
        };
      });
    } else {
      switch (item.name) {
        case "province":
          choiceData = map(provinces, (option) => ({
            id: option.code || option.slug,
            name: option.name,
          }));
          break;
      }
    }

    return {
      width: 200,
      name: item.title || item.name,
      key: item.name,
      id: item.name,
      type: item.filterType || AirTableColumnTypes.NUMBER,
      options: {
        choices: choiceData,
      },
    };
  });

  return (
    <Pivot
      endDemensionColumn={END_DIMENSION_COLUMN}
      endDemensionColumnWidth={{ columnName: "created_date", width: 200 }}
      data={{ count: data.length, dataCompare, data }}
      dimensions={ORDER_REPORT_DIMENTIONS}
      metrics={ORDER_REPORT_METRICS}
      loading={loading}
      getReport={getReport}
      getReportCompare={getReportCompare}
      onFilterColumnExtensions={onFilterColumnExtensions}
      filterColumnExtensions={OPTION_COLUMNS}
      dimensionFilterColumns={dimensionFilterColumns}
    >
      {OPTION_COLUMNS.map((item) => (
        <StatusColumn options={item.options} for={[item.columnName]} key={item.columnName} />
      ))}
    </Pivot>
  );
};

export default ReportOrder;
