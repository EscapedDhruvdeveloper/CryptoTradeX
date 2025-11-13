import React, { useEffect, useState } from "react";
import Button from "../Button";
import TemporaryDrawer from "./drawer";
import "./styles.css";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom"; // updated import

function Header() {
  const navigate = useNavigate(); // hook for programmatic navigation

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

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="header">
      <h1 onClick={handleLogoClick} style={{ cursor: "pointer" }}>
        CryptoInsightHub<span style={{ color: "var(--blue)" }}>.</span>
      </h1>
      <div className="links">
        <Switch checked={darkMode} onClick={changeMode} />
        <Link to="/" className="link">
          <p className="link">Home</p>
        </Link>
        <Link to="/compare" className="link">
          <p className="link">Compare</p>
        </Link>
        <Link to="/watchlist" className="link">
          <p className="link">Watchlist</p>
        </Link>
        <Link to="/dashboard">
          <Button text={"dashboard"} />
        </Link>
      </div>
      <div className="drawer-component">
        <TemporaryDrawer />
      </div>
    </div>
  );
}

export default Header;