import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { img_500, noPicture } from "../../config/config";
import SingleContent from "../../components/SingleContent/SingleContent";
import "./Person.css";

const API_BASE = "https://api.themoviedb.org/3";
const key = () => process.env.REACT_APP_API_KEY;

const Person = () => {
  const { id } = useParams();
  const history = useHistory();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      axios.get(`${API_BASE}/person/${id}?api_key=${key()}&language=en-US`),
      axios.get(`${API_BASE}/person/${id}/combined_credits?api_key=${key()}&language=en-US`),
    ])
      .then(([personRes, creditsRes]) => {
        setPerson(personRes.data);
        const cast = creditsRes.data.cast || [];
        cast.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        setCredits(cast.slice(0, 24));
      })
      .catch(() => setPerson(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="personPage">
        <div className="pageLayout">
          <div className="personSkeleton" />
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="personPage">
        <div className="pageLayout">
          <p className="personError">Person not found.</p>
          <button type="button" className="personBackBtn" onClick={() => history.push("/")}>
            Go home
          </button>
        </div>
      </div>
    );
  }

  const getBentoSize = (i) => {
    if (i === 0) return "large";
    if (i <= 2) return "medium";
    return "small";
  };

  return (
    <div className="personPage">
      <div className="pageLayout">
        <button
          type="button"
          className="personBackBtn"
          onClick={() => history.goBack()}
          aria-label="Go back"
        >
          ← Back
        </button>
        <section className="personHero">
          <div className="personHero__poster">
            <img
              src={person.profile_path ? `${img_500}${person.profile_path}` : noPicture}
              alt={person.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = noPicture;
              }}
            />
          </div>
          <div className="personHero__info">
            <h1 className="personHero__name">{person.name}</h1>
            {person.known_for_department && (
              <p className="personHero__dept">{person.known_for_department}</p>
            )}
            {person.birthday && (
              <p className="personHero__meta">
                <strong>Born:</strong> {person.birthday}
                {person.place_of_birth && ` · ${person.place_of_birth}`}
              </p>
            )}
            {person.biography && (
              <div className="personHero__bio">
                <h2>Biography</h2>
                <p>{person.biography}</p>
              </div>
            )}
          </div>
        </section>

        {credits.length > 0 && (
          <section className="personSection">
            <h2 className="personSection__title">Known for</h2>
            <div className="trending bentoGrid contentGrid">
              {credits.map((c, i) => (
                <SingleContent
                  key={`${c.media_type}-${c.id}-${c.credit_id}`}
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
          </section>
        )}
      </div>
    </div>
  );
};

export default Person;
