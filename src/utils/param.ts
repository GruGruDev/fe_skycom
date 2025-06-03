import axios from "axios";
import produce from "immer";
import isArray from "lodash/isArray";
import isBoolean from "lodash/isBoolean";
import map from "lodash/map";
import omit from "lodash/omit";
import pick from "lodash/pick";
import reduce from "lodash/reduce";
import { ColumnShowSortType, TColumn } from "types/DGrid";
import { TParams, TParamValue } from "types/Param";
import { forOf } from "./forOf";

const CancelToken = axios.CancelToken;

export const convertCancelToken = (params: any) => {
  const cancelToken = params?.cancelToken
    ? params?.cancelToken
    : new CancelToken(function () {
        return;
      });
  delete params?.cancelToken;
  delete params?.cancelRequest;

  return { cancelToken, paramsNoneCancelToken: params };
};

const ignoreKeys = [
  "dateValue",
  "defaultAssignedDate",
  "defaultProcessDate",
  "defaultCallLaterAtDate",
  "orderingParent",
  "dateValue",
];

export const formatParamsToURLUtil = (keyFilter: string[], params?: any) => {
  const paramsURL = new URLSearchParams();
  let reqPar = "";
  for (reqPar in params) {
    if (!ignoreKeys?.includes(reqPar)) {
      if (params[reqPar]) {
        if (params[reqPar] === "all") return;
        if (keyFilter.includes(reqPar)) {
          params[reqPar].length > 0 &&
            isArray(params[reqPar]) &&
            params[reqPar].map((item: string) => {
              if (item === "all") return item;
              item === "none" ? paramsURL.append(reqPar, "null") : paramsURL.append(reqPar, item);
              return item;
            });
        } else {
          paramsURL.append(reqPar, params[reqPar]);
        }
      }
    }
  }
  return paramsURL;
};

export const formatParamsToSkycomServerUtil = (keyFilter: string[], params?: any) => {
  const paramsURL = new URLSearchParams();
  let reqPar = "";
  for (reqPar in params) {
    if (params[reqPar]) {
      if (keyFilter.includes(reqPar)) {
        if (isArray(params[reqPar]) && params[reqPar].length) {
          const transferParams = [...params[reqPar]];
          const noneValueIdx = transferParams?.findIndex(
            (item: string | number) => item === "none",
          );
          if (noneValueIdx >= 0) {
            transferParams.splice(noneValueIdx, 1);
          }
          paramsURL.append(reqPar, transferParams.join(","));
        }
      } else {
        paramsURL.append(reqPar, params[reqPar]);
      }
    }
  }
  return paramsURL;
};

export const formatParamsUtilMore = (
  keyFilters: string[],
  params?: any,
  keyIgnores: string[] = ["trackingDateValue", "dateValue"],
) => {
  const paramsURL = new URLSearchParams();
  let reqPar = "";
  for (reqPar in omit(params, keyIgnores)) {
    if (reqPar === "page") {
      paramsURL.append("page", params["page"]);
    } else if (reqPar === "offset") {
      paramsURL.append("offset", params["offset"]);
    } else if (params[reqPar] || isBoolean(params[reqPar])) {
      if (keyFilters.includes(reqPar)) {
        params[reqPar].length > 0 && isArray(params[reqPar])
          ? params[reqPar].map((item: string) => {
              item === "none" ? paramsURL.append(reqPar, "null") : paramsURL.append(reqPar, item);
              return item;
            })
          : paramsURL.append(reqPar, params[reqPar]);
      } else {
        paramsURL.append(reqPar, params[reqPar]);
      }
    }
  }
  return paramsURL;
};

export const formatSelectorForQueryParams = (
  value: string | number | "all" | "none" | (string | number)[],
) => {
  let formatValue: string | undefined | number | null | (string | number)[] = value;
  if (value === "all") {
    formatValue = undefined;
  } else if (value === "none") {
    formatValue = "null";
  } else if (Array.isArray(value)) {
    formatValue = produce(value, (items) => {
      if (items.includes("none")) {
        const index = items.findIndex((item) => item === "none");
        items[index] = "null";
      }
    });
  }
  return formatValue;
};

export const revertFromQueryForSelector = (params?: TParamValue, defaultValue = "all") => {
  if (typeof params === "string" || typeof params === "number") {
    return params;
  }
  return Array.isArray(params)
    ? map(params, (element) => (element === "null" ? "null" : element))
    : defaultValue;
};

/**
 *
 * @param objParams old object params
 * @param arrItemSelect
 * @returns
 */
export const chooseParams = (objParams: any, arrItemSelect: string[] = []) => {
  let newParams: any = {};
  const newArrSelect = ["page", "limit", "ordering", ...arrItemSelect];

  for (const keyObj in objParams) {
    if (
      !newArrSelect.includes(keyObj) ||
      ["all", ""].includes(objParams[keyObj]) ||
      (Array.isArray(objParams[keyObj]) && !objParams[keyObj].length)
    ) {
      newParams = { ...newParams };
    } else {
      newParams = { ...newParams, [keyObj]: objParams[keyObj] };
    }
  }

  return newParams || {};
};

export const filterParams = (keys: string[], params?: any) => {
  const result = pick(params, keys);
  return result;
};

export const handleDeleteParam = (
  params: any,
  att: { type: string; value: string | number },
  setParams?: (params: any) => void,
) => {
  if (params?.[att.type] && params) {
    const isArray = Array.isArray(params?.[att.type]);
    if (isArray) {
      const filterForArray = params?.[att.type].filter(
        (item: string[]) => item.toString() !== att.value.toString(),
      );
      setParams &&
        setParams({
          ...params,
          [att.type]: filterForArray.length > 0 ? filterForArray : undefined,
        });
    } else {
      setParams &&
        setParams({
          ...params,
          [att.type]: undefined,
        });
    }
  }
};

export const clearParamsVar = (keysFilter: string[], params: any) => {
  const clearParams = { ...params };
  map(keysFilter, (item) => {
    if (clearParams?.[item]) {
      clearParams[item] = undefined;
    }
    return;
  });
  return clearParams;
};

export const handleParamsHeaderFilter = (params: any, arrTakeValue: string[]) => {
  return Object.keys(params).length
    ? Object.keys(params).reduce((prevObj, current) => {
        return arrTakeValue.includes(current)
          ? {
              ...prevObj,
              [current]: params[current],
            }
          : prevObj;
      }, {})
    : {};
};

export const detectOrderingLabelFromSortColumnsUtil = (
  sortKeys: ColumnShowSortType[] = [],
  ordering = "",
): { orderingKey: string; label: string; direction: "desc" | "asc"; ordering: string }[] => {
  let multiOrdering: {
    orderingKey: string;
    label: string;
    direction: "desc" | "asc";
    ordering: string;
  }[] = [];

  forOf(
    ordering.split(/,(?=\w)/).map((item, index) => (index === 0 ? item : item)),
    (ordering) => {
      const direction = ordering?.charAt(0) === "-" ? "desc" : "asc";

      const newOrdering = (
        direction === "desc" ? ordering.substring(1) : ordering
      ) as keyof typeof orderingLabels;

      let orderingLabels = {};

      orderingLabels = reduce(
        sortKeys,
        (prev, cur) => {
          const curSortLabels = reduce(
            cur.fields,
            (prevField, curField) => {
              return { ...prevField, [curField.name]: curField.title };
            },
            {},
          );
          return { ...prev, ...curSortLabels };
        },
        orderingLabels,
      );

      multiOrdering = [
        ...multiOrdering,
        {
          orderingKey: newOrdering,
          label: orderingLabels[newOrdering],
          direction,
          ordering,
        },
      ];
    },
  );
  return multiOrdering;
};

export const detectOrderingLabelFromColumnsUtil = (
  columns: TColumn[] = [],
  ordering = "",
): { orderingKey: string; label: string; direction: "desc" | "asc"; ordering: string }[] => {
  let multiOrdering: {
    orderingKey: string;
    label: string;
    direction: "desc" | "asc";
    ordering: string;
  }[] = [];

  forOf(
    ordering.split(",").map((item) => item.trim()),
    (ordering) => {
      const direction = ordering?.charAt(0) === "-" ? "desc" : "asc";

      const newOrdering = (
        direction === "desc" ? ordering.substring(1) : ordering
      ) as keyof typeof orderingLabels;

      let orderingLabels = {};

      orderingLabels = reduce(
        columns,
        (prev, cur) => {
          return { ...prev, [cur.name]: cur.title };
        },
        orderingLabels,
      );

      multiOrdering = [
        ...multiOrdering,
        {
          orderingKey: newOrdering,
          label: orderingLabels[newOrdering],
          direction,
          ordering,
        },
      ];
    },
  );
  return multiOrdering;
};

export const formatParamsUtil = (
  keyFilters: string[],
  params?: TParams,
  keyIgnores: string[] = [
    "trackingDateValue",
    "dateValue",
    "defaultAssignedDate",
    "defaultCallLaterAtDate",
    "confirmDateValue",
    "orderingParent",
    "defaultProcessDate",
  ],
) => {
  const paramsURL = new URLSearchParams();
  let reqPar = "";
  if (params) {
    for (reqPar in omit(params, keyIgnores)) {
      const value = params[reqPar] as any;
      if (value === "all") {
        continue;
      } else if (reqPar === "page") {
        const page = value as string;
        paramsURL.append("page", page);
      } else if (reqPar === "offset") {
        const offset = value as string;
        paramsURL.append("offset", offset);
      } else if (reqPar === "dimensions") {
        const dimensions = value as string[];
        const transformParams = transformParamsPivotFields(dimensions);
        paramsURL.append("dimensions", JSON.stringify(transformParams));
      } else if (reqPar === "metrics") {
        const metrics = value as string;
        paramsURL.append("metrics", JSON.stringify(metrics));
      } else if (value || isBoolean(value)) {
        if (keyFilters.includes(reqPar)) {
          isArray(value) && value.length > 0
            ? value.map((item) => {
                if (item === undefined) {
                  return item;
                }
                if (item === "all") return item;
                item === "none" ? paramsURL.append(reqPar, "null") : paramsURL.append(reqPar, item);
                return item;
              })
            : paramsURL.append(reqPar, value as string);
        } else {
          paramsURL.append(reqPar, value as string);
        }
      }
    }
  }
  return paramsURL;
};

function transformParamsPivotFields(fields: string[]) {
  return fields.map((field) => {
    const match = field.match(/^(.*?)__/);

    return match ? match[1] : field;
  });
}
