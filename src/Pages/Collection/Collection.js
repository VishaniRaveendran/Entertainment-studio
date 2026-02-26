import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { img_1280, img_500, unavailable } from "../../config/config";
import SingleContent from "../../components/SingleContent/SingleContent";
import "./Collection.css";

const API_BASE = "https://api.themoviedb.org/3";
const key = () => process.env.REACT_APP_API_KEY;

const Collection = () => {
  const { id } = useParams();
  const history = useHistory();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${API_BASE}/collection/${id}?api_key=${key()}&language=en-US`)
      .then((res) => setCollection(res.data))
      .catch(() => setCollection(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="collectionPage">
        <div className="pageLayout">
          <div className="collectionSkeleton" />
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="collectionPage">
        <div className="pageLayout">
          <p className="collectionError">Collection not found.</p>
          <button type="button" className="collectionBackBtn" onClick={() => history.push("/")}>
            Go home
          </button>
        </div>
      </div>
    );
  }

  const parts = collection.parts || [];
  const backdrop = collection.backdrop_path || parts[0]?.backdrop_path;
  const poster = collection.poster_path || parts[0]?.poster_path;

  const getBentoSize = (i) => {
    if (i === 0) return "large";
    if (i <= 2) return "medium";
    return "small";
  };

  return (
    <div className="collectionPage">
      <section className="collectionHero">
        {backdrop && (
          <>
            <div
              className="collectionHero__bg"
              style={{ backgroundImage: `url(${img_1280}${backdrop})` }}
            />
            <div className="collectionHero__overlay" />
          </>
        )}
        <div className="collectionHero__inner pageLayout">
          <button
            type="button"
            className="collectionBackBtn collectionBackBtn--hero"
            onClick={() => history.goBack()}
          >
            ← Back
          </button>
          <div className="collectionHero__content">
            {poster && (
              <div className="collectionHero__posterWrap">
                <img
                  src={`${img_500}${poster}`}
                  alt=""
                  className="collectionHero__poster"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = unavailable;
                  }}
                />
              </div>
            )}
            <div className="collectionHero__info">
              <h1 className="collectionHero__title">{collection.name}</h1>
              {collection.overview && (
                <p className="collectionHero__overview">{collection.overview}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="pageLayout collectionBody">
        <div className="pageTitle">{collection.name} — Movies</div>
        <div className="trending bentoGrid contentGrid">
          {parts.map((c, i) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title}
              date={c.release_date}
              media_type="movie"
              vote_average={c.vote_average}
              bentoSize={getBentoSize(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
