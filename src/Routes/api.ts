const API_KEY = "570df7fe24c3555acd8d165491c55ad1";
const BASE_URL = "https://api.themoviedb.org/3";

export async function getMovies() {
  return await (
    await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko`)
  ).json();
}
