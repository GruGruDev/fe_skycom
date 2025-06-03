import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import HandlerImage from "components/Images/HandlerImage";
import { GridLineLabel, Span } from "components/Texts";
import { PRODUCT_LABEL } from "constants/product/label";
import { TComboVariant, VARIANT_TYPE } from "types/Product";
import { TStyles } from "types/Styles";
import { redirectVariantUrl } from "utils/product/redirectUrl";

const COLUMN_NAMES = ["general_info"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const GeneralInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row = {} }: { row?: Partial<TComboVariant> }) => {
    const { name, SKU_code, bar_code, id, images, type, quantity } = row;

    return (
      <Stack spacing={2} direction="row" alignItems="center">
        <Stack position={"relative"}>
          {quantity && (
            <Span color="secondary" style={styles.quantity}>
              {quantity}
            </Span>
          )}
          <HandlerImage
            width={71}
            height={72}
            preview
            style={styles.image}
            value={images}
            onlyOne
          />
        </Stack>
        <Stack spacing={0.5}>
          {type === VARIANT_TYPE.COMBO && (
            <Span color="secondary" style={styles.combo}>
              Combo
            </Span>
          )}

          <GridLineLabel
            label={`${PRODUCT_LABEL.variant_name}:`}
            value={
              <Link href={`${document.location.origin}${redirectVariantUrl(id)}`} fontWeight="bold">
                {name}
              </Link>
            }
          />
          <GridLineLabel label={`${PRODUCT_LABEL.variant_SKU_code}:`} value={SKU_code} />
          <GridLineLabel label={`${PRODUCT_LABEL.bar_code}:`} value={bar_code} />
        </Stack>
      </Stack>
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

export default GeneralInfoColumn;

const styles: TStyles<"quantity" | "image" | "combo"> = {
  quantity: { position: "absolute", top: 0, left: 79, zIndex: 1 },
  image: { objectFit: "cover" },
  combo: { width: "fit-content" },
};
