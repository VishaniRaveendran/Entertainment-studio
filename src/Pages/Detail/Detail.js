import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import {
  img_500,
  img_1280,
  unavailable,
  unavailableLandscape,
} from "../../config/config";
import { useWatchlist } from "../../context/WatchlistContext";
import { useSettings } from "../../context/SettingsContext";
import SingleContent from "../../components/SingleContent/SingleContent";
import Carousel from "../../components/Carousel/Carousel";
import "./Detail.css";

const API_BASE = "https://api.themoviedb.org/3";
const key = () => process.env.REACT_APP_API_KEY;

const Detail = ({ mediaType: mediaTypeProp, id: idProp }) => {
  const params = useParams();
  const id = idProp ?? params.id;
  const mediaType = mediaTypeProp ?? (params.mediaType || "movie");
  const history = useHistory();
  const { isInWatchlist, toggle } = useWatchlist();
  const { apiParams } = useSettings();
  const [content, setContent] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [watchProviders, setWatchProviders] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  const type = mediaType === "movie" ? "movie" : "tv";

  useEffect(() => {
    if (!id || !type) return;
    setLoading(true);
    const lang = apiParams.language || "en-US";
    const region = apiParams.region || "US";

    Promise.all([
      axios.get(`${API_BASE}/${type}/${id}?api_key=${key()}&language=${lang}`),
      axios.get(`${API_BASE}/${type}/${id}/similar?api_key=${key()}&language=${lang}&page=1`),
      axios.get(`${API_BASE}/${type}/${id}/videos?api_key=${key()}&language=${lang}`),
      axios.get(`${API_BASE}/${type}/${id}/reviews?api_key=${key()}&language=${lang}&page=1`),
      axios.get(`${API_BASE}/${type}/${id}/watch/providers?api_key=${key()}`),
    ])
      .then(([detail, sim, vid, rev, prov]) => {
        const data = detail.data;
        setContent(data);
        setSimilar((sim.data.results || []).slice(0, 12));
        setVideos(vid.data.results || []);
        setReviews((rev.data.results || []).slice(0, 5));
        const flat = prov.data.results?.[region] || prov.data.results?.["US"] || null;
        setWatchProviders(flat);
        setSeasons(type === "tv" && Array.isArray(data.seasons) ? data.seasons : []);
      })
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [id, type, apiParams.language, apiParams.region]);

  const addToWatchlist = () => {
    if (!content) return;
    toggle({
      id: content.id,
      media_type: type,
      poster_path: content.poster_path,
      backdrop_path: content.backdrop_path,
      title: content.title || content.name,
      name: content.name,
      release_date: content.release_date,
      first_air_date: content.first_air_date,
      vote_average: content.vote_average,
    });
  };

  if (loading) {
    return (
      <div className="detailPage">
        <div className="pageLayout">
          <div className="detailSkeleton" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="detailPage">
        <div className="pageLayout">
          <p className="detailError">Content not found.</p>
          <button type="button" className="detailBackBtn" onClick={() => history.push("/")}>
            Go home
          </button>
        </div>
      </div>
    );
  }

  const title = content.title || content.name;
  const releaseYear = (content.release_date || content.first_air_date || "").substring(0, 4);
  const inList = isInWatchlist(type, content.id);

  return (
    <div className="detailPage">
      <section className="detailHero">
        <div
          className="detailHero__bg"
          style={{
            backgroundImage: `url(${
              content.backdrop_path ? `${img_1280}${content.backdrop_path}` : unavailableLandscape
            })`,
          }}
        />
        <div className="detailHero__overlay" />
        <div className="detailHero__inner pageLayout">
          <button
            type="button"
            className="detailBackBtn detailBackBtn--hero"
            onClick={() => history.goBack()}
            aria-label="Go back"
          >
            ← Back
          </button>
          <div className="detailHero__content">
            <div className="detailHero__posterWrap">
              <img
                src={content.poster_path ? `${img_500}${content.poster_path}` : unavailable}
                alt=""
                className="detailHero__poster"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = unavailable;
                }}
              />
            </div>
            <div className="detailHero__info">
              <h1 className="detailHero__title">
                {title} <span className="detailHero__year">({releaseYear})</span>
              </h1>
              {content.tagline && <p className="detailHero__tagline">{content.tagline}</p>}
              <div className="detailHero__meta">
                {content.vote_average != null && (
                  <span className="detailHero__metaItem">
                    <span className="detailHero__metaLabel">IMDb</span>
                    {Number(content.vote_average).toFixed(1)}
                  </span>
                )}
                <span className="detailHero__metaItem">{type === "tv" ? "TV Series" : "Movie"}</span>
                {content.runtime && (
                  <span className="detailHero__metaItem">{content.runtime} min</span>
                )}
                {content.number_of_seasons != null && (
                  <span className="detailHero__metaItem">{content.number_of_seasons} seasons</span>
                )}
              </div>
              <p className="detailHero__overview">{content.overview || "No overview available."}</p>
              <div className="detailHero__actions">
                {videos.length > 0 && (
                  <a
                    href={`https://www.youtube.com/watch?v=${videos[0].key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detailHero__btn detailHero__btn--primary"
                  >
                    ▶ Trailer
                  </a>
                )}
                <button
                  type="button"
                  className={`detailHero__btn detailHero__btn--secondary ${inList ? "detailHero__btn--inList" : ""}`}
                  onClick={addToWatchlist}
                >
                  {inList ? "✓ In List" : "+ My List"}
                </button>
              </div>
              {watchProviders && (watchProviders.flatrate?.length || watchProviders.rent?.length || watchProviders.buy?.length) ? (
                <div className="detailProviders">
                  <span className="detailProviders__label">Where to watch</span>
                  <div className="detailProviders__list">
                    {watchProviders.flatrate?.slice(0, 5).map((p) => (
                      <span key={p.provider_id} className="detailProviders__item">
                        {p.provider_name}
                      </span>
                    ))}
                    {watchProviders.rent?.slice(0, 2).map((p) => (
                      <span key={`rent-${p.provider_id}`} className="detailProviders__item detailProviders__item--rent">
                        Rent: {p.provider_name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="pageLayout detailBody">
        {type === "tv" && seasons.length > 0 && (
          <section className="detailSection">
            <h2 className="detailSection__title">Seasons</h2>
            <div className="detailSeasons">
              {seasons.filter((s) => s.season_number >= 0).map((s) => (
                <div key={s.id} className="detailSeasonCard">
                  {s.poster_path ? (
                    <img
                      src={`${img_500}${s.poster_path}`}
                      alt={`Season ${s.season_number}`}
                      className="detailSeasonCard__img"
                    />
                  ) : (
                    <div className="detailSeasonCard__placeholder" />
                  )}
                  <div className="detailSeasonCard__info">
                    <strong>Season {s.season_number}</strong>
                    {s.episode_count != null && <span>{s.episode_count} episodes</span>}
                    {s.air_date && <span>{s.air_date.substring(0, 4)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.credits ? null : (
          <section className="detailSection">
            <h2 className="detailSection__title">Cast</h2>
            <div className="detailCarouselWrap">
              <Carousel id={id} media_type={type} />
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section className="detailSection">
            <h2 className="detailSection__title">Videos</h2>
            <div className="detailVideos">
              {videos.slice(0, 6).map((v) => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detailVideoCard"
                >
                  <span className="detailVideoCard__play">▶</span>
                  <span className="detailVideoCard__name">{v.name}</span>
                  <span className="detailVideoCard__type">{v.type}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {reviews.length > 0 && (
          <section className="detailSection">
            <h2 className="detailSection__title">Reviews</h2>
            <div className="detailReviews">
              {reviews.map((r) => (
                <div key={r.id} className="detailReviewCard">
                  <div className="detailReviewCard__head">
                    <strong>{r.author}</strong>
                    {r.created_at && (
                      <span className="detailReviewCard__date">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="detailReviewCard__content">
                    {r.content.length > 400 ? r.content.slice(0, 400) + "…" : r.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.belongs_to_collection && (
          <section className="detailSection">
            <h2 className="detailSection__title">Collection</h2>
            <button
              type="button"
              className="detailCollectionBtn"
              onClick={() => history.push(`/collection/${content.belongs_to_collection.id}`)}
            >
              {content.belongs_to_collection.name} →
            </button>
          </section>
        )}

        {similar.length > 0 && (
          <section className="detailSection">
            <h2 className="detailSection__title">More like this</h2>
            <div className="trending bentoGrid contentGrid">
              {similar.map((c, i) => (
                <SingleContent
                  key={c.id}
                  id={c.id}
                  poster={c.poster_path}
                  title={c.title || c.name}
                  date={c.first_air_date || c.release_date}
                  media_type={c.media_type || type}
                  vote_average={c.vote_average}
                  bentoSize={i === 0 ? "large" : i <= 2 ? "medium" : "small"}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Detail;
