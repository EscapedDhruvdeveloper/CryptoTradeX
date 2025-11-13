import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function TemporaryDrawer() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setDark();
    } else {
      setLight();
    }
  }, []);

  const changeMode = () => {
    if (localStorage.getItem("theme") !== "dark") {
      setDark();
    } else {
      setLight();
    }
    setDarkMode(!darkMode);
    toast.success("Theme Changed!");
  };

  const setDark = () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  };

  const setLight = () => {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <MenuRoundedIcon className="link" />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <div className="drawer-div">
          <Link to="/" className="link" onClick={handleClose}>
            <p className="link">Home</p>
          </Link>
          <Link to="/compare" className="link" onClick={handleClose}>
            <p className="link">Compare</p>
          </Link>
          <Link to="/watchlist" className="link" onClick={handleClose}>
            <p className="link">Watchlist</p>
          </Link>
          <Link to="/dashboard" className="link" onClick={handleClose}>
            <p className="link">Dashboard</p>
          </Link>
          <Switch checked={darkMode} onClick={changeMode} />
        </div>
      </Drawer>
    </div>
  );
}
