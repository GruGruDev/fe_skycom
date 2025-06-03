import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { LabelInfo, GridLineLabel, TextInfo } from "components/Texts";
import { WAREHOUSE_LABEL } from "constants/warehouse/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import find from "lodash/find";
import { TWarehouse } from "types/Warehouse";
import { addressToString } from "utils/customer/addressToString";
import { fDateTime } from "utils/date";
import { NoDataPanel } from "components/NoDataPanel";

interface Props {
  data?: Partial<TWarehouse>;
  loading?: boolean;
}

const WarehouseInfomation = ({ data, loading }: Props) => {
  const { users } = useAppSelector(getDraftSafeSelector("users"));
  const userName = (id?: string) => find(users, (user) => user.id === id)?.name;

  return loading ? (
    <Suppense />
  ) : data ? (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={12} md={6}>
        <GridLineLabel
          displayType="grid"
          xsLabel={3}
          xsValue={9}
          label={<LabelInfo>{`${WAREHOUSE_LABEL.manager_name}:`}</LabelInfo>}
          value={<TextInfo>{data?.manager_name}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <GridLineLabel
          displayType="grid"
          xsLabel={3}
          xsValue={9}
          label={<LabelInfo>{`${WAREHOUSE_LABEL.manager_phone}:`}</LabelInfo>}
          value={<TextInfo>{data?.manager_phone}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <GridLineLabel
          displayType="grid"
          xsLabel={3}
          xsValue={9}
          label={<LabelInfo>{`${WAREHOUSE_LABEL.created}:`}</LabelInfo>}
          value={<TextInfo>{fDateTime(data?.created)}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <GridLineLabel
          displayType="grid"
          xsLabel={3}
          xsValue={9}
          label={<LabelInfo>{`${WAREHOUSE_LABEL.created_by}:`}</LabelInfo>}
          value={<TextInfo>{userName(data?.created_by)}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <GridLineLabel
          displayType="grid"
          xsLabel={3}
          xsValue={9}
          label={<LabelInfo>{`${WAREHOUSE_LABEL.modified}:`}</LabelInfo>}
          value={<TextInfo>{fDateTime(data?.modified)}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <GridLineLabel
          displayType="grid"
          xsLabel={3}
          xsValue={9}
          label={<LabelInfo>{`${WAREHOUSE_LABEL.modified_by}:`}</LabelInfo>}
          value={<TextInfo>{userName(data?.modified_by)}</TextInfo>}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <GridLineLabel
          displayType="grid"
          xsLabel={3}
          xsValue={9}
          label={<LabelInfo>{`${WAREHOUSE_LABEL.address}:`}</LabelInfo>}
          value={
            <ul>
              {data?.addresses?.map((addr, idx) => (
                <li key={idx}>
                  <TextInfo>{addressToString(addr)}</TextInfo>
                </li>
              ))}
            </ul>
          }
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <GridLineLabel
          displayType="grid"
          xsLabel={3}
          xsValue={9}
          label={<LabelInfo>{`${WAREHOUSE_LABEL.warehouse_note}:`}</LabelInfo>}
          value={<TextInfo>{data?.note}</TextInfo>}
        />
      </Grid>
    </Grid>
  ) : (
    <NoDataPanel containerSx={{ height: 200 }} />
  );
};

export default WarehouseInfomation;

const Suppense = () => {
  return (
    <Grid container wrap="nowrap" spacing={2}>
      {Array.from(new Array(2)).map((_, index) => (
        <Grid item xs={12} sm={12} md={6} key={index}>
          <Skeleton variant="rectangular" height={118} />

          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="60%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
