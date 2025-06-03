import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { GridLineLabel } from "components/Texts";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import find from "lodash/find";
import { GENDER_LABEL, TCustomer, TRank } from "types/Customer";
import { TStyles } from "types/Styles";
import { findOption } from "utils/option";

const CustomerItem = ({ data }: { data: TCustomer }) => {
  const { users } = useAppSelector(getDraftSafeSelector("users"));
  const { attributes } = useAppSelector(getDraftSafeSelector("customer"));

  const userLabel = (userId: string) => find(users, (item) => item.id === userId)?.name;

  return (
    <Stack alignItems="flex-start" gap={1}>
      {data.name && <GridLineLabel label={`${CUSTOMER_LABEL.name}:`} value={data.name} />}
      {data.gender && (
        <GridLineLabel
          label={`${CUSTOMER_LABEL.birthday}:`}
          value={
            <Stack direction="row">
              {data?.gender === "female" && (
                <>
                  <FemaleIcon style={styles.sexIcon} />
                  <Typography>{CUSTOMER_LABEL[GENDER_LABEL.female]}</Typography>
                </>
              )}
              {data?.gender === "male" && (
                <>
                  <MaleIcon style={styles.sexIcon} />
                  <Typography>{CUSTOMER_LABEL[GENDER_LABEL.male]}</Typography>
                </>
              )}
            </Stack>
          }
        />
      )}
      {data.birthday && (
        <GridLineLabel label={`${CUSTOMER_LABEL.birthday}:`} value={data.birthday} />
      )}
      {data.email && <GridLineLabel label={`${CUSTOMER_LABEL.email}:`} value={data.email} />}
      {data.source && <GridLineLabel label={`${CUSTOMER_LABEL.source}:`} value={data.source} />}
      {data.rank && (
        <GridLineLabel
          label={`${CUSTOMER_LABEL.rank}:`}
          value={renderRank(attributes.ranks, data.rank)}
        />
      )}
      {data.customer_care_staff && (
        <GridLineLabel
          label={`${CUSTOMER_LABEL.customer_care_staff}:`}
          value={userLabel(data.customer_care_staff)}
        />
      )}
      {data.customer_note && (
        <GridLineLabel label={`${CUSTOMER_LABEL.customer_note}:`} value={data.customer_note} />
      )}
    </Stack>
  );
};

export default CustomerItem;

const renderRank = (ranks: TRank[], value?: string) => {
  if (value) {
    const rank = findOption(ranks, value, "id");

    return <Chip label={rank?.name_rank} size="small" variant="outlined" />;
  }
};

const styles: TStyles<"sexIcon"> = {
  sexIcon: { fontSize: "1.3rem" },
};
