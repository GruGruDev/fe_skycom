import isEqual from "lodash/isEqual";
import { THistory } from "types/History";

export const handleCompareHistoryItem = <T extends THistory>({
  curItem,
  prevItem,
}: {
  curItem: T;
  prevItem: T;
}) => {
  const cur = curItem || {};
  const prev = prevItem || {};
  let changeFields: string[] = [];
  Object.keys(cur).map((item) => {
    if (!isEqual(cur[item as keyof T], prev[item as keyof T])) {
      changeFields.push(item);
    }
  });

  if (!changeFields.includes("history_user")) {
    changeFields.push("history_user");
  }

  return {
    ...cur,
    changeFields,
    history_action: cur.history_type || cur.history_action,
  };
};
