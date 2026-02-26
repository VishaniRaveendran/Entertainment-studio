import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import SingleContent from "../../components/SingleContent/SingleContent";
import CustomPagination from "../../components/Pagination/CustomPagination";
import "./Genre.css";

const API_BASE = "https://api.themoviedb.org/3";
const key = () => process.env.REACT_APP_API_KEY;

const Genre = () => {
  const { genreId } = useParams();
  const location = useLocation();
  const type = location.pathname.startsWith("/series") ? "series" : "movies";
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState(0);
  const [genreName, setGenreName] = useState("");

  const mediaType = type === "series" ? "tv" : "movie";

  useEffect(() => {
    if (!genreId) return;
    const fetchGenre = async () => {
      const { data } = await axios.get(
        `${API_BASE}/discover/${mediaType}?api_key=${key()}&language=en-US&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
      );
      setContent(data.results || []);
      setNumOfPages(data.total_pages || 0);
    };
    fetchGenre();
  }, [genreId, mediaType, page]);

  useEffect(() => {
    if (!genreId) return;
    const fetchGenreName = async () => {
      const { data } = await axios.get(
        `${API_BASE}/genre/${mediaType}/list?api_key=${key()}&language=en-US`
      );
      const found = (data.genres || []).find((g) => String(g.id) === String(genreId));
      setGenreName(found ? found.name : "Genre");
    };
    fetchGenreName();
  }, [genreId, mediaType]);

  const getBentoSize = (i) => {
    if (i === 0) return "large";
    if (i <= 2) return "medium";
    return "small";
  };

  return (
    <div className="genrePage">
      <div className="pageLayout">
        <div className="pageTitle">{genreName || "Genre"}</div>
        <div className="trending bentoGrid contentGrid">
          {content.map((c, i) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type={mediaType}
              vote_average={c.vote_average}
              bentoSize={getBentoSize(i)}
            />
          ))}
        </div>
        {numOfPages > 1 && (
          <CustomPagination setPage={setPage} numOfPages={numOfPages} />
        )}
      </div>
    </div>
  );
};

export default Genre;
