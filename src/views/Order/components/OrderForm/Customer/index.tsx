import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Link from "@mui/material/Link";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { addressApi } from "apis/address";
import { customerApi } from "apis/customer";
import { MButton } from "components/Buttons";
import { NoDataPanel } from "components/NoDataPanel";
import { CustomerAutocomplete } from "components/Selectors";
import { GridLineLabel, Section, TitleGroup, TitleSection } from "components/Texts";
import { BUTTON } from "constants/button";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { ZINDEX_SYSTEM } from "constants/index";
import { LABEL } from "constants/label";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import map from "lodash/map";
import { memo, useCallback, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import { addressServices } from "services/address";
import { TAddress } from "types/Address";
import { TCustomer } from "types/Customer";
import { OrderDTOV2 } from "types/Order";
import { TStyles } from "types/Styles";
import { addressToString } from "utils/customer/addressToString";
import { fDate } from "utils/date";
import { findOption } from "utils/option";
import { maskedPhone } from "utils/strings";
import { showError, showSuccess } from "utils/toast";
import AddressModal from "views/Customer/components/AddressModal";
import CustomerModal from "views/Customer/components/CustomerModal";
import { RankField } from "views/Customer/components/RankField";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";

interface Props extends Partial<OrderDTOV2> {
  onChange: <T extends keyof OrderDTOV2>(key: T, value: OrderDTOV2[T]) => void;
  errors: FieldErrors<OrderDTOV2>;
  isConfirm?: boolean;
  onChangeShippingAddress: (value?: TAddress) => void;
  id?: string;
  nameShipping?: string;
  phoneShipping?: string;
  addressShipping: Partial<TAddress>;
}

export type CUSTOMER_MODAL_ACTION =
  | "create_customer"
  | "update_customer"
  | "create_address"
  | "update_address";

const Customer = (props: Props) => {
  const {
    id,
    errors,
    onChange,
    addressShipping,
    isConfirm,
    onChangeShippingAddress,
    phoneShipping = "---",
    nameShipping = "---",
  } = props;
  const { userOptions } = useAppSelector(getDraftSafeSelector("users"));

  const [form, setForm] = useState<{
    customer?: Partial<TCustomer>;
    open?: boolean;
  }>({ customer: undefined, open: false });
  const [addressModal, setAddressModal] = useState({ open: false, loading: false });

  const { customer, open } = form;
  const addresses = customer?.addresses || [];

  const handleSetDefaultAddress = async (address: Partial<TAddress>) => {
    const res = await addressApi.update({
      endpoint: `addresses/${address.id}/`,
      params: { is_default: true },
    });

    if (res?.data) {
      showSuccess(RESPONSE_MESSAGES.UPDATE_SUCCESS);
      getCustomer(id);
      return;
    }
    showError(RESPONSE_MESSAGES.UPDATE_ERROR);
  };

  const handleChangeShippingAddress = (addressId: string) => {
    const address = findOption(addresses, addressId);
    onChangeShippingAddress(address);
  };

  const handleChangeCustomer = (customer: Partial<TCustomer> = {}) => {
    const { name = "", phones = [], addresses = [] } = customer;
    const phone = phones[0].phone ?? "";

    onChange("customer", customer);
    onChange("name_shipping", name);
    onChange("phone_shipping", phone);

    if (addresses.length >= 1) {
      const addressDefault = findOption(addresses, true, "is_default");
      if (addressDefault) {
        onChangeShippingAddress(addressDefault);
      }
    } else {
      onChangeShippingAddress(undefined);
    }
  };

  const getCustomer = useCallback(async (id?: string) => {
    if (id) {
      const res = await customerApi.getById({ endpoint: `${id}/` });
      if (res.data) {
        setForm((prev) => ({ ...prev, customer: res.data }));
        return res.data;
      }
      return null;
    }
    return null;
  }, []);

  const handleAddAddress = async (form: TAddress) => {
    const { ward, address } = form;
    setAddressModal((prev) => ({ ...prev, loading: true }));
    const res = await addressServices.handleCreateLocation({
      ward,
      is_default: true,
      address,
      customer: id,
      type: "CT",
    });
    if (res) {
      getCustomer(id);
      setAddressModal({ open: false, loading: false });
    }
    setAddressModal((prev) => ({ ...prev, loading: false }));
  };

  const setCustomer = async (customer?: TCustomer) => {
    const res = await getCustomer(customer?.id);

    const name = res?.name || "";
    const firstPhone = res?.phones?.[0]?.phone || "";
    const firstAddress = res?.addresses?.[0] as Partial<TAddress>;

    onChange("phone_shipping", firstPhone);
    onChange("name_shipping", name);
    onChange("address_shipping", firstAddress);
    onChange("customer", customer);
  };

  useEffect(() => {
    getCustomer(id);
  }, [getCustomer, id]);

  const isExistPhone = findOption(customer?.phones, phoneShipping, "phone");
  const customerCareStaff = findOption(userOptions, customer?.customer_care_staff, "value");

  return (
    <Section elevation={3} sx={{ p: 1 }}>
      <CustomerModal
        open={open}
        row={customer}
        onClose={() => setForm((prev) => ({ ...prev, open: false }))}
        onRefresh={setCustomer}
        zIndex={ZINDEX_SYSTEM.dialog}
      />
      <Stack direction="row" display={"flex"} flex={1} alignItems="center">
        <TitleSection style={styles.customerLabel}>{CUSTOMER_LABEL.customer}</TitleSection>
        {!isConfirm && (
          <MButton
            style={styles.addCustomerButton}
            onClick={() => setForm({ customer: undefined, open: true })}
          >
            {BUTTON.ADD}
          </MButton>
        )}
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack direction="column" spacing={2} sx={{ pt: 1 }}>
        {!isConfirm && (
          <CustomerAutocomplete
            size="small"
            onSelected={handleChangeCustomer}
            error={errors.customer}
            label={CUSTOMER_LABEL.phone_number}
            required
            disabled={isConfirm}
          />
        )}
        <Stack direction="column" spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
            <TitleGroup>{CUSTOMER_LABEL.info}</TitleGroup>
          </Stack>
          {isExistPhone ? (
            <FormControl>
              <Typography style={styles.phoneNumberLabel} id="buttons-phone-group-label">
                {CUSTOMER_LABEL.phone_number}
              </Typography>
              <RadioGroup
                aria-labelledby="buttons-phone-group-label"
                defaultValue="female"
                name="radio-buttons-phone-group"
                value={phoneShipping}
                onChange={(e) => onChange("phone_shipping", e.target.value)}
              >
                {customer?.phones?.map((item, index) => (
                  <FormControlLabel
                    sx={{
                      ".MuiTypography-root": { fontSize: "0.82rem" },
                      ".MuiButtonBase-root": { py: 0.5 },
                    }}
                    key={index}
                    value={item.phone || ""}
                    control={<Radio disabled={isConfirm} />}
                    label={maskedPhone(item.phone || "")}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ) : (
            <GridLineLabel
              label={`${CUSTOMER_LABEL.phone_number}:`}
              value={<Typography fontSize="0.82rem">{maskedPhone(phoneShipping)}</Typography>}
              valueSx={styles.textStyle}
              labelSx={styles.textStyle}
              displayType="grid"
            />
          )}
          <GridLineLabel
            label={`${CUSTOMER_LABEL.name}:`}
            value={
              <Link fontSize="0.82rem" href={`/customer/${id}`}>
                {nameShipping}
              </Link>
            }
            valueSx={styles.textStyle}
            labelSx={styles.textStyle}
            displayType="grid"
          />
          <GridLineLabel
            label={`${CUSTOMER_LABEL.birthday}:`}
            value={
              <Typography fontSize="0.82rem">
                {customer?.birthday ? fDate(customer?.birthday)?.toString() : "---"}
              </Typography>
            }
            valueSx={styles.textStyle}
            labelSx={styles.textStyle}
            displayType="grid"
          />
          <GridLineLabel
            label={`${CUSTOMER_LABEL.customer_care_staff}:`}
            value={<Typography fontSize="0.82rem">{customerCareStaff?.label || "---"}</Typography>}
            valueSx={styles.textStyle}
            labelSx={styles.textStyle}
            displayType="grid"
          />
        </Stack>
        <Stack direction="column" spacing={1}>
          <TitleGroup>{CUSTOMER_LABEL.order_info}</TitleGroup>
          <GridLineLabel
            label={`${CUSTOMER_LABEL.rank}:`}
            value={<RankField value={customer?.rank} />}
            valueSx={styles.textStyle}
            labelSx={styles.textStyle}
            displayType="grid"
          />
        </Stack>

        <Stack
          direction="row"
          sx={{ width: "100%", mt: 2 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <TitleGroup>{CUSTOMER_LABEL.shipping_address}</TitleGroup>
          {!isConfirm && id && (
            <>
              <AddressModal
                {...addressModal}
                onSubmit={handleAddAddress}
                setOpen={(open) => setAddressModal((prev) => ({ ...prev, open }))}
              />
              <MButton
                onClick={() => setAddressModal((prev) => ({ ...prev, open: true }))}
                style={styles.addAddressButton}
                loading={addressModal.loading}
              >
                {BUTTON.ADD_ADDRESS}
              </MButton>
            </>
          )}
        </Stack>
        {id ? (
          <>
            {errors.is_available_shipping && (
              <FormHelperText error={!!errors.is_available_shipping}>
                {errors.is_available_shipping?.message}
              </FormHelperText>
            )}
            {errors.address_shipping && (
              <FormHelperText error={!!errors.address_shipping}>
                {errors.address_shipping?.id?.message}
              </FormHelperText>
            )}
          </>
        ) : null}

        <Box sx={{ maxHeight: 480, overflow: "auto" }}>
          {addresses.length ? (
            map(addresses, (item) => {
              return (
                <Stack spacing={0.5} direction="column" key={item.id} sx={{ mb: 2 }}>
                  <FormControlLabel
                    sx={{
                      ".MuiTypography-root": { fontSize: "0.82rem" },
                      ".MuiButtonBase-root": { padding: 0.5 },
                      color: item.is_default && !isConfirm ? "primary.main" : "text.disabled",
                    }}
                    key={item.id}
                    value={item.id?.toString()}
                    control={
                      <Radio
                        disabled={isConfirm}
                        checked={addressShipping?.id?.toString() === item.id?.toString()}
                        onChange={(e) => handleChangeShippingAddress(e.target.value)}
                      />
                    }
                    label={
                      <Typography
                        sx={isConfirm ? {} : { "&:hover": { textDecoration: "underline" } }}
                        fontSize="0.82rem"
                      >
                        {addressToString(item)}
                      </Typography>
                    }
                  />
                  {!item.is_default && (
                    <Typography
                      color="secondary"
                      fontSize="0.82rem"
                      textAlign="end"
                      style={styles.addressItemDefaultLabel}
                      onClick={() => handleSetDefaultAddress(item)}
                    >
                      {LABEL.SET_DEFAULT}
                    </Typography>
                  )}
                </Stack>
              );
            })
          ) : (
            <NoDataPanel showImage wrapImageSx={{ maxHeight: 100 }} />
          )}
        </Box>
      </Stack>
    </Section>
  );
};

export default memo(Customer);

const styles: TStyles<
  | "wrapFullNameStyle"
  | "addressItemDefaultLabel"
  | "editFullNameStyle"
  | "textStyle"
  | "addAddressButton"
  | "addCustomerButton"
  | "customerLabel"
  | "skeleton"
  | "phoneNumberLabel"
> = {
  phoneNumberLabel: { fontSize: "0.82rem" },
  wrapFullNameStyle: { position: "relative", marginBottom: 8 },
  addressItemDefaultLabel: { cursor: "pointer", marginLeft: 32, marginTop: 0 },
  editFullNameStyle: { position: "absolute", top: 0, right: 0 },
  textStyle: { fontSize: "0.82rem" },
  addCustomerButton: { fontSize: "0.82rem", padding: 2 },
  customerLabel: { display: "flex", flex: 1 },
  skeleton: { transform: "scale(1)" },
  addAddressButton: {
    fontSize: "0.82rem",
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,
    width: "fit-content",
  },
};
