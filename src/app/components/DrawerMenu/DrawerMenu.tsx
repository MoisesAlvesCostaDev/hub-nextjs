"use client";

import Image from "next/image";
import {
  List,
  ListItem,
  ListItemText,
  Toolbar,
  IconButton,
} from "@mui/material";

import Link from "next/link";
import { menuItems } from "./menuItems";

const DrawerMenu: React.FC = () => {
  return (
    <div>
      <Toolbar sx={{ justifyContent: "center", padding: 2 }}>
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={150}
          height={50}
          style={{ objectFit: "contain" }}
        />
      </Toolbar>
      <List>
        {menuItems.map(({ href, text, icon }) => {
          const IconComponent = require("@mui/icons-material")[icon];
          return (
            <ListItem
              key={href}
              component={Link}
              href={href}
              sx={{
                "&:hover": {
                  backgroundColor: "background.default",
                },
              }}
            >
              <IconButton>{IconComponent && <IconComponent />}</IconButton>
              <ListItemText
                primary={text}
                sx={{
                  color: "text.primary",
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default DrawerMenu;
