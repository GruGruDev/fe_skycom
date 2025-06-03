import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Button from "@mui/material/Button";
import { orderApi } from "apis/order";
import SheetModal from "components/Sheet/SheetModal";
import { BUTTON } from "constants/button";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useState } from "react";
import { OrderDTOV2, TOrderV2 } from "types/Order";
import { TVariantDetail } from "types/Product";
import { SheetModalType } from "types/Sheet";
import { TStyles } from "types/Styles";
import { checkPermission } from "utils/roleUtils";

const COLUMN_NAMES = ["export_sheet"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  onRefresh?: () => void;
}

const AddSheetColumn = ({ for: columnNames = [], onRefresh, ...props }: Props) => {
  const Formatter = ({ row = {} }: { row?: Partial<TOrderV2> }) => {
    const isCompleted = row.status === "completed";
    const { newCancelToken } = useCancelToken();
    const { user } = useAuth();

    const [sheetModal, setSheetModal] = useState<Partial<SheetModalType>>({
      isOpen: false,
    });
    const [lineItems, setLineItems] = useState<Partial<TVariantDetail>[]>([]);

    const getOrderByID = useCallback(async () => {
      if (!sheetModal.isOpen) return [];
      if (row?.id) {
        const res = await orderApi.getById<OrderDTOV2>({
          endpoint: `${row?.id}/`,
          params: { cancelToken: newCancelToken() },
        });
        if (res?.data) {
          const lineItems = reduce(
            res.data.line_items,
            (prev: Partial<TVariantDetail>[], cur) => {
              return [...prev, { ...cur, ...cur.variant }];
            },
            [],
          );
          setLineItems(lineItems);
          return;
        }
        setLineItems([]);
      }
    }, [newCancelToken, row?.id, sheetModal.isOpen]);

    useEffect(() => {
      getOrderByID();
    }, [getOrderByID]);

    const sheetRole = checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_SHEET],
      user,
    ).isReadAndWrite;

    return (
      <>
        {row?.id && sheetRole && !row.sheet?.length && (
          <SheetModal
            open={sheetModal.isOpen}
            onClose={() => setSheetModal({ isOpen: false })}
            variants={lineItems}
            onRefresh={onRefresh}
            defaultType="EP"
            defaultOrder={row}
          />
        )}
        <Button
          variant="contained"
          onClick={() => setSheetModal((prev) => ({ ...prev, isOpen: true }))}
          size="small"
          style={styles.button}
          disabled={!row?.id || !sheetRole || !!row.sheet?.length || !isCompleted}
        >
          {BUTTON.ADD}
        </Button>
      </>
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

export default AddSheetColumn;

const styles: TStyles<"button"> = {
  button: { boxShadow: "none" },
};
