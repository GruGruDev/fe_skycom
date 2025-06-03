import Stack from "@mui/material/Stack";
import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TNavSectionProps, TNaviListProps } from "types/NavSection";
import { getActive } from "..";
import { NavItemSub } from "./NavItem";
import { NavListRoot } from "./NavList";
import { PaperStyle } from "./style";

// ----------------------------------------------------------------------

const scrollbarStyles = {
  overflow: "auto",
  "&::-webkit-scrollbar": {
    display: "none",
    width: "6px",
    height: "6px",
  },

  "&:hover": {
    "&::-webkit-scrollbar": {
      display: "block",
    },
  },
} as const;

function NavSectionHorizontal({ navConfig }: TNavSectionProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenu, setCurrentMenu] = useState<TNaviListProps>();
  const [closeMenuItem, setCloseMenuItem] = useState({ root: true, sub: true });

  const handleOpen = (event: React.MouseEvent<HTMLElement>, list?: TNaviListProps) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(list);
  };

  const handleSubClose = () => {
    setCloseMenuItem((prev) => ({ ...prev, sub: true }));
  };

  const handleRootClose = () => {
    setCloseMenuItem((prev) => ({ ...prev, root: true }));
  };

  useEffect(() => {
    if (closeMenuItem.sub && closeMenuItem.root) {
      setAnchorEl(null);
      setCurrentMenu(undefined);
    }
  }, [closeMenuItem.sub, closeMenuItem.root]);

  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={{ bgcolor: "background.neutral", borderRadius: 1, px: 0.5 }}
    >
      <Stack direction="row" sx={{ ...scrollbarStyles, py: 1 }}>
        {navConfig.map((group) => (
          <Stack key={group.subheader} direction="row" flexShrink={0}>
            {group.items.map((list) => (
              <NavListRoot
                key={list.title}
                list={list}
                handleOpen={(event, list) => {
                  setCloseMenuItem((prev) => ({ ...prev, root: false }));
                  handleOpen(event, list);
                }}
                handleClose={handleRootClose}
              />
            ))}
          </Stack>
        ))}
      </Stack>
      {currentMenu && (
        <PaperStyle
          open={!!anchorEl}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{
            paper: {
              onMouseEnter: () => setCloseMenuItem((prev) => ({ ...prev, sub: false })),
              onMouseLeave: handleSubClose,
            },
          }}
        >
          {currentMenu.children?.map((item, index) => <NavListSub list={item} key={index} />)}
        </PaperStyle>
      )}
    </Stack>
  );
}

export default memo(NavSectionHorizontal);

type NavListSubProps = {
  list: TNaviListProps;
};

function NavListSub({ list }: NavListSubProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenu, setCurrentMenu] = useState<TNaviListProps>();

  const { pathname } = useLocation();

  const active = getActive(currentMenu?.path, pathname);

  const handleOpen = (event: React.MouseEvent<HTMLElement>, list?: TNaviListProps) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(list);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    handleClose();
  }, []);

  if (list.children) {
    return (
      <>
        <PaperStyle
          open={!!anchorEl}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{
            paper: {
              onMouseEnter: handleOpen,
              onMouseLeave: handleClose,
            },
          }}
        >
          {list.children.map((item) => (
            <NavListSub key={item.title} list={item} />
          ))}
        </PaperStyle>
      </>
    );
  }

  return <NavItemSub item={list} active={active} />;
}
