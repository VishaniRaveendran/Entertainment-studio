import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Genres from "../../components/Genre/Genres";
import DiscoverFilters from "../../components/DiscoverFilters/DiscoverFilters";
import SingleContent from "../../components/SingleContent/SingleContent";
import useGenre from "../../hooks/useGenre";
import CustomPagination from "../../components/Pagination/CustomPagination";
import "./Series.css";

const Series = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const [rating, setRating] = useState("");
  const [year, setYear] = useState("");
  const [orderBy, setOrderBy] = useState("popularity.desc");
  const genreforURL = useGenre(selectedGenres);

  const fetchSeries = async () => {
    const params = new URLSearchParams({
      api_key: process.env.REACT_APP_API_KEY,
      language: "en-US",
      sort_by: orderBy,
      include_adult: "false",
      include_video: "false",
      page: String(page),
      with_genres: genreforURL || "",
    });
    if (rating) params.set("vote_average.gte", rating);
    if (year) {
      params.set("first_air_date.gte", `${year}-01-01`);
      params.set("first_air_date.lte", `${year}-12-31`);
    }
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/tv?${params.toString()}`
    );
    setContent(data.results);
    setNumOfPages(data.total_pages);
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchSeries();
    // eslint-disable-next-line
  }, [genreforURL, page, rating, year, orderBy]);

  const getBentoSize = (index) => {
    if (index === 0) return "large";
    if (index <= 2) return "medium";
    return "small";
  };

  return (
    <div className="series">
      <div className="pageLayout">
        <div className="pageTitle">TV Series</div>
        <DiscoverFilters
          type="tv"
          rating={rating}
          setRating={setRating}
          year={year}
          setYear={setYear}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          setPage={setPage}
        />
        <Genres
          type="tv"
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          genres={genres}
          setGenres={setGenres}
          setPage={setPage}
        />
        <div className="trending bentoGrid contentGrid">
          {content &&
            content.map((c, i) => (
              <SingleContent
                key={c.id}
                id={c.id}
                poster={c.poster_path}
                title={c.title || c.name}
                date={c.first_air_date || c.release_date}
                media_type="tv"
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

export default Series;
