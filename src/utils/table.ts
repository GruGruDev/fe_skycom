import { ChangeSet, Sorting } from "@devexpress/dx-react-grid";
import {
  HEIGHT_DEVICE,
  HEIGHT_HEADER_BAR_APP,
  HEIGHT_PAGINATION_TABLE,
  WIDTH_DEVICE,
} from "constants/index";
import produce from "immer";
import { DIRECTION_SORT_TYPE } from "types/Sort";
import { validate } from "utils/formValidation";
import { forOf } from "./forOf";

export const BOTTOM_PAGE_HEIGHT = 45; // độ cao dòng license
const PROCCESS_HEIGHT = 140; // trừ thêm proccess height để khi kéo xuống cuối bảng vẫn có thể thấy loading của table
const LAYOUT_PADDING_WIDTH = 130;
const TAB_PANNEL_WIDTH = 180;
const SIDEBAR_WIDTH = 200;

export const handleSizeTable = (isDesktop?: boolean, vertical?: boolean, isCollapse?: boolean) => {
  const heightDefault =
    HEIGHT_DEVICE -
    (isDesktop ? 0 : HEIGHT_HEADER_BAR_APP) -
    HEIGHT_PAGINATION_TABLE -
    BOTTOM_PAGE_HEIGHT -
    PROCCESS_HEIGHT;
  const widthDefault =
    WIDTH_DEVICE -
    LAYOUT_PADDING_WIDTH -
    (vertical ? TAB_PANNEL_WIDTH : 0) -
    (isCollapse ? 0 : SIDEBAR_WIDTH);

  return { height: heightDefault, width: widthDefault };
};

export const handleSubmitRowChanges = ({
  changes,
  data,
  rules,
  validationStatus,
  setTableData,
  setValidationStatus,
  getRow,
}: {
  changes: ChangeSet;
  data: any[];
  setTableData: (data: any) => void;
  setValidationStatus: (validation: { [key: string]: unknown }) => void;
  rules: { [key: string]: any };
  validationStatus: { [key: string]: any };
  getRow: (item: any) => any;
}) => {
  const { changed, added, deleted } = changes;
  if (added || deleted) {
    let newData = [...data];
    if (added) {
      const newRow = getRow(added[0]);
      newData = [newRow, ...data];
    }

    if (deleted) {
      newData.splice((deleted as number[])[0], 1);
    }

    let validateValue: { [key: string]: unknown } = {};

    forOf(newData, (item, idx) => {
      validateValue = {
        ...validateValue,
        ...validate(
          {
            [idx]: getRow(item),
          },
          validateValue,
          rules,
        ),
      };
    });

    setTableData(newData);
    setValidationStatus(validateValue);
  }
  if (changed) {
    const newData = handleChageRow(changed, data);

    setValidationStatus(validate(changed, validationStatus, rules));
    setTableData(newData);
  }
};

export const commitChangesRow = <T>({ changed }: { changed?: { [key: string]: any } }, data: any) =>
  handleChageRow<T>(changed, data);

const handleChageRow = <T>(objData: any, data: any): T => {
  return produce(data, (draft: any) => {
    const index = Object.keys(objData)[0];
    if (objData[index] !== undefined) {
      draft[index] = {
        ...draft[index],
        ...objData[index],
      };
    }
  }) as T;
};

export const handleChangeSortingTableToParams = (value: Sorting[]) => {
  const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

  return { ordering };
};

export const handleChangeParamsToSortingTable = (ordering?: string): Sorting[] | undefined => {
  if (ordering) {
    const orderingClone = ordering;
    const direction = orderingClone.slice(0, 1);
    if (direction === "-") {
      return [{ columnName: orderingClone.slice(1), direction: DIRECTION_SORT_TYPE.DESC }];
    }
    return [{ columnName: orderingClone, direction: DIRECTION_SORT_TYPE.ASC }];
  }
  return undefined;
};

export const heightTableByDataLength = (length: number, rowLineHeight: number = 86) => {
  const NODATA_PANNEL_HEIGHT = 200;
  const tableHeight =
    length * rowLineHeight + NODATA_PANNEL_HEIGHT < 678
      ? length * rowLineHeight + NODATA_PANNEL_HEIGHT
      : 678;
  return tableHeight;
};
