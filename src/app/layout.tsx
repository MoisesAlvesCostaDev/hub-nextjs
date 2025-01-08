"use client";
import { useState, ReactNode } from "react";
import { CssBaseline, Box, Drawer, Toolbar } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import TopBar from "./components/TopBar/TopBar";
import DrawerMenu from "./components/DrawerMenu/DrawerMenu";

const drawerWidth = 240;

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <html lang="pt-BR">
        <body>
          <CssBaseline />
          <Box sx={{ display: "flex" }}>
            <TopBar setMobileOpen={setMobileOpen} mobileOpen={mobileOpen} />
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", sm: "block" },
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
              open
            >
              <DrawerMenu />
            </Drawer>
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                [`& .MuiDrawer-paper`]: {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
            >
              <DrawerMenu />
            </Drawer>

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
              }}
            >
              <Toolbar />
              {children}
            </Box>
          </Box>
        </body>
      </html>
    </ThemeProvider>
  );
}
