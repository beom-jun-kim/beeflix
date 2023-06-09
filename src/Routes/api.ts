const API_KEY = "570df7fe24c3555acd8d165491c55ad1";
const BASE_URL = "https://api.themoviedb.org/3";

interface IMovieResults {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
}

export interface IMovieProps {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovieResults[];
  total_pages: number;
  total_results: number;
}

export async function getMovies() {
  return await (
    await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko`)
  ).json();
}
