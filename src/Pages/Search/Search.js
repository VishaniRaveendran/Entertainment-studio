import {
  Button,
  createMuiTheme,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
} from "@material-ui/core";
import "./Search.css";
import SearchIcon from "@material-ui/icons/Search";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";

const getBentoSize = (i) => {
  if (i === 0) return "large";
  if (i <= 2) return "medium";
  return "small";
};

const Search = () => {
  const location = useLocation();
  const queryFromUrl = new URLSearchParams(location.search).get("q") || "";
  const [type, setType] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const [hasSearched, setHasSearched] = useState(false);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    if (queryFromUrl) {
      setSearchText(queryFromUrl);
    }
  }, [queryFromUrl]);

  const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
      primary: { main: "#00d4ff" },
    },
  });

  const fetchSearch = async (overrideQuery) => {
    const query = (overrideQuery ?? searchText).trim();
    if (!query) return;
    setHasSearched(true);
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${
          process.env.REACT_APP_API_KEY
        }&language=en-US&query=${encodeURIComponent(
          query
        )}&page=${page}&include_adult=false`
      );
      setContent(data.results || []);
      setNumOfPages(data.total_pages || 0);
    } catch (error) {
      console.error(error);
      setContent([]);
    }
  };

  const fetchPopular = async () => {
    try {
      const endpoint = type === 0 ? "movie" : "tv";
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/trending/${endpoint}/week?api_key=${process.env.REACT_APP_API_KEY}&page=1`
      );
      setPopular(data.results || []);
    } catch (error) {
      console.error(error);
      setPopular([]);
    }
  };

  useEffect(() => {
    if (searchText.trim()) {
      window.scroll(0, 0);
      fetchSearch();
    } else {
      setHasSearched(false);
      setContent([]);
      setNumOfPages(0);
      fetchPopular();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, page]);

  useEffect(() => {
    if (!searchText.trim()) {
      setHasSearched(false);
      fetchPopular();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    if (queryFromUrl.trim()) {
      setHasSearched(true);
      fetchSearch(queryFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryFromUrl]);

  const showPopular = !hasSearched && !searchText.trim();
  const displayContent = searchText.trim() ? content : popular;
  const isSearchResults = searchText.trim() && hasSearched;

  return (
    <div className="searchPage">
      <div className="pageLayout">
        <div className="pageTitle">Search Movies & TV</div>
        <ThemeProvider theme={darkTheme}>
          <div className="search">
            <div className="searchBoxWrap">
              <TextField
                fullWidth
                label="Search by title..."
                variant="filled"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchSearch()}
              />
            </div>
            <Button
              onClick={fetchSearch}
              variant="contained"
              className="searchBtn"
              aria-label="Search"
            >
              <SearchIcon />
            </Button>
          </div>
          <Tabs
            value={type}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, newValue) => {
              setType(newValue);
              setPage(1);
            }}
            className="searchTabs"
            aria-label="Search type"
          >
            <Tab style={{ width: "50%" }} label="Movies" />
            <Tab style={{ width: "50%" }} label="TV Series" />
          </Tabs>
        </ThemeProvider>

        {showPopular && (
          <p className="searchInitialMessage">
            {type === 0
              ? "Popular movies this week — or search above to find something specific."
              : "Popular TV series this week — or search above to find something specific."}
          </p>
        )}

        <div className="trending bentoGrid contentGrid">
          {displayContent &&
            displayContent.length > 0 &&
            displayContent.map((c, i) => (
              <SingleContent
                key={c.id}
                id={c.id}
                poster={c.poster_path}
                title={c.title || c.name}
                date={c.first_air_date || c.release_date}
                media_type={type ? "tv" : "movie"}
                vote_average={c.vote_average}
                bentoSize={getBentoSize(i)}
              />
            ))}
          {isSearchResults && content.length === 0 && (
            <p className="searchEmpty">
              {type
                ? "No TV series found. Try another search."
                : "No movies found. Try another search."}
            </p>
          )}
        </div>
        {isSearchResults && numOfPages > 1 && (
          <CustomPagination setPage={setPage} numOfPages={numOfPages} />
        )}
      </div>
    </div>
  );
};

export default Search;
