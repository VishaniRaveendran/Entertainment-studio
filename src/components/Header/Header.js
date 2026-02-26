import React, { useState, useRef, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IconButton, InputBase } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { useTheme } from "../../context/ThemeContext";
import "./Header.css";

const navItems = [
  { path: "/", label: "Trending" },
  { path: "/movies", label: "Movies" },
  { path: "/series", label: "TV Series" },
  { path: "/search", label: "Search" },
  { path: "/mylist", label: "My List" },
];

const Header = () => {
  const history = useHistory();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (q) history.push(`/search?q=${encodeURIComponent(q)}`);
    setSearchQuery("");
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        searchInputRef.current?.blur();
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        <button
          type="button"
          onClick={() => history.push("/")}
          className="header__logo"
          aria-label="Entertainment Studio — home"
        >
          <img
            src={`${process.env.PUBLIC_URL || ""}/logo.png`}
            alt=""
            className="header__logoImg"
          />
        </button>
        <form className="header__searchForm" onSubmit={handleSearch}>
          <SearchIcon className="header__searchIcon" />
          <InputBase
            inputRef={searchInputRef}
            placeholder="Search movies & TV… (/)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="header__searchInput"
            inputProps={{ "aria-label": "Search" }}
          />
        </form>
        <nav className="header__nav" role="navigation" aria-label="Main">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                className={`header__navItem ${isActive ? "header__navItem--active" : ""}`}
                onClick={() => history.push(item.path)}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
        <IconButton
          onClick={toggleTheme}
          className="header__themeBtn"
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          size="small"
        >
          {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </div>
    </header>
  );
};

export default Header;
