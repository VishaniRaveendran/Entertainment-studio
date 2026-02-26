import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import MovieIcon from "@material-ui/icons/Movie";
import TvIcon from "@material-ui/icons/Tv";
import SearchIcon from "@material-ui/icons/Search";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import "./Sidebar.css";

const navItems = [
  { path: "/", label: "Trending", Icon: WhatshotIcon },
  { path: "/movies", label: "Movies", Icon: MovieIcon },
  { path: "/series", label: "TV Series", Icon: TvIcon },
  { path: "/search", label: "Search", Icon: SearchIcon },
  { path: "/mylist", label: "My List", Icon: PlaylistPlayIcon },
];

const Sidebar = () => {
  const history = useHistory();
  const location = useLocation();

  return (
    <aside className="sidebar" role="navigation" aria-label="Primary">
      <div className="sidebar__inner">
        {navItems.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              type="button"
              className={`sidebar__item ${isActive ? "sidebar__item--active" : ""}`}
              onClick={() => history.push(path)}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              title={label}
            >
              <Icon className="sidebar__icon" />
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
