import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import axios from "axios";
import "./ContentModel.css";
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from "../../config/config";
import { Button, IconButton } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import CloseIcon from "@material-ui/icons/Close";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Carousel from "../Carousel/Carousel";
import { useWatchlist } from "../../context/WatchlistContext";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    [theme.breakpoints.down("xs")]: {
      padding: 8,
      alignItems: "stretch",
    },
  },
  paper: {
    position: "relative",
    width: "90%",
    maxWidth: 900,
    height: "85%",
    maxHeight: 720,
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-subtle)",
    borderRadius: 24,
    color: "var(--text-primary)",
    boxShadow: "var(--shadow-lg), 0 0 40px rgba(0, 212, 255, 0.08)",
    padding: theme.spacing(2.5, 2.5, 3),
    outline: "none",
    animation: "scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
    [theme.breakpoints.down("sm")]: {
      width: "94%",
      height: "88%",
      maxHeight: "90vh",
      padding: theme.spacing(2, 2, 2.5),
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      maxWidth: "none",
      height: "95%",
      maxHeight: "95vh",
      borderRadius: 12,
      padding: theme.spacing(1.5, 1.5, 2),
    },
  },
}));

export default function TransitionsModal({ children, media_type, id }) {
  const classes = useStyles();
  const history = useHistory();
  const closeBtnRef = useRef(null);
  const { isInWatchlist, toggle } = useWatchlist();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const [video, setVideo] = useState();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(
      () => closeBtnRef.current?.focus({ preventScroll: true }),
      100
    );
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );

    setContent(data);
    // console.log(data);
  };

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setVideo(data.results[0]?.key);
  };

  useEffect(() => {
    fetchData();
    fetchVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, media_type]);

  const inList = content ? isInWatchlist(media_type, content.id) : false;
  const addToWatchlist = () => {
    if (!content) return;
    toggle({
      id: content.id,
      media_type,
      poster_path: content.poster_path,
      backdrop_path: content.backdrop_path,
      title: content.title || content.name,
      name: content.name,
      release_date: content.release_date,
      first_air_date: content.first_air_date,
      vote_average: content.vote_average,
    });
  };
  const detailPath = media_type === "movie" ? `/movie/${id}` : `/tv/${id}`;

  return (
    <>
      <div
        className="contentModalTrigger"
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => e.key === "Enter" && handleOpen()}
      >
        {children}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          {content && (
            <div className={classes.paper}>
              <IconButton
                ref={closeBtnRef}
                aria-label="Close"
                onClick={handleClose}
                className="ContentModal__closeBtn"
              >
                <CloseIcon />
              </IconButton>
              <div className="ContentModal">
                <img
                  src={
                    content.poster_path
                      ? `${img_500}${content.poster_path}`
                      : unavailable
                  }
                  alt={content.name || content.title}
                  className="ContentModal__portrait"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = unavailable;
                  }}
                />
                <img
                  src={
                    content.backdrop_path
                      ? `${img_500}${content.backdrop_path}`
                      : unavailableLandscape
                  }
                  alt={content.name || content.title}
                  className="ContentModal__landscape"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = unavailableLandscape;
                  }}
                />
                <div className="ContentModal__about">
                  <div className="ContentModal__header">
                    <span className="ContentModal__title">
                      {content.name || content.title}{" "}
                      <span className="ContentModal__year">
                        (
                        {(
                          content.first_air_date ||
                          content.release_date ||
                          ""
                        ).substring(0, 4) || "—"}
                        )
                      </span>
                    </span>
                    {content.tagline && (
                      <p className="ContentModal__tagline">{content.tagline}</p>
                    )}
                  </div>

                  <div className="ContentModal__descriptionWrap">
                    <span className="ContentModal__description">
                      {content.overview || "No overview available."}
                    </span>
                  </div>

                  <div className="ContentModal__carouselWrap">
                    <Carousel id={id} media_type={media_type} />
                  </div>

                  <div className="ContentModal__actions">
                    {video && (
                      <Button
                        variant="contained"
                        startIcon={<YouTubeIcon />}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.youtube.com/watch?v=${video}`}
                        className="ContentModal__trailerBtn"
                      >
                        Watch the Trailer
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      startIcon={
                        inList ? <PlaylistAddCheckIcon /> : <PlaylistAddIcon />
                      }
                      onClick={addToWatchlist}
                      className="ContentModal__listBtn"
                      size="small"
                    >
                      {inList ? "In List" : "My List"}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<OpenInNewIcon />}
                      onClick={() => {
                        handleClose();
                        history.push(detailPath);
                      }}
                      className="ContentModal__detailBtn"
                      size="small"
                    >
                      Full page
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Fade>
      </Modal>
    </>
  );
}
