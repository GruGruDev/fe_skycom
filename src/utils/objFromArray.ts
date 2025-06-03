export function objFromArray<Type extends Record<string, any>>(array: Type[], key = "id") {
  return array.reduce<Record<string, Type>>((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}
