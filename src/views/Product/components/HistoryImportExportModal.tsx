import { FormDialog } from "components/Dialogs";
import { PRODUCT_LABEL } from "constants/product/label";
import Sheets from "views/VariantDetail/tabs/Sheets";

type Props = {
  open: boolean;
  onClose: () => void;
  variantId?: string;
};

const HistoryImportExportModal = (props: Props) => {
  const { open, onClose, variantId } = props;

  return (
    <FormDialog open={open} onClose={onClose} title={PRODUCT_LABEL.import_export_history}>
      <Sheets variantId={variantId} />
    </FormDialog>
  );
};

export default HistoryImportExportModal;
