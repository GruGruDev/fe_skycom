export const convertGroupKey = (groupKey: string) => {
  let itemKey = groupKey;

  if (groupKey.includes("_id")) {
    const dimensionName = groupKey.slice(0, -2);
    itemKey = `${dimensionName}name`;
  }
  return itemKey;
};
