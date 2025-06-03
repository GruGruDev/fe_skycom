import Chip from "@mui/material/Chip";
import { NONE } from "constants/index";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import reduce from "lodash/reduce";
import { useMemo } from "react";
import { TSelectOption } from "types/SelectOption";
import { findOption } from "utils/option";

// const RANK_CHIP_OPTIONS: { value: string | number; color: string; label: string }[] = [
//   { label: CUSTOMER_LABEL.silver, value: 1, color: "#95a5a6" },
//   { label: CUSTOMER_LABEL.gold, value: 2, color: "#FFDF00" },
//   { label: CUSTOMER_LABEL.diamond, value: 3, color: "#1E90FF" },
//   { label: CUSTOMER_LABEL.vip, value: 4, color: "#FFC0CB" },
// ];

export const RankField = ({ value }: { value?: string }) => {
  const { attributes } = useAppSelector(getDraftSafeSelector("customer"));

  const rankOptions = useMemo(() => {
    return reduce(
      attributes.ranks,
      (prev: TSelectOption[], cur) => {
        return [...prev, { value: cur.id, label: cur.name_rank }];
      },
      [],
    );
  }, [attributes.ranks]);

  const rank = findOption(rankOptions, value, "value");
  return (
    <Chip
      label={rank?.label || NONE}
      size="small"
      style={{
        borderColor: rank?.color || "text.secondary",
        backgroundColor: rank?.color || "text.secondary",
        color: rank?.color ? "#ffffff" : "unset",
        fontWeight: rank?.color ? "bold" : "unset",
      }}
      variant="outlined"
    />
  );
};
