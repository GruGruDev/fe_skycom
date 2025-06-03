import { SxProps, Theme, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Badge, { BadgeProps } from "@mui/material/Badge";
import Tabs from "@mui/material/Tabs";
import { PageWithTitle } from "components/Page";
import findIndex from "lodash/findIndex";
import map from "lodash/map";
import React, { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TTabRoute } from "types/Router";
import { a11yPropsUtil } from "utils/a11yProps";
import useResponsive from "hooks/useResponsive";

interface Props {
  routes: TTabRoute[];
  children?: React.ReactNode;
  title?: string;
  sx?: SxProps<Theme>;
  headerSx?: SxProps<Theme>;
  badgeContent?: { [key: string]: number };
  onClickBadge?: (path: string) => void;
  onClickTabLabel?: () => void;
}

export const TabRouteWrap = ({
  routes,
  children,
  title = "",
  sx,
  headerSx,
  badgeContent,
  onClickBadge,
  onClickTabLabel,
}: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDesktop = useResponsive("up", "sm");

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    navigate(`${routes[newValue].path}`);
  };

  const value: number | boolean = useMemo(
    () => findIndex(routes, ({ path }) => path === pathname),
    [pathname, routes],
  );

  return (
    <PageWithTitle title={title}>
      <Box sx={{ width: "100%", height: "100%", ...sx }}>
        <Box sx={{ mb: 1, ...headerSx }}>
          <Tabs
            value={value < 0 ? false : value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              ".MuiTabScrollButton-root.Mui-disabled": {
                opacity: 0.3,
              },
            }}
          >
            {map(routes, ({ roles = true, label, icon, title: subTitle }, index) => (
              <Tab
                label={
                  <PageWithTitle title={subTitle || title}>
                    <StyledBadge
                      badgeContent={badgeContent?.[label as string]}
                      color="error"
                      max={9}
                      onClick={() => onClickBadge?.(routes[index].path)}
                    ></StyledBadge>
                    <Typography fontSize={"0.82rem"} fontWeight={"600"} onClick={onClickTabLabel}>
                      {label}
                    </Typography>
                  </PageWithTitle>
                }
                value={index}
                icon={icon}
                {...a11yPropsUtil(index)}
                key={index}
                disabled={!roles}
                sx={{
                  display: "flex",
                  flexDirection: isDesktop ? "row" : "column",
                  svg: { fontSize: 18 },
                  marginRight: isDesktop ? "2rem !important" : "0.5rem !important",
                  "div > p": { fontWeight: "500 !important" },
                }}
              />
            ))}
          </Tabs>
        </Box>
        {children ? children : <Outlet />}
      </Box>
    </PageWithTitle>
  );
};

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  position: "absolute",
  right: 16,
  top: 8,
  "& .MuiBadge-badge": {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));
