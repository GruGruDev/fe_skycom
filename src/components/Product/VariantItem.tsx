import DeleteIcon from "@mui/icons-material/Delete";
import { SxProps, Theme, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import ListItemIcon from "@mui/material/ListItemIcon";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { NumberInputField } from "components/Fields";
import { Span } from "components/Texts";
import { CURRENCY_UNIT } from "constants/index";
import { VARIANT_COLUMN_GRID } from "constants/product";
import { PRODUCT_LABEL } from "constants/product/label";
import map from "lodash/map";
import { FieldErrors } from "react-hook-form";
import { OrderLineItemDTO } from "types/Order";
import { STATUS_PRODUCT_LABEL } from "types/Product";
import { TStyles } from "types/Styles";
import { fNumber, formatFloatToString, fShortenNumber } from "utils/number";
import { redirectVariantUrl } from "utils/product/redirectUrl";
import HandlerImage from "components/Images/HandlerImage";

export type VariantItemColumnName =
  | "price"
  | "quantity"
  | "product"
  | "cross_sale"
  | "neo_price"
  | "image"
  | "sku"
  | "combo"
  | "total"
  | "name";

export interface VariantItemProps {
  value: Partial<OrderLineItemDTO>;
  onUpdateQuantity?: (product: Partial<OrderLineItemDTO> & { index: number }) => void;
  onUpdateSalePrice?: (product: Partial<OrderLineItemDTO> & { index: number }) => void;
  onUpdateTotalPrice?: (product: Partial<OrderLineItemDTO> & { index: number }) => void;
  onDelete?: (idx: number) => void;
  onAddVariants?: (params: { product: Partial<OrderLineItemDTO>; index?: number }) => void;
  index?: number;
  error?: FieldErrors<OrderLineItemDTO>;
  isShowMaxQuantityApplyForPromotion?: boolean;
  hiddenColumns?: VariantItemColumnName[];
  bundleHiddenColumns?: VariantItemColumnName[];
  imageHeight?: number;
  sx?: SxProps<Theme>;
  isShowStatus?: boolean;
  isCheckCrossSale?: boolean;
  divider?: boolean;
}

export const VariantItem = (props: VariantItemProps) => {
  const {
    value = {},
    onDelete,
    onUpdateQuantity,
    onUpdateSalePrice,
    onUpdateTotalPrice,
    onAddVariants,
    index = -1,
    error,
    isShowMaxQuantityApplyForPromotion = false,
    hiddenColumns = [],
    bundleHiddenColumns = [],
    isShowStatus,
    isCheckCrossSale,
    divider = true,
    sx,
  } = props;

  const isUpdate = !!onUpdateQuantity || !!onUpdateSalePrice || !!onUpdateTotalPrice;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    price_variant_logs = 0,
    price_total_input = 0,
    quantity = 1,
    selected,
    id,
    sale_price = 0,
    SKU_code,
    requirement_max_quantity = 0,
    discount = 0,
    neo_price = 0,
    is_cross_sale,
    default_quatity = 0,
  } = value;

  const handleAddVariant = (
    productSelected: Partial<OrderLineItemDTO>,
    isChecked: boolean,
    idx: number,
  ) => {
    if (onAddVariants) {
      onAddVariants({
        product: { ...productSelected, selected: isChecked },
        index: idx,
      });
    }
  };

  const handleChangeComboVariantItem = (
    product: Partial<OrderLineItemDTO> & {
      index: number;
    },
  ) => {
    if (onUpdateQuantity) {
      let newComboVariants = value.combo_variants || [];
      newComboVariants[product.index] = product;
      const newVariant: Partial<OrderLineItemDTO> = {
        ...value,
        combo_variants: newComboVariants,
      };
      onUpdateQuantity({ ...newVariant, index });
    }
  };

  const handleChangeQuantity = (quantity: number) => {
    if (onUpdateQuantity) {
      const newVariant = { ...value, quantity };
      onUpdateQuantity({ ...newVariant, index });
    }
  };

  const salePrice = price_variant_logs || sale_price;
  const total = salePrice * quantity - discount * quantity;

  const disabled =
    !onAddVariants && !onUpdateSalePrice && !onUpdateQuantity && !onUpdateTotalPrice && !onDelete;

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        onClick={() => handleAddVariant(value, !selected, index)}
        my={isUpdate ? 1 : 0}
        py={isUpdate ? 1 : 0}
        sx={{
          ...sx,
          p: 0.5,
          width: "100%",
          backgroundColor: selected && disabled ? "action.hover" : "unset",
          borderBottom: divider ? "1px dashed" : "unset",
          borderColor: "divider",
        }}
        className="product-item-box"
      >
        <Stack direction="row" alignItems={"center"} spacing={1}>
          {is_cross_sale ? (
            <Typography
              style={styles.chip}
              sx={{ backgroundColor: "secondary.main" }}
              fontSize="0.82rem"
            >
              {PRODUCT_LABEL.cross_sale_product}
            </Typography>
          ) : null}
          {value.combo_variants?.length ? (
            <Typography
              style={styles.chip}
              sx={{ backgroundColor: "secondary.main" }}
              fontSize="0.82rem"
            >
              Combo
            </Typography>
          ) : null}
        </Stack>
        <Stack direction="row" alignItems={"center"} spacing={1}>
          <Grid container justifyContent="flex-start" alignItems="center" spacing={1}>
            {/* ----------- */}
            {!hiddenColumns?.includes("product") && (
              <Grid
                item
                xs={
                  VARIANT_COLUMN_GRID.name +
                  (hiddenColumns?.includes("neo_price") ? VARIANT_COLUMN_GRID.neo_price : 0) +
                  (hiddenColumns?.includes("price") ? VARIANT_COLUMN_GRID.price : 0) +
                  (hiddenColumns?.includes("quantity") ? VARIANT_COLUMN_GRID.quantity : 0)
                }
              >
                <Stack direction="row" alignItems="center" position={"relative"}>
                  {onAddVariants && (
                    <ListItemIcon sx={{ m: 0 }}>
                      <Checkbox
                        checked={selected || false}
                        style={checkboxVariantStyle}
                        onChange={(e) => handleAddVariant(value, e.target.checked, index)}
                      />
                    </ListItemIcon>
                  )}

                  <Stack position="relative">
                    {!hiddenColumns.includes("image") && (
                      <HandlerImage height={60} width={60} value={value.images} preview onlyOne />
                    )}
                    {value.default_quatity ? (
                      <Typography
                        style={styles.quantityItemCombo}
                        sx={{ backgroundColor: "secondary.main" }}
                      >
                        {formatFloatToString(value.default_quatity.toString())}
                      </Typography>
                    ) : null}
                  </Stack>
                  <Stack sx={{ ml: 1 }}>
                    <Link
                      underline="hover"
                      variant="subtitle2"
                      color="primary.main"
                      sx={{ cursor: "pointer", fontSize: "0.82rem" }}
                      href={redirectVariantUrl(value?.id)}
                    >
                      {value.name}
                    </Link>
                    {!isMobile && isShowMaxQuantityApplyForPromotion && (
                      <Typography fontSize="0.82rem" className="requirement_max_quantity-label">
                        {`${PRODUCT_LABEL.limit_gift}: ${requirement_max_quantity}`}
                      </Typography>
                    )}
                    {!isMobile && !hiddenColumns.includes("sku") && (
                      <Typography fontSize="0.82rem" className="sku-label">
                        SKU: {SKU_code}
                      </Typography>
                    )}
                    {isShowStatus && (
                      <Span
                        style={styles.status}
                        variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                        color={value.is_active ? "success" : "error"}
                      >
                        {value.is_active
                          ? PRODUCT_LABEL[STATUS_PRODUCT_LABEL.active]
                          : PRODUCT_LABEL[STATUS_PRODUCT_LABEL.inactive]}
                      </Span>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            )}
            {!hiddenColumns?.includes("neo_price") ? (
              <Grid item xs={VARIANT_COLUMN_GRID.neo_price}>
                <Typography sx={styles.price}>
                  {isMobile ? fShortenNumber(neo_price) : fNumber(neo_price)}
                  {CURRENCY_UNIT.VND}
                </Typography>
              </Grid>
            ) : null}
            {!hiddenColumns?.includes("price") ? (
              <Grid item xs={VARIANT_COLUMN_GRID.price}>
                {onUpdateSalePrice ? (
                  <NumberInputField
                    disabled={disabled}
                    value={salePrice}
                    // minQuantity={salePrice}
                    error={!!error?.sale_price}
                    helperText={error?.sale_price?.message}
                    onChange={(price) => {
                      onUpdateSalePrice({ ...value, price_variant_logs: price, index });
                    }}
                    type="currency"
                  />
                ) : (
                  <>
                    <Box position={"relative"}>
                      {hiddenColumns?.includes("neo_price") ? (
                        <Typography sx={styles.price}>
                          {isMobile ? fShortenNumber(salePrice) : fNumber(salePrice)}
                          {CURRENCY_UNIT.VND}
                        </Typography>
                      ) : (
                        <Typography sx={styles.price}>
                          {isMobile ? fShortenNumber(salePrice) : fNumber(salePrice)}
                          {CURRENCY_UNIT.VND}
                        </Typography>
                      )}
                    </Box>
                    {discount ? (
                      <Typography sx={{ ...styles.price, color: theme.palette.error.main }}>
                        {isMobile
                          ? fShortenNumber(salePrice - discount)
                          : fNumber(salePrice - discount)}
                        {CURRENCY_UNIT.VND}
                      </Typography>
                    ) : null}
                  </>
                )}
              </Grid>
            ) : null}
            {/* cột số lượng */}
            {!hiddenColumns?.includes("quantity") && (
              <Grid item xs={VARIANT_COLUMN_GRID.quantity} className="quantity-column">
                <Stack spacing={1}>
                  {disabled ? (
                    <Typography sx={styles.price}>{quantity}</Typography>
                  ) : onUpdateQuantity && !default_quatity ? (
                    <>
                      {isMobile ? (
                        <TextField
                          disabled={disabled}
                          sx={{
                            width: [50, 60, 60, 70],
                            "& input": { padding: [0.5, 0.5, 0.8], fontSize: "0.82rem" },
                          }}
                          fullWidth
                          type="number"
                          size="small"
                          error={!!error?.quantity?.message}
                          InputProps={{
                            inputProps: { min: 1 },
                            autoComplete: "off",
                          }}
                          value={quantity}
                          onChange={(e) => handleChangeQuantity(parseInt(e.target.value))}
                        />
                      ) : (
                        <NumberInputField
                          disabled={disabled}
                          value={quantity}
                          minQuantity={1}
                          onChange={handleChangeQuantity}
                          containerSx={{
                            minWidth: "70px",
                            padding: 0.1,
                            "& > MuiButtonBase-root": {
                              padding: 0.5,
                            },
                          }}
                          error={!!error?.quantity?.message}
                          label={PRODUCT_LABEL.quantity}
                          fullWidth
                        />
                      )}
                    </>
                  ) : (
                    <Typography sx={styles.price}>{quantity}</Typography>
                  )}
                  {!isUpdate && <Divider />}
                  {/* total */}
                  {!hiddenColumns?.includes("total") ? (
                    onUpdateTotalPrice ? (
                      <NumberInputField
                        label={PRODUCT_LABEL.total_price}
                        disabled={disabled}
                        value={price_total_input}
                        // minQuantity={salePrice}
                        error={!!error?.sale_price}
                        helperText={error?.sale_price?.message}
                        onChange={(price) => {
                          onUpdateTotalPrice({ ...value, price_total_input: price, index });
                        }}
                        type="currency"
                        fullWidth
                      />
                    ) : (
                      <Typography
                        sx={{
                          ...styles.price,
                          textDecoration: discount ? "line-through" : "unset",
                        }}
                      >
                        {isMobile ? fShortenNumber(price_total_input) : fNumber(price_total_input)}
                        {CURRENCY_UNIT.VND}
                      </Typography>
                    )
                  ) : null}
                  {discount ? (
                    <Typography sx={{ ...styles.price, color: theme.palette.error.main }}>
                      {isMobile ? fShortenNumber(total) : fNumber(total)}
                      {CURRENCY_UNIT.VND}
                    </Typography>
                  ) : null}
                </Stack>
              </Grid>
            )}
            {/* ---------------------------------- */}
          </Grid>
          {(onDelete || !hiddenColumns?.includes("cross_sale")) && (
            <Stack display="flex" alignItems="center" className="variant-action">
              {isCheckCrossSale && onUpdateQuantity ? (
                <Checkbox
                  style={styles.crossSaleCheckbox}
                  size="small"
                  checked={value.is_cross_sale}
                  onChange={(e) =>
                    onUpdateQuantity({
                      ...value,
                      is_cross_sale: e.target.checked,
                      index,
                    })
                  }
                />
              ) : null}
              {onDelete && (
                <Button
                  disabled={disabled}
                  style={styles.deleteButton}
                  onClick={() => id && onDelete(index)}
                >
                  <DeleteIcon style={{ fontSize: isMobile ? 17 : 20 }} />
                </Button>
              )}
            </Stack>
          )}
        </Stack>
        {error?.quantity?.message && (
          <FormHelperText error>
            <>{error?.quantity?.message}</>
          </FormHelperText>
        )}
        {/* combo */}
        {value.combo_variants?.length && !hiddenColumns.includes("combo") ? (
          <Box style={styles.comboWrap}>
            <Typography style={styles.comboTitle} sx={{ backgroundColor: "secondary.main" }}>
              {PRODUCT_LABEL.product_in_combo}
            </Typography>
            {map(value.combo_variants, (item, idx) => {
              const { quantity: itemQuantity = 0 } = item;
              return (
                <VariantItem
                  sx={{ ".variant-action": { opacity: 0.5, pointerEvents: "none" } }}
                  key={idx}
                  index={idx}
                  value={{
                    ...item.detail_variant,
                    ...item,
                    id: item.detail_variant?.id || item.id,
                    price_variant_logs: item.price_detail_variant,
                    default_quatity: item.quantity,
                    quantity: itemQuantity * quantity,
                  }}
                  hiddenColumns={[...bundleHiddenColumns, "combo"]}
                  onDelete={onDelete}
                  onUpdateQuantity={handleChangeComboVariantItem}
                />
              );
            })}
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
};

const checkboxVariantStyle = { height: 40, width: 40 };

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
    fontSize: "0.7rem",
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
