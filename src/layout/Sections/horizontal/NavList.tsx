import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TNaviListProps } from "types/NavSection";
import { getActive } from "..";
import { NavItemRoot } from "./NavItem";

// ----------------------------------------------------------------------

type NavListRootProps = {
  list: TNaviListProps;
  handleOpen: (event: React.MouseEvent<HTMLElement>, list?: TNaviListProps) => void;
  handleClose: () => void;
};

export function NavListRoot({ list, handleOpen, ...props }: NavListRootProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { pathname } = useLocation();

  const active = getActive(list.path, pathname);

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    handleClose();
  }, []);

  if (list.children) {
    return (
      <>
        {list.roles ? (
          <NavItemRoot
            open={!!anchorEl}
            item={list}
            active={active}
            onMouseEnter={(e) => handleOpen(e, list)}
            onMouseLeave={() => {
              handleClose();
              props.handleClose();
            }}
          />
        ) : null}
      </>
    );
  }

  return <>{list.roles ? <NavItemRoot item={list} active={active} /> : null}</>;
}
