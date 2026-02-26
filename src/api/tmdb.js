import axios from "axios";

const BASE = "https://api.themoviedb.org/3";
const key = () => process.env.REACT_APP_API_KEY;

function params(extra = {}) {
  return { api_key: key(), language: "en-US", ...extra };
}

export async function get(path, searchParams = {}) {
  const p = new URLSearchParams({ ...params(), ...searchParams });
  const { data } = await axios.get(`${BASE}${path}?${p.toString()}`);
  return data;
}

export async function getWithRegion(path, options = {}) {
  const { language, region } = options;
  const p = new URLSearchParams({
    api_key: key(),
    language: language || "en-US",
    ...(region ? { region } : {}),
    ...options,
  });
  const { data } = await axios.get(`${BASE}${path}?${p.toString()}`);
  return data;
}

export function buildImageUrl(path, size = "w300") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
