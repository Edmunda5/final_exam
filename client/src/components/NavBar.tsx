import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { sendRequest } from "../utils/sendRequest";
import { useNavigate } from "react-router-dom";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import { Icon } from "@mui/material";

interface NavBarProps {
  title: string;
  subtitle?: string;
}

export default function NavBar({ title, subtitle }: NavBarProps) {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{gap: 5}}>
          <Icon fontSize="large">
            <LocalActivityIcon fontSize="large"/>
          </Icon>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
            {subtitle}
          </Typography>
          <Button
            onClick={() => {
              sendRequest("POST", "api/logout");
              navigate("/login");
            }}
            color="inherit"
          >
            Atsijungti
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
