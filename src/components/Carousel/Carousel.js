import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { img_300, noPicture } from "../../config/config";
import "./Carousel.css";

const handleDragStart = (e) => e.preventDefault();

const Gallery = ({ id, media_type }) => {
  const history = useHistory();
  const [credits, setCredits] = useState([]);

  const items = credits.map((c) => (
    <div
      key={c.credit_id || c.id}
      className="carouselItem carouselItem--clickable"
      role="button"
      tabIndex={0}
      onClick={() => c.id && history.push(`/person/${c.id}`)}
      onKeyDown={(e) =>
        e.key === "Enter" && c.id && history.push(`/person/${c.id}`)
      }
    >
      <img
        src={c.profile_path ? `${img_300}${c.profile_path}` : noPicture}
        alt={c?.name}
        onDragStart={handleDragStart}
        className="carouselItem__img"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = noPicture;
        }}
      />
      <b className="carouselItem__txt">{c?.name}</b>
    </div>
  ));

  const responsive = {
    0: { items: 2 },
    360: { items: 2 },
    480: { items: 3 },
    640: { items: 4 },
    768: { items: 4 },
    1024: { items: 4 },
    1280: { items: 4 },
  };

  const fetchCredits = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setCredits(data.cast);
  };

  useEffect(() => {
    fetchCredits();
    // eslint-disable-next-line
  }, []);

  return (
    <AliceCarousel
      mouseTracking
      infinite
      disableDotsControls
      disableButtonsControls
      responsive={responsive}
      items={items}
      autoPlay
    />
  );
};

export default Gallery;
