import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { USER_LABEL } from "constants/user/label";
import { useState } from "react";
import { TCustomer } from "types/Customer";
import { customerApi } from "apis/customer";
import { isVietnamesePhoneNumber } from "utils/strings";
import { GridLineLabel } from "components/Texts";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { showInfo } from "utils/toast";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";

const SearchCustomer = () => {
  const { userOptions } = useAppSelector(getDraftSafeSelector("users"));
  const [customer, setCustomer] = useState<Partial<TCustomer>>();

  const getCustomer = async (phone?: string) => {
    if (!phone || !isVietnamesePhoneNumber(phone)) return;
    const res = await customerApi.get({
      params: { search: phone, limit: 1, page: 1 },
    });
    if (res.data?.results?.length) {
      setCustomer(res.data.results[0]);
    } else {
      setCustomer(undefined);
      showInfo(CUSTOMER_LABEL.not_found_customer);
    }
  };

  const customerCareStaff = userOptions.find(
    (user) => user.value === customer?.customer_care_staff,
  );

  return (
    <Grid item xs={12} md={4} xl={4}>
      <Card sx={{ p: 3, textAlign: "center", width: "100%", height: "100%" }}>
        <TextField
          fullWidth
          label={USER_LABEL.search_customer}
          onChange={(e) => getCustomer(e.target.value)}
        />
        <Stack spacing={3} pt={3}>
          <GridLineLabel label={`${CUSTOMER_LABEL.name}:`} value={customer?.name || "--"} />
          {/* <GridLineLabel label={`${CUSTOMER_LABEL.phone_number}:`} value={"--"} /> */}
          <GridLineLabel
            label={`${CUSTOMER_LABEL.customer_care_staff}:`}
            value={customerCareStaff?.label || "--"}
          />
        </Stack>
      </Card>
    </Grid>
  );
};

export default SearchCustomer;
