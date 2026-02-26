import { img_300, unavailable } from "../../config/config";
import "./SingleContent.css";
import ContentModal from "../ContentModel/ContentModel";

const getRatingClass = (vote) => {
  if (vote > 6) return "media__badge--high";
  if (vote > 4) return "media__badge--mid";
  return "media__badge--low";
};

const SingleContent = ({
  id,
  poster,
  title,
  date,
  media_type,
  vote_average,
  bentoSize,
}) => {
  const hasRating =
    vote_average != null && vote_average !== "" && !Number.isNaN(Number(vote_average));
  const bentoClass = bentoSize ? `bento--${bentoSize}` : "";

  return (
    <ContentModal media_type={media_type} id={id}>
      <div className={`media ${bentoClass}`}>
        <div className="media__posterWrap">
          {hasRating && (
            <span className={`media__badge ${getRatingClass(vote_average)}`}>
              {Number(vote_average).toFixed(1)}
            </span>
          )}
          <img
            className="poster"
            src={poster ? `${img_300}${poster}` : unavailable}
            alt={title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = unavailable;
            }}
          />
        </div>
        <div className="media__info">
          <b className="title">{title}</b>
          <span className="subTitle">
            <span className="media__type">
              {media_type === "tv" ? "TV Series" : "Movie"}
            </span>
            <span className="media__date">{date}</span>
          </span>
        </div>
      </div>
    </ContentModal>
  );
};

export default SingleContent;
