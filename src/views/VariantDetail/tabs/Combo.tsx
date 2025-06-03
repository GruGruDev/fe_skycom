import { AttributeColumn, LinkColumn, TableWrapper } from "components/Table";
import { WrapPage } from "components/Page";
import { COMBO_VARIANT_COLUMNS, COMBO_VARIANT_COLUMN_WIDTHS } from "constants/product/combo";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useTable from "hooks/useTable";
import { TDGridData } from "types/DGrid";
import { TComboVariant } from "types/Product";
import ProductNameColumn from "views/Product/components/columns/ProductNameColumn";
import { redirectVariantUrl } from "utils/product/redirectUrl";

interface ComboProps {
  tableData?: TComboVariant[];
}

const Combo = (props: ComboProps) => {
  const { tableData = [] } = props;

  const data: TDGridData<Partial<TComboVariant>> = {
    data: tableData,
    count: tableData.length,
    loading: false,
  };

  const tableProps = useTable({
    columns: COMBO_VARIANT_COLUMNS,
    columnWidths: COMBO_VARIANT_COLUMN_WIDTHS,
  });

  const { tags } = useAppSelector(getDraftSafeSelector("product")).attributes;

  return (
    <WrapPage style={styles.wrapper}>
      <TableWrapper data={data} hiddenPagination cellStyle={{ height: 80 }} {...tableProps}>
        <LinkColumn
          for={["name"]}
          linkFromRow={(row) => `${window.location.origin}${redirectVariantUrl(row?.id)}`}
        />
        <AttributeColumn attributes={tags} for={["tags"]} />
        <ProductNameColumn for={["name"]} />
      </TableWrapper>
    </WrapPage>
  );
};

export default Combo;

const styles = {
  wrapper: { marginTop: 24 },
};
