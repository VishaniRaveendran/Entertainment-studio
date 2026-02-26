# Entertainment Studio

A React app for discovering movies and TV series. Browse trending titles, search, filter by genre and year, view details, cast, trailers, and save items to a personal watchlist.

## Features

- **Trending** — Hero and grid of trending movies/TV (today or this week)
- **Movies** — Discover movies with filters: rating, year, sort order, and genre chips
- **TV Series** — Same discover experience for TV shows
- **Search** — Search movies or TV by title; supports URL query (`/search?q=...`) and header search
- **My List** — Watchlist saved in the browser (add/remove from cards or detail view)
- **Detail pages** — Full movie/TV pages with overview, cast, trailers, reviews, “where to watch,” similar titles, and (for TV) seasons
- **Person pages** — Cast member pages with bio and filmography
- **Collections** — View movie collections (e.g. franchise)
- **Genre pages** — Browse by genre via `/movies/genre/:id` and `/series/genre/:id`
- **Theme** — Dark/light mode toggle (persisted)
- **PWA** — Installable; basic offline shell via service worker

## Setup

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd Entertainment-studio
   npm install
   ```

2. **TMDB API key**

   Get a free API key from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api).

   Create a `.env` in the project root:

   ```env
   REACT_APP_API_KEY=your_tmdb_api_key_here
   ```

3. **Run the app**

   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm start`    | Run dev server (port 3000) |
| `npm run build`| Production build in `build/` |
| `npm test`     | Run tests                  |

## Tech stack

- **React** 17, **React Router** 5
- **Material-UI** (MUI) 4 — components and icons
- **Axios** — API requests
- **TMDB API** — movies, TV, people, images

## Project structure

```
src/
├── api/           # TMDB helpers
├── components/    # Header, Sidebar, Carousel, DiscoverFilters, Genres, etc.
├── context/      # Theme, Watchlist, Settings
├── config/       # Image URLs, fallbacks
├── hooks/        # useGenre
├── Pages/        # Trending, Movies, Series, Search, MyList, Detail, Person, Collection, Genre
├── App.js
└── index.js
```

## Routes

| Path | Page |
|------|------|
| `/` | Trending |
| `/movies` | Discover movies |
| `/series` | Discover TV series |
| `/search` | Search (optional `?q=...`) |
| `/mylist` | My watchlist |
| `/movie/:id` | Movie detail |
| `/tv/:id` | TV detail |
| `/person/:id` | Person (cast/crew) |
| `/collection/:id` | Collection |
| `/movies/genre/:genreId` | Movies by genre |
| `/series/genre/:genreId` | TV by genre |

## Learn more

- [Create React App](https://create-react-app.dev/)
- [TMDB API](https://developers.themoviedb.org/3)
- [React](https://reactjs.org/) · [Material-UI](https://v4.mui.com/)
