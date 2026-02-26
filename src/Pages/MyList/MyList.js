import React from "react";
import { useHistory } from "react-router-dom";
import { useWatchlist } from "../../context/WatchlistContext";
import SingleContent from "../../components/SingleContent/SingleContent";
import "./MyList.css";

const getBentoSize = (i) => {
  if (i === 0) return "large";
  if (i <= 2) return "medium";
  return "small";
};

const MyList = () => {
  const { items } = useWatchlist();
  const history = useHistory();

  if (items.length === 0) {
    return (
      <div className="myListPage">
        <div className="pageLayout">
          <div className="pageTitle">My List</div>
          <div className="myListEmpty">
            <p>Your watchlist is empty.</p>
            <p className="myListEmpty__hint">Add movies and TV series from Trending, Movies, or Search.</p>
            <button type="button" className="myListEmpty__btn" onClick={() => history.push("/")}>
              Discover Trending
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="myListPage">
      <div className="pageLayout">
        <div className="pageTitle">My List</div>
        <div className="trending bentoGrid contentGrid">
          {items.map((c, i) => (
            <SingleContent
              key={`${c.media_type}-${c.id}`}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type={c.media_type}
              vote_average={c.vote_average}
              bentoSize={getBentoSize(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyList;
