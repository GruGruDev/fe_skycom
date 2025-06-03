import { TableWrapper } from "components/Table";
import { AttributeColumn, LinkColumn } from "components/Table/columns";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { TDGrid } from "types/DGrid";
import { redirectMaterialUrl, redirectVariantUrl } from "utils/product/redirectUrl";
import AddVariantColumn from "./columns/AddVariantColumn";
import CommisionValue from "./columns/CommissionValue";
import GeneralInfoColumn from "./columns/GeneralInfoColumn";
import ListVariantColumn from "./columns/ListVariantColumn";
import PriceInfoColumn from "./columns/PriceInfoColumn";
import ProductNameColumn from "./columns/ProductNameColumn";
import ShapeInfoColumn from "./columns/ShapeInfoColumn";
import VariantSheetColumn from "./columns/VariantSheetColumn";

export interface ProductTableType extends Partial<TDGrid> {
  onRefresh?: () => void;
}

const Table = (props: ProductTableType) => {
  const { supplier, tags } = useAppSelector(getDraftSafeSelector("product")).attributes;
  return (
    <TableWrapper {...props}>
      <VariantSheetColumn onRefresh={props.onRefresh} />
      <ProductNameColumn />
      <GeneralInfoColumn />
      <PriceInfoColumn />
      <ListVariantColumn />
      <ShapeInfoColumn />
      <LinkColumn
        for={["name"]}
        linkFromRow={(row) =>
          row.product
            ? `${window.location.origin}${redirectVariantUrl(row?.id)}`
            : `${window.location.origin}${redirectMaterialUrl(row?.id)}`
        }
      />

      <LinkColumn
        for={["order_key"]}
        linkFromRow={(row) => `${window.location.origin}/orders/${row?.id}`}
      />
      <AttributeColumn attributes={supplier} for={["supplier"]} />
      <AttributeColumn attributes={tags} for={["tags"]} />
      <AddVariantColumn onRefresh={props.onRefresh} />
      <CommisionValue />
      {props.children}
    </TableWrapper>
  );
};

export default Table;
