import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Button from "@mui/material/Button";
import SheetModal from "components/Sheet/SheetModal";
import { BUTTON } from "constants/button";
import { ROLE_PRODUCT, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { TVariant } from "types/Product";
import { SheetModalType } from "types/Sheet";
import { TStyles } from "types/Styles";
import { checkPermission } from "utils/roleUtils";

const COLUMN_NAMES = ["variant_sheet"];

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

const VariantSheetColumn = ({ for: columnNames = [], onRefresh, ...props }: Props) => {
  const Formatter = ({ row = {} }: { row?: Partial<TVariant> }) => {
    const [sheetModal, setSheetModal] = useState<Partial<SheetModalType>>({
      isOpen: false,
    });
    const { user } = useAuth();

    const isHandle = checkPermission(
      user?.role?.data?.[ROLE_TAB.PRODUCT]?.[ROLE_PRODUCT.HANDLE],
      user,
    ).isReadAndWrite;

    return (
      <>
        <SheetModal
          open={sheetModal.isOpen}
          onClose={() => setSheetModal({ isOpen: false })}
          variants={[row]}
          onRefresh={onRefresh}
        />
        <Button
          variant="contained"
          onClick={() => setSheetModal((prev) => ({ ...prev, isOpen: true }))}
          size="small"
          style={styles.button}
          disabled={!row?.id || !isHandle}
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

export default VariantSheetColumn;

const styles: TStyles<"button"> = {
  button: { boxShadow: "none" },
};
