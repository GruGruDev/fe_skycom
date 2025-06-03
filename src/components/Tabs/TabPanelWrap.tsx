import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import map from "lodash/map";
import React, { useEffect, useMemo, useState } from "react";
import { TStyles } from "types/Styles";
import { a11yPropsUtil } from "utils/a11yProps";

export interface TabType {
  label: string;
  title: string;
  component: React.ReactNode | JSX.Element;
  role?: boolean;
}
interface Props {
  tabs: TabType[];
  vertical?: boolean;
  tabPanelSx?: SxProps<Theme>;
  tabBodySx?: SxProps<Theme>;
  tabStyle?: React.CSSProperties;
}

export const TabPanelWrap = ({ tabBodySx, tabs, vertical, tabPanelSx, tabStyle }: Props) => {
  const [value, setValue] = useState(0);
  const defaultTab = useMemo(() => {
    return tabs.findIndex((item) => item.role !== false);
  }, [tabs]);

  useEffect(() => {
    setValue(defaultTab);
  }, [defaultTab]);

  let tabPanelWidth = 150;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        flexGrow: 1,
        bgcolor: "background.paper",
        display: vertical ? "flex" : "unset",
      }}
    >
      <Tabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        variant="scrollable"
        orientation={vertical ? "vertical" : "horizontal"}
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
        sx={{
          mr: vertical ? 1 : 0,
          mb: vertical ? 0 : 1,
          borderRight: vertical ? 1 : 0,
          borderBottom: vertical ? 0 : 1,
          borderColor: "divider",
          minWidth: tabPanelWidth,
          minHeight: 32,
          ...tabPanelSx,
        }}
      >
        {map(tabs, (tab, index) => {
          return (
            <Tab
              label={tab.label}
              title={tab.title}
              {...a11yPropsUtil(index)}
              key={index}
              style={{ ...styles.tabItem, ...tabStyle }}
              disabled={tab.role === false}
              sx={{ height: 24, minHeight: 24 }}
            />
          );
        })}
      </Tabs>
      {map(tabs, (tab, idx) => {
        if (tab.role === false) return null;
        return (
          <Box
            role="tabpanel"
            hidden={value !== idx}
            id={`simple-tabpanel-${idx}`}
            aria-labelledby={`simple-tab-${idx}`}
            key={idx}
            // width={`calc(100% - ${tabPanelWidth}px)`}
            sx={tabBodySx}
          >
            {value === idx && <Box>{tab.component}</Box>}
          </Box>
        );
      })}
    </Box>
  );
};

const styles: TStyles<"tabItem"> = {
  tabItem: { marginRight: "1rem", fontSize: "0.82rem" },
};
