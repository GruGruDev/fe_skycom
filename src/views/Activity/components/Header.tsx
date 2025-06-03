import RefreshIcon from "@mui/icons-material/Refresh";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { SearchField } from "components/Fields";
import { RangeDate } from "components/Pickers";
import { MultiSelect } from "components/Selectors";
import { GridWrapHeaderProps } from "components/Table/Header";
import { ACTION_TYPE_OPTIONS, ACTION_NAME_OPTIONS } from "constants/activity";
import { ACTIVITY_LABEL } from "constants/activity/label";
import { ALL_OPTION } from "constants/index";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import reduce from "lodash/reduce";
import { useMemo } from "react";
import { TSelectOption } from "types/SelectOption";
import { TStyles } from "types/Styles";
import { formatOptionSelect } from "utils/option";
import { revertFromQueryForSelector } from "utils/param";

const Header = ({ params, setParams, onRefresh }: GridWrapHeaderProps) => {
  const { users } = useAppSelector(getDraftSafeSelector("users"));

  const userOptions = useMemo(() => {
    return reduce(
      users,
      (prev: TSelectOption[], cur) => {
        return [...prev, formatOptionSelect(cur)];
      },
      [],
    );
  }, [users]);
  return (
    <Grid container alignItems={"center"} width={"100%"} p={2} spacing={2}>
      <Grid item xs={12} sm={12} md={12}>
        <Stack direction="row" alignItems="center">
          <SearchField
            onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
            fullWidth
            sx={{ maxWidth: 500 }}
          />
          <IconButton onClick={onRefresh}>
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Grid>
      {/* user */}
      <Grid item xs={6} md={3} xl={1.8}>
        <MultiSelect
          options={[ALL_OPTION, ...userOptions]}
          value={revertFromQueryForSelector(params?.user) as string[]}
          onChange={(value) => setParams?.({ ...params, user: value, page: 1 })}
          title={ACTIVITY_LABEL.username}
          style={styles.selector}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} md={3} xl={1.8}>
        <MultiSelect
          options={[ALL_OPTION, ...ACTION_NAME_OPTIONS]}
          value={revertFromQueryForSelector(params?.action_name) as string[]}
          onChange={(value) => setParams?.({ ...params, action_name: value, page: 1 })}
          title={ACTIVITY_LABEL.action_name}
          style={styles.selector}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} md={3} xl={1.8}>
        <MultiSelect
          options={[ALL_OPTION, ...ACTION_TYPE_OPTIONS]}
          value={revertFromQueryForSelector(params?.action_type) as string[]}
          onChange={(value) => setParams?.({ ...params, action_type: value, page: 1 })}
          title={ACTIVITY_LABEL.action_type}
          style={styles.selector}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} md={3} xl={1.8}>
        <RangeDate
          standard
          inputProps={{ style: styles.selector }}
          fullWidth
          handleSubmit={(created_from: string, created_to: string, dateValue: string | number) =>
            setParams?.({
              ...params,
              action_time_from: created_from,
              action_time_to: created_to,
              timeAction: dateValue,
              page: 1,
            })
          }
          created_from={params?.action_time_from as string}
          created_to={params?.action_time_to as string}
          defaultDateValue={params?.timeAction as string}
        />
      </Grid>
    </Grid>
  );
};

export default Header;

const styles: TStyles<"selector"> = {
  selector: {},
};
