import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { SHEET_LABEL } from "constants/warehouse/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import find from "lodash/find";
import { PATH_DASHBOARD } from "routers/paths";
import { WAREHOUSE_PATH } from "types/Router";
import { TSheet } from "types/Sheet";

const SheetItem = ({ value }: { value: Partial<TSheet> }) => {
  const { inventoryReasons } = useAppSelector(getDraftSafeSelector("warehouses"));

  const changeReasonLabel = find(inventoryReasons, (item) => item.id === value.change_reason)?.name;

  return (
    <Stack spacing={1}>
      {value.code && (
        <GridLineLabel
          label={`${SHEET_LABEL.code}:`}
          value={
            <Link
              href={`${window.location.origin}${PATH_DASHBOARD.warehouse[""]}/${WAREHOUSE_PATH.SHEET}/${value.id}?type=EP`}
              fontSize={"0.82rem"}
            >
              {value.code}
            </Link>
          }
        />
      )}

      {value.change_reason && (
        <GridLineLabel label={`${SHEET_LABEL.change_reason}:`} value={changeReasonLabel} />
      )}
    </Stack>
  );
};

export default SheetItem;
