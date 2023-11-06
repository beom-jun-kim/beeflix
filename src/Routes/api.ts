const API_KEY = "570df7fe24c3555acd8d165491c55ad1";
const BASE_URL = "https://api.themoviedb.org/3";

interface IMovieResults {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
}

export interface IMoviesData {
  results: IMovieResults[];
  page: number;
  total_pages: number;
  total_results: number;

  dates?: {
    maximum: string;
    minimum: string;
  };
}

interface IGenresResults {
  id: number;
  name: string;
}

export interface IGenresProp {
  genres: IGenresResults[];
}

export const popularMovie = async () => {
  return await (
    await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko`)
  ).json();
};

export const nowPlayingMovies = async () => {
  return await (
    await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko`)
  ).json();
};

export const popularTv = async () => {
  return await (
    await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ko`)
  ).json();
};

export const toBeUpload = async () => {
  return await (
    await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ko`)
  ).json();
};

export const genresList = async () => {
  return await (
    await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=ko`)
  ).json();
};

export const search = async (keyword:string) => {
  return await (
    await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${keyword}&include_adult=false&language=ko&page=1`)
  ).json();
};