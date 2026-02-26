import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Chip } from "@material-ui/core";
import SingleContent from "../../components/SingleContent/SingleContent";
import CustomPagination from "../../components/Pagination/CustomPagination";
import {
  img_1280,
  img_500,
  unavailable,
  unavailableLandscape,
} from "../../config/config";
import "./Trending.css";

const TIME_OPTIONS = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Series" },
];

const Trending = () => {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [timeWindow, setTimeWindow] = useState("day");
  const [mediaType, setMediaType] = useState("all");

  const fetchTrending = useCallback(async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
    );
    setContent(data.results);
  }, [page, timeWindow, mediaType]);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  const handleTimeChange = (value) => {
    setTimeWindow(value);
    setPage(1);
  };

  const handleTypeChange = (value) => {
    setMediaType(value);
    setPage(1);
  };

  const getBentoSize = (index) => {
    if (index === 0) return "large";
    if (index <= 2) return "medium";
    return "small";
  };

  const heroItem = content && content[0];

  return (
    <div className="trendingPage">
      {/* Hero: only when we have featured item (page 1, day) */}
      {heroItem && page === 1 && (
        <section className="hero" aria-label="Featured">
          <div
            className="hero__bg"
            style={{
              backgroundImage: `url(${
                heroItem.backdrop_path
                  ? `${img_1280}${heroItem.backdrop_path}`
                  : unavailableLandscape
              })`,
            }}
          />
          <div className="hero__overlay" />
          <div className="hero__inner">
            <div className="hero__posterWrap">
              <img
                className="hero__poster"
                src={
                  heroItem.poster_path
                    ? `${img_500}${heroItem.poster_path}`
                    : unavailable
                }
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = unavailable;
                }}
              />
            </div>
            <div className="hero__content">
              <h1 className="hero__title">{heroItem.title || heroItem.name}</h1>
              <div className="hero__meta">
                {heroItem.vote_average != null &&
                  heroItem.vote_average !== "" &&
                  !Number.isNaN(Number(heroItem.vote_average)) && (
                    <span className="hero__metaItem">
                      <span className="hero__metaLabel">IMDb</span>
                      {Number(heroItem.vote_average).toFixed(1)}
                    </span>
                  )}
                <span className="hero__metaItem hero__metaItem--4k">4K</span>
                <span className="hero__metaItem">
                  {heroItem.media_type === "tv" ? "TV Series" : "Movie"}
                </span>
              </div>
              {heroItem.overview && (
                <p className="hero__overview">
                  {heroItem.overview.slice(0, 200)}
                  {heroItem.overview.length > 200 ? "…" : ""}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="pageLayout">
        <div className="pageTitle">Trending</div>
        <div className="trendingFilters">
          <span className="trendingFilters__label">Time</span>
          <div className="trendingFilters__chips genres">
            {TIME_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                color={timeWindow === opt.value ? "primary" : "default"}
                variant={timeWindow === opt.value ? "default" : "outlined"}
                clickable
                size="small"
                onClick={() => handleTimeChange(opt.value)}
              />
            ))}
          </div>
          <span className="trendingFilters__label">Type</span>
          <div className="trendingFilters__chips genres">
            {TYPE_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                color={mediaType === opt.value ? "primary" : "default"}
                variant={mediaType === opt.value ? "default" : "outlined"}
                clickable
                size="small"
                onClick={() => handleTypeChange(opt.value)}
              />
            ))}
          </div>
        </div>
        <div className="trending bentoGrid contentGrid">
          {content &&
            content.map((c, i) => (
              <SingleContent
                key={c.id}
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
        <CustomPagination setPage={setPage} />
      </div>
    </div>
  );
};

export default Trending;
