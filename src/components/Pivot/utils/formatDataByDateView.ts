import { ALL_OPTION } from "constants/index";
import { RANGE_STEP_DATE_OPTIONS } from "constants/pivot";
import omit from "lodash/omit";
import reduce from "lodash/reduce";
import { TColumn } from "types/DGrid";
import { TSelectOption } from "types/SelectOption";
import { fDate } from "utils/date";
import { forOf } from "utils/forOf";

export function formatDataByDateView(
  view: TSelectOption = ALL_OPTION,
  data: any[] = [],
  columns: TColumn[] = [],
  endDimensionColumn: TColumn,
) {
  let dataByDateView: any = {};
  let result: any = data;
  data.forEach((item) => {
    const date = new Date(item[endDimensionColumn.name]);

    let endDimensionValue = `${fDate(item[endDimensionColumn.name])}`;
    let firstDay = fDate(date);
    let lastDay = fDate(date);

    switch (view.value) {
      case RANGE_STEP_DATE_OPTIONS[0].value:
        break;
      case RANGE_STEP_DATE_OPTIONS[1].value:
        firstDay = fDate(
          new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1),
        );
        lastDay = fDate(
          new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7),
        );
        endDimensionValue = `${firstDay} -> ${lastDay}`;

        result = sumMetricsByDate({
          firstDay,
          columns,
          endDimensionColumn,
          endDimensionValue,
          item,
          dataByDateView,
        });

        result = avgForEndDimensionColumn(result, 1);

        break;
      case RANGE_STEP_DATE_OPTIONS[2].value:
        firstDay = fDate(new Date(date.getFullYear(), date.getMonth(), 1));
        lastDay = fDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
        endDimensionValue = `${firstDay} -> ${lastDay}`;

        result = sumMetricsByDate({
          firstDay,
          columns,
          endDimensionColumn,
          endDimensionValue,
          item,
          dataByDateView,
        });

        result = avgForEndDimensionColumn(result, 1);

        break;
      case RANGE_STEP_DATE_OPTIONS[3].value:
        const quarterStartMonth = Math.floor(date.getMonth() / 3) * 3;

        firstDay = fDate(new Date(date.getFullYear(), quarterStartMonth, 1));
        lastDay = fDate(new Date(date.getFullYear(), quarterStartMonth + 3, 0));
        endDimensionValue = `${firstDay} -> ${lastDay}`;

        result = sumMetricsByDate({
          firstDay,
          columns,
          endDimensionColumn,
          endDimensionValue,
          item,
          dataByDateView,
        });

        result = avgForEndDimensionColumn(result, 1);

        break;
      case RANGE_STEP_DATE_OPTIONS[4].value:
        firstDay = fDate(new Date(date.getFullYear(), 0, 1));
        lastDay = fDate(new Date(date.getFullYear() + 1, 0, 0));
        endDimensionValue = `${firstDay} -> ${lastDay}`;

        result = sumMetricsByDate({
          firstDay,
          columns,
          endDimensionColumn,
          endDimensionValue,
          item,
          dataByDateView,
        });

        result = avgForEndDimensionColumn(result, 1);

        break;

      default:
        result = sumMetricsByDate({
          firstDay,
          columns,
          endDimensionColumn,
          endDimensionValue,
          item,
          dataByDateView,
        });
        break;
    }
  });

  return result;
}

// value của endDimension
const sumMetricsByDate = ({
  firstDay,
  dataByDateView,
  columns,
  endDimensionColumn,
  endDimensionValue,
  item,
}: {
  firstDay?: string | null;
  dataByDateView?: any;
  columns: TColumn[];
  endDimensionColumn: TColumn;
  endDimensionValue: string;
  item: any;
}) => {
  const dateKey = `${firstDay}`;
  if (!dataByDateView[dateKey]) {
    dataByDateView[dateKey] = {
      [endDimensionColumn.name]: item.compare
        ? `${endDimensionValue} vs ${fDate(item?.compare?.[endDimensionColumn.name])}`
        : endDimensionValue,
    };
  }

  dataByDateView[dateKey] = {
    // để show toàn bộ dữ liệu cho dòng mà không bị phụ thuộc vào cột, dữ liệu của cột sẽ được tính ở dưới
    ...omit(
      item,
      columns.map((c) => c.name),
    ),
    ...dataByDateView[dateKey],
  };

  forOf(columns, (cl) => {
    if (cl.options?.selected) {
      if (!dataByDateView[dateKey][cl.name]) {
        dataByDateView[dateKey][cl.name] = item[cl.name];
      } else {
        dataByDateView[dateKey][cl.name] += item[cl.name];
      }
    }
  });
  return Object.values(dataByDateView);
};

const avgForEndDimensionColumn = (data: any[], coefficient: number) => {
  const result = reduce(
    data,
    (prev: any[], cur) => {
      const newCur = reduce(
        Object.keys(cur),
        (prevItem: any, curItem) => {
          if (curItem.includes("avg")) {
            return { ...prevItem, [curItem]: Math.round(cur[curItem] / coefficient) };
          } else {
            return { ...prevItem, [curItem]: cur[curItem] };
          }
        },
        {},
      );
      return [...prev, newCur];
    },
    [],
  );
  return result;
};
