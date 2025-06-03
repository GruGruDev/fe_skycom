import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import HandlerImage from "components/Images/HandlerImage";
import { VariantItemProps } from "components/Product";
import { CURRENCY_UNIT } from "constants/index";
import { PRODUCT_LABEL } from "constants/product/label";
import { FieldErrors } from "react-hook-form";
import { OrderLineItemDTO } from "types/Order";
import { TStyles } from "types/Styles";
import { formatFloatToString, fShortenNumber } from "utils/number";
import { redirectVariantUrl } from "utils/product/redirectUrl";

export interface VariantProps extends VariantItemProps {
  value: Partial<OrderLineItemDTO>;
  index?: number;
  error?: FieldErrors<OrderLineItemDTO>;
  imageHeight?: number;
}

export const MVariant = (props: VariantProps) => {
  const { value = {} } = props;

  const { price_variant_logs = 0, quantity = 1, sale_price = 0, discount = 0 } = value;

  const salePrice = price_variant_logs || sale_price;
  const total = salePrice * quantity - discount * quantity;

  return (
    <>
      <Box sx={{ width: "100%", my: 1 }}>
        <Stack direction={"row"} alignItems={"center"}>
          <HandlerImage height={60} width={60} preview value={value.images} onlyOne />
          <Stack ml={1}>
            <Link
              underline="hover"
              variant="subtitle2"
              color="primary.main"
              sx={{ cursor: "pointer", fontSize: "0.82rem" }}
              href={redirectVariantUrl(value?.id)}
            >
              {value.name}
            </Link>
            <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
              <Box>
                <Typography sx={styles.price} color={"grey"}>
                  {PRODUCT_LABEL.sale_price}
                </Typography>
                <Typography sx={styles.price}>
                  {fShortenNumber(salePrice - discount)}
                  {CURRENCY_UNIT.VND}
                </Typography>
              </Box>
              <Box>
                <Typography sx={styles.price} color={"grey"}>
                  {PRODUCT_LABEL.quantity}
                </Typography>
                <Typography sx={styles.price}>{formatFloatToString(quantity)}</Typography>
              </Box>
              <Box>
                <Typography sx={styles.price} color={"grey"}>
                  {PRODUCT_LABEL.total_price}
                </Typography>
                <Typography sx={styles.price}>
                  {fShortenNumber(total)}
                  {CURRENCY_UNIT.VND}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

const styles: TStyles<
  | "quantity"
  | "mainText"
  | "price"
  | "chip"
  | "comboWrap"
  | "comboTitle"
  | "quantityItemCombo"
  | "status"
  | "deleteButton"
  | "salePrice"
  | "crossSaleCheckbox"
> = {
  crossSaleCheckbox: { padding: 4 },
  deleteButton: { minWidth: 32, padding: 2 },
  status: { width: "fit-content" },
  salePrice: { position: "absolute", top: 0, left: 8 },
  mainText: {
    lineHeight: "1.57143",
    fontSize: "0.82rem",
    fontWeight: 700,
    paddingLeft: 8,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  comboWrap: {
    border: "1px solid",
    borderColor: "#d8d8d8",
    marginTop: 8,
    marginLeft: "4%",
    borderRadius: 3,
    position: "relative",
  },
  comboTitle: {
    position: "absolute",
    fontSize: "0.82rem",
    top: -8,
    left: -1,
    padding: "0px 8px 0px 8px",
    color: "#fff",
  },
  quantityItemCombo: {
    position: "absolute",
    fontSize: "0.82rem",
    top: 12,
    right: 0,
    padding: "0px 4px 0px 4px",
    color: "#fff",
  },
  price: {
    lineHeight: "1.57143",
    fontSize: "0.82rem",
    fontWeight: 500,
    textAlign: "center",
  },
  chip: {
    width: "fit-content",
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 3,
    color: "#fff",
  },
  quantity: { position: "absolute", zIndex: 99, right: 0, top: 8 },
};
