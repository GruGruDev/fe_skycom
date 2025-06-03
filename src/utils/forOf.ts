export const forOf = <T>(list: T[], call: (item: T, index: number) => void) => {
  for (let [index, item] of list.entries()) {
    call(item, index);
  }
};
