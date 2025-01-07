"use client";

import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

interface ITopBarProps {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopBar: React.FC<ITopBarProps> = ({ mobileOpen, setMobileOpen }) => {
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: "none" }, color: "text.primary" }}
        >
          <MenuIcon />
        </IconButton>
        <Typography sx={{ color: "text.primary" }} variant="h6" noWrap>
          My Admin Panel
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
