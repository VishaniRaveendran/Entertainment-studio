import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core";
import "./DiscoverFilters.css";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: { main: "#00d4ff" },
  },
});

const RATING_OPTIONS = [
  { value: "", label: "Any rating" },
  { value: "5", label: "5+" },
  { value: "6", label: "6+" },
  { value: "7", label: "7+" },
  { value: "8", label: "8+" },
  { value: "9", label: "9+" },
];

const ORDER_OPTIONS_MOVIE = [
  { value: "popularity.desc", label: "Popularity" },
  { value: "vote_average.desc", label: "Rating (high → low)" },
  { value: "vote_average.asc", label: "Rating (low → high)" },
  { value: "primary_release_date.desc", label: "Newest first" },
  { value: "primary_release_date.asc", label: "Oldest first" },
  { value: "title.asc", label: "Title (A–Z)" },
];

const ORDER_OPTIONS_TV = [
  { value: "popularity.desc", label: "Popularity" },
  { value: "vote_average.desc", label: "Rating (high → low)" },
  { value: "vote_average.asc", label: "Rating (low → high)" },
  { value: "first_air_date.desc", label: "Newest first" },
  { value: "first_air_date.asc", label: "Oldest first" },
  { value: "title.asc", label: "Title (A–Z)" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1940 + 1 }, (_, i) =>
  String(currentYear - i)
);

const menuProps = {
  PaperProps: { className: "discoverFilters__menuPaper" },
};

const DiscoverFilters = ({
  type,
  rating,
  setRating,
  year,
  setYear,
  orderBy,
  setOrderBy,
  setPage,
}) => {
  const orderOptions = type === "movie" ? ORDER_OPTIONS_MOVIE : ORDER_OPTIONS_TV;

  const handleRatingChange = (e) => {
    setRating(e.target.value);
    setPage(1);
  };
  const handleYearChange = (e) => {
    setYear(e.target.value);
    setPage(1);
  };
  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
    setPage(1);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="discoverFilters">
        <div className="discoverFilters__row">
          <FormControl variant="outlined" size="small" className="discoverFilters__control">
            <InputLabel id="filter-rating">Rating</InputLabel>
            <Select
              labelId="filter-rating"
              value={rating}
              onChange={handleRatingChange}
              label="Rating"
              MenuProps={menuProps}
            >
              {RATING_OPTIONS.map((opt) => (
                <MenuItem key={opt.value || "any"} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" className="discoverFilters__control">
            <InputLabel id="filter-year">Year</InputLabel>
            <Select
              labelId="filter-year"
              value={year}
              onChange={handleYearChange}
              label="Year"
              MenuProps={menuProps}
            >
              <MenuItem value="">
                <em>Any year</em>
              </MenuItem>
              {YEARS.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" className="discoverFilters__control discoverFilters__control--wide">
            <InputLabel id="filter-order">Order by</InputLabel>
            <Select
              labelId="filter-order"
              value={orderBy}
              onChange={handleOrderChange}
              label="Order by"
              MenuProps={menuProps}
            >
              {orderOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DiscoverFilters;
