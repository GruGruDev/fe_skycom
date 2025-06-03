import AbstractFilterItem, { Operator } from "./AbstractFilterItem";

class FilterItem extends AbstractFilterItem {
  id: string;
  columnId?: string;
  key?: string;
  operator?: Operator;
  value?: any;
  constructor(
    id: string,
    columnId: string,
    key: string,
    operator: Operator | undefined,
    value: any,
  ) {
    super(id, columnId, key, operator, value);
    this.id = id;
    this.columnId = columnId;
    this.key = key;
    this.operator = operator;
    this.value = value;
  }
}

export default FilterItem;
