import { SxProps, Theme } from "@mui/material";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { customerApi } from "apis/customer";
import MultiSelectPoper from "components/Selectors/MultiSelectPoper";
import MTableWrapper from "components/Table/MTableWrapper";
import { Span } from "components/Texts";
import { CUSTOMER_ORDERING_OPTIONS } from "constants/customer";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { FULL_OPTIONS } from "constants/index";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import map from "lodash/map";
import { useCallback, useEffect, useState } from "react";
import { TAttribute } from "types/Attribute";
import { TCustomer, TRank } from "types/Customer";
import { TParams } from "types/Param";
import { TUser } from "types/User";
import { fDate } from "utils/date";
import { findOption, formatOptionSelect } from "utils/option";
import { revertFromQueryForSelector } from "utils/param";
import CustomerModal from "./components/CustomerModal";
import { Link } from "react-router-dom";
import { fNumber } from "utils/number";

const MCustomer = ({ defaultParams }: { defaultParams?: TParams }) => {
  const [params, setParams] = useState<TParams>({
    limit: 10,
    page: 1,
    ordering: "-created",
    ...defaultParams,
  });
  const { users } = useAppSelector(getDraftSafeSelector("users"));
  const { attributes } = useAppSelector(getDraftSafeSelector("customer"));

  const getData = useCallback(async (params?: TParams) => {
    const result = await customerApi.get<TCustomer>({
      params,
      endpoint: "",
    });
    return result;
  }, []);

  return (
    <MTableWrapper
      setParams={setParams}
      params={params}
      itemComponent={(item) => <CustomerItem item={item} ranks={attributes.ranks} users={users} />}
      onGetData={getData}
      onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
      filterComponent={
        <FilterComponent
          params={params}
          setParams={setParams}
          users={users}
          ranks={attributes.ranks}
          groups={attributes.groups}
          isFilterCarrier
          isFilterGroup
          isFilterRank
        />
      }
      orderingOptions={CUSTOMER_ORDERING_OPTIONS}
      itemHeight={156}
    />
  );
};

export default MCustomer;

// tên, sđt, ngày sinh, hạng, nhóm, người chăm sóc
const CustomerItem = ({
  item,
  ranks,
  users,
}: {
  item: TCustomer;
  ranks: TRank[];
  users: TUser[];
}) => {
  const [customer, setCustomer] = useState(item);
  const {
    name,
    phones,
    birthday,
    rank,
    customer_care_staff,
    total_order,
    total_spent,
    last_order_time,
  } = customer;
  const rankValue = findOption(ranks, rank, "id");
  const customerCareStaff = findOption(users, customer_care_staff, "id");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCustomer(item);
  }, [item]);

  return (
    <Paper elevation={1} sx={{ borderRadius: "3px" }}>
      <CustomerModal
        onRefresh={(customer) => customer && setCustomer(customer)}
        open={open}
        onClose={() => setOpen(false)}
        row={customer}
      />
      <Stack spacing={1} onClick={() => setOpen(true)}>
        <Stack
          direction={"row"}
          spacing={1}
          alignItems={"center"}
          sx={{
            backgroundColor: "rgb(0,0,0,0.03)",
            borderTopLeftRadius: "3px",
            borderTopRightRadius: "3px",
            p: "8px",
          }}
        >
          <Link to={`/customer/${item.id}`}>
            <Typography fontSize={"0.825rem"} fontWeight={"600"}>
              {name}
            </Typography>
          </Link>
          <Span sx={styles.chip}>{phones?.[0]?.phone}</Span>
          <Stack flex={1} />
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={1} px={1} pt={1}>
          <Stack>
            <Typography fontSize={"0.7rem"} color="grey">
              {CUSTOMER_LABEL.birthday}
            </Typography>
            <Typography fontSize={"0.825rem"}>{fDate(birthday) || "--"}</Typography>
          </Stack>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Stack>
            <Typography fontSize={"0.7rem"} color="grey">
              {CUSTOMER_LABEL.rank}
            </Typography>
            <Typography fontSize={"0.825rem"}>{rankValue?.name_rank || "--"}</Typography>
          </Stack>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Stack>
            <Typography fontSize={"0.7rem"} color="grey">
              {CUSTOMER_LABEL.customer_care_staff || "--"}
            </Typography>
            <Typography fontSize={"0.825rem"}>{customerCareStaff?.name || "--"}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={1} px={1} pb={1}>
          <Stack>
            <Typography fontSize={"0.7rem"} color="grey">
              {CUSTOMER_LABEL.total_order}
            </Typography>
            <Typography fontSize={"0.825rem"}>{fNumber(total_order) || "--"}</Typography>
          </Stack>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Stack>
            <Typography fontSize={"0.7rem"} color="grey">
              {CUSTOMER_LABEL.total_spent}
            </Typography>
            <Typography fontSize={"0.825rem"}>{fNumber(total_spent) || "--"}</Typography>
          </Stack>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Stack>
            <Typography fontSize={"0.7rem"} color="grey">
              {CUSTOMER_LABEL.last_order_time || "--"}
            </Typography>
            <Typography fontSize={"0.825rem"}>{fDate(last_order_time) || "--"}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

const styles: { [key: string]: SxProps<Theme> } = {
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};

const FilterComponent = ({
  params,
  setParams,
  users,
  ranks,
  groups,
  isFilterCarrier,
  isFilterGroup,
  isFilterRank,
}: {
  params?: TParams;
  setParams?: (newParams: TParams) => void;
  isFilterCarrier?: boolean;
  isFilterRank?: boolean;
  isFilterGroup?: boolean;
  users: TUser[];
  ranks: TRank[];
  groups: TAttribute[];
}) => {
  const userOptions = map(users, formatOptionSelect);
  const groupOptions = map(groups, formatOptionSelect);
  const rankOptions = map(ranks, (item) => ({ label: item.name_rank, value: item.id }));

  return (
    <>
      {isFilterCarrier && (
        <MultiSelectPoper
          options={[...FULL_OPTIONS, ...userOptions]}
          value={revertFromQueryForSelector(params?.customer_care_staff)}
          title={CUSTOMER_LABEL.carrier}
          onChange={(value) => setParams?.({ ...params, customer_care_staff: value, page: 1 })}
          badgeContent={(params?.customer_care_staff as string[])?.length}
        />
      )}
      {isFilterGroup && (
        <MultiSelectPoper
          options={[...FULL_OPTIONS, ...groupOptions]}
          value={revertFromQueryForSelector(params?.groups)}
          title={CUSTOMER_LABEL.groups}
          onChange={(value) => setParams?.({ ...params, groups: value, page: 1 })}
          badgeContent={(params?.groups as string[])?.length}
        />
      )}
      {isFilterRank && (
        <MultiSelectPoper
          options={[...FULL_OPTIONS, ...rankOptions]}
          value={revertFromQueryForSelector(params?.rank)}
          title={CUSTOMER_LABEL.rank}
          onChange={(value) => setParams?.({ ...params, rank: value, page: 1 })}
          badgeContent={(params?.rank as string[])?.length}
        />
      )}
    </>
  );
};
