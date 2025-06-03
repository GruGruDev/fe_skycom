import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { customerApi } from "apis/customer";
import { MButton } from "components/Buttons";
import { TagField } from "components/Fields";
import { NoDataPanel } from "components/NoDataPanel";
import { MultiSelect, ValueSelectorType } from "components/Selectors";
import { GridLineLabel } from "components/Texts";
import { BUTTON } from "constants/button";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { LABEL } from "constants/label";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ROLE_CUSTOMER, ROLE_TAB } from "constants/role";
import { YYYY_MM_DD } from "constants/time";
import dayjs from "dayjs";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addressServices } from "services/address";
import { TAddress } from "types/Address";
import { CustomerDTO, TCustomer } from "types/Customer";
import { TStyles } from "types/Styles";
import { handleFormatFormToPayload } from "utils/customer/handleFormatFormToPayload";
import { INVALID_DATE, fDate } from "utils/date";
import { fNumber } from "utils/number";
import { checkPermission } from "utils/roleUtils";
import { maskedPhone } from "utils/strings";
import AddressModal from "views/Customer/components/AddressModal";
import PhoneNumberModal from "views/Customer/components/PhoneNumberModal";
import { RankField } from "views/Customer/components/RankField";
import SearchModal from "../SearchModal";
import BirthdayInput from "./BirthdayInput";
import ListAddessLabel from "./ListAddessLabel";
import { findOption } from "utils/option";

interface Props {
  isEdit?: boolean;
  onRefreshCDPRow?: (customer: Partial<TCustomer>) => void;
  isSearchCustomer?: boolean;
  customerId?: string;
}

const Overview = ({ onRefreshCDPRow, isSearchCustomer, customerId }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { telesaleUserOptions } = useAppSelector(getDraftSafeSelector("users"));

  const [form, setForm] = useState<{
    customer: Partial<CustomerDTO>;
    isSubmitActive: boolean;
    loading: boolean;
  }>({
    customer: {},
    isSubmitActive: false,
    loading: false,
  });
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

  const [addressModal, setAddressModal] = useState({ open: false, loading: false });

  const { customer, loading, isSubmitActive } = form;

  const handleAddAddress = async (value: TAddress) => {
    const { ward, address } = value;
    setAddressModal((prev) => ({ ...prev, loading: true }));
    const res = await addressServices.handleCreateLocation({
      ward,
      is_default: true,
      address,
      customer: customer?.id,
      type: "CT",
    });
    if (res) {
      getData();
      setAddressModal({ loading: false, open: false });
      return;
    }
    setAddressModal((prev) => ({ ...prev, loading: false }));
  };

  const handleUpdateCustomer = async () => {
    if (customer?.id) {
      setForm((prev) => ({ ...prev, loading: true }));
      const { tags, birthday, customer_note, id, name, customer_care_staff } = customer;

      const result = await customerApi.update({
        endpoint: `${id}/`,
        params: { tags, birthday, customer_note, id, name, customer_care_staff },
      });
      if (result.data) {
        onRefreshCDPRow?.(result.data);
        getData();
      }
      setForm((prev) => ({ ...prev, loading: false }));
    }
  };

  const getListTags = useCallback(async (search?: string) => {
    const result = await customerApi.get<{ id: string; name: string }>({
      endpoint: "tags/",
      params: { limit: 1000, page: 1, search },
    });
    if (result?.data) {
      setTags(result.data.results);
    }
  }, []);

  const goToDetail = (value: Partial<TCustomer>) => {
    navigate(`/customer/${value.id}`);
  };

  const handleChangeCustomerCareStaff = (value: ValueSelectorType) => {
    setForm((prev) => ({
      ...prev,
      customer: { ...prev.customer, customer_care_staff: value.toString() },
      isSubmitActive: true,
    }));
  };

  const handleChangeBirthday = (value: Date | string) => {
    const date = dayjs(new Date(value)).format(YYYY_MM_DD);
    setForm((prev) => ({
      ...prev,
      customer: { ...prev.customer, birthday: date !== INVALID_DATE ? date : null },
      isSubmitActive: true,
    }));
  };

  const handleUpdateDefaultAddressCustomer = async (address: TAddress) => {
    const res = await addressServices.handleUpdateLocation({
      ...address,
      type: "CT",
      is_default: true,
    });

    if (res) {
      const addressIdx = customer?.addresses?.findIndex((item) => item.id === res.id) || -1;
      let addressesClone = [...(customer?.addresses || [])];
      addressesClone[addressIdx] = res;
      getData();
    }
  };

  const getData = useCallback(async () => {
    if (customerId) {
      setForm((prev) => ({ ...prev, loading: true, isSubmitActive: false }));
      const res = await customerApi.getById({ endpoint: `${customerId}/` });
      if (res.data) {
        const customer = handleFormatFormToPayload(res.data);
        setForm((prev) => ({ ...prev, customer }));
      }
      setForm((prev) => ({ ...prev, loading: false }));
    }
  }, [customerId]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getListTags();
  }, [getListTags]);

  if (!customer.id) {
    return (
      <Paper
        elevation={3}
        sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", flex: 1, margin: 1 }}
      >
        <NoDataPanel
          message={CUSTOMER_LABEL.error_no_data}
          showImage
          messageSx={{ marginBottom: 5, fontSize: "1rem" }}
          wrapImageSx={{ minHeight: 410 }}
        />
      </Paper>
    );
  }

  const isReadAndWriteCustomer = checkPermission(
    user?.role?.data?.[ROLE_TAB.CUSTOMER]?.[ROLE_CUSTOMER.HANDLE],
    user,
  ).isReadAndWrite;

  return (
    <Stack spacing={1}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          margin: 1,
        }}
      >
        <Stack style={styles.wrapper} pb={2}>
          <Typography fontSize={"1rem"} fontWeight="bold">
            {CUSTOMER_LABEL.customer_info}
          </Typography>
        </Stack>
        {isSearchCustomer && (
          <Box mb={2}>
            <SearchModal
              onSelect={(value) => {
                goToDetail(value);
              }}
              defaultValue={customer}
            />
          </Box>
        )}
        {form.loading ? (
          <Stack spacing={1}>
            <Skeleton variant="text" />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" height={98} />
            <Skeleton variant="rectangular" height={98} />
            <Skeleton variant="rectangular" height={98} />
          </Stack>
        ) : (
          <Stack style={styles.generalInfo} sx={{ ".MuiGrid-root": { paddingRight: 0 } }}>
            <Stack spacing={0.25}>
              <GridLineLabel
                label={`${CUSTOMER_LABEL.phone_number}:`}
                value={
                  <Stack width={"100%"}>
                    {isReadAndWriteCustomer && (
                      <Stack alignItems={"end"} width={"100%"}>
                        <PhoneNumberModal
                          customerId={customer.id}
                          onRefresh={getData}
                          variant="text"
                        />
                      </Stack>
                    )}
                    {customer?.phones?.map((item, idx) => (
                      <Typography component={"li"} fontSize="0.82rem" key={idx}>
                        {maskedPhone(item.phone || "")}
                      </Typography>
                    ))}
                  </Stack>
                }
                containerSx={containerTextlineStyle}
                displayType="grid"
              />
              <GridLineLabel
                label={`${CUSTOMER_LABEL.name}:`}
                value={
                  isReadAndWriteCustomer ? (
                    <TextField
                      value={customer?.name}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          customer: { ...prev.customer, name: e.target.value },
                          isSubmitActive: true,
                        }))
                      }
                      fullWidth
                      size="small"
                      error={!customer?.name}
                      helperText={!customer?.name && VALIDATION_MESSAGE.REQUIRE_CUSTOMER_NAME}
                    />
                  ) : (
                    customer.name
                  )
                }
                containerSx={containerTextlineStyle}
                displayType="grid"
              />
              {isReadAndWriteCustomer ? (
                <BirthdayInput
                  sx={containerTextlineStyle}
                  value={customer?.birthday ? new Date(customer?.birthday).toString() : null}
                  onChange={handleChangeBirthday}
                />
              ) : (
                <GridLineLabel
                  label={`${CUSTOMER_LABEL.birthday}:`}
                  value={fDate(customer.birthday)}
                  containerSx={containerTextlineStyle}
                  displayType="grid"
                />
              )}
              {/* <Address /> */}
              <GridLineLabel
                label={`${CUSTOMER_LABEL.rank}:`}
                value={<RankField value={customer?.rank} />}
                containerSx={containerTextlineStyle}
                displayType="grid"
              />
              <GridLineLabel
                label={`${CUSTOMER_LABEL.latest_up_rank_date}:`}
                value={fDate(customer?.latest_up_rank_date) || "---"}
                containerSx={containerTextlineStyle}
                displayType="grid"
              />
              <GridLineLabel
                label={`${CUSTOMER_LABEL.addresses}:`}
                value={
                  <Stack width={"100%"}>
                    {isReadAndWriteCustomer && (
                      <Stack alignItems={"end"}>
                        <AddressModal
                          {...addressModal}
                          onSubmit={handleAddAddress}
                          setOpen={(value) => setAddressModal((prev) => ({ ...prev, open: value }))}
                        />
                        <MButton
                          onClick={() => setAddressModal((prev) => ({ ...prev, open: true }))}
                          style={styles.addAddressButton}
                          loading={addressModal.loading}
                          variant="text"
                        >
                          {BUTTON.ADD_ADDRESS}
                        </MButton>
                      </Stack>
                    )}
                    <ListAddessLabel
                      addresses={customer?.addresses}
                      handleUpdateAddress={handleUpdateDefaultAddressCustomer}
                    />
                  </Stack>
                }
                containerSx={containerTextlineStyle}
                displayType="grid"
              />
              <GridLineLabel
                label={`${CUSTOMER_LABEL.success_order_revenue}:`}
                value={`${fNumber(customer?.total_spent)}/ ${fNumber(customer?.total_order)} ${
                  CUSTOMER_LABEL.order
                }`}
                containerSx={containerTextlineStyle}
                displayType="grid"
              />
              {true ? (
                <GridLineLabel
                  label={`${CUSTOMER_LABEL.carrier}:`}
                  value={
                    isReadAndWriteCustomer ? (
                      <MultiSelect
                        simpleSelect
                        selectorId="customer-care-staff"
                        options={telesaleUserOptions}
                        onChange={handleChangeCustomerCareStaff}
                        fullWidth
                        outlined
                        placeholder={`---${LABEL.SELECT}---`}
                        value={customer.customer_care_staff}
                      />
                    ) : (
                      findOption(telesaleUserOptions, customer.customer_care_staff, "value")?.label
                    )
                  }
                  containerSx={containerTextlineStyle}
                  displayType="grid"
                />
              ) : null}
              <GridLineLabel
                label={`${LABEL.NOTE}:`}
                value={
                  isReadAndWriteCustomer ? (
                    <TextField
                      multiline
                      minRows={2}
                      maxRows={4}
                      sx={{ fontSize: "0.82rem", ".MuiOutlinedInput-root": { padding: 1 } }}
                      fullWidth
                      value={customer.customer_note || ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          customer: { ...prev.customer, customer_note: e.target.value },
                          isSubmitActive: true,
                        }))
                      }
                    />
                  ) : (
                    customer.customer_note
                  )
                }
                containerSx={containerTextlineStyle}
                displayType="grid"
              />
              <GridLineLabel
                label={`${LABEL.TAG}:`}
                value={
                  customer?.tags ? (
                    <TagField
                      value={customer?.tags}
                      disabled={!isReadAndWriteCustomer}
                      loading={loading}
                      onSubmit={(tags) =>
                        setForm((prev) => ({
                          ...prev,
                          customer: { ...prev.customer, tags: tags as string[] },
                          isSubmitActive: true,
                        }))
                      }
                      returnType="id"
                      placeholder={CUSTOMER_LABEL.select_tags}
                      options={tags}
                      inputStyle={styles.tagInputStyle}
                      inputProps={{ size: "small", disabled: !isReadAndWriteCustomer }}
                    />
                  ) : null
                }
                displayType="grid"
              />
            </Stack>
          </Stack>
        )}
        {isReadAndWriteCustomer && (
          <Stack direction="row">
            <MButton
              variant="contained"
              sx={{ backgroundColor: "primary.main", textTransform: "none", mt: 2 }}
              disabled={!customer.id || !isSubmitActive}
              onClick={handleUpdateCustomer}
              fullWidth
            >
              {BUTTON.UPDATE_CUSTOMER}
            </MButton>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
};

export default memo(Overview);

const containerTextlineStyle: SxProps<Theme> = {
  paddingRight: 1,
  paddingBottom: 1,
};

const styles: TStyles<
  "wrapper" | "updateButton" | "generalInfo" | "addAddressButton" | "tagInputStyle"
> = {
  tagInputStyle: { marginTop: 8 },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  updateButton: { boxShadow: "none" },
  generalInfo: { display: "flex", flexDirection: "column", flex: 1 },
  addAddressButton: {
    fontSize: "0.82rem",
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,
    width: "fit-content",
  },
};
