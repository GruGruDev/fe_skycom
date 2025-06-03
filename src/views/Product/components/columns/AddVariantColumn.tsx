import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Button from "@mui/material/Button";
import { BUTTON } from "constants/button";
import { ROLE_PRODUCT, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { productServices } from "services/product";
import { TProduct, VariantDTO } from "types/Product";
import { TStyles } from "types/Styles";
import { checkPermission } from "utils/roleUtils";
import { FormVariantModal } from "../FormVariantModal";

const COLUMN_NAMES = ["add_variant"];

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

const AddVariantColumn = ({ for: columnNames = [], onRefresh, ...props }: Props) => {
  const Formatter = ({ row }: { row?: TProduct }) => {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();

    const isHandle = checkPermission(
      user?.role?.data?.[ROLE_TAB.PRODUCT]?.[ROLE_PRODUCT.HANDLE],
      user,
    ).isReadAndWrite;

    const handleAddVariant = async (form: Partial<VariantDTO>) => {
      if (row?.id) {
        const res = await productServices.handleAddVariant({ ...form, product_id: row?.id });
        if (res) {
          onRefresh?.();
        }
        return res;
      }
    };

    return (
      <>
        <FormVariantModal
          handleSubmitModal={handleAddVariant}
          open={open}
          onClose={() => setOpen(false)}
          row={{ product: row?.id }}
        />
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
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

export default AddVariantColumn;

const styles: TStyles<"button"> = {
  button: { boxShadow: "none" },
};
