import Grid from "@mui/material/Grid";
import useResponsive from "hooks/useResponsive";
import React, { useRef, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { MBadgeButton } from "components/Buttons";
import { MPopover } from "components/Popovers";
import { TStyles } from "types/Styles";

export interface WrapFilterProps {
  children?: JSX.Element | React.ReactNode;
  filterChipCount?: number;
}

export const WrapFilterPopup = ({ children, filterChipCount = 0 }: WrapFilterProps) => {
  const anchorRef = useRef(null);
  const [isShowFilter, setShowFilter] = useState(false);
  const isMobile = useResponsive("down", "sm");

  return (
    <>
      <MPopover
        open={isShowFilter}
        onClose={() => setShowFilter(false)}
        anchorEl={anchorRef.current}
        sx={{
          p: isMobile ? 1 : 2,
          // width: isMobile ? "85%" : "65%",
          maxHeight: "80%",
          overflow: "auto",
          width: "unset",
        }}
      >
        <Grid container spacing={1}>
          {children}
        </Grid>
      </MPopover>
      <MBadgeButton
        value={filterChipCount}
        setShowPopup={setShowFilter}
        label="Filter"
        ref={anchorRef}
        icon={<FilterAltIcon style={styles.filterIcon} />}
      />
    </>
  );
};

const styles: TStyles<"filterIcon"> = {
  filterIcon: { fontSize: "1.6rem" },
};
