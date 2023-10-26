import { useQuery } from "react-query";
import { getMovies, IMoviesData, popularMovies } from "./api";
import CommonSlider from "../Components/commonSlider";

function Home() {
  const { data: nowPlayingMoviesData } = useQuery<IMoviesData>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const { data: popularMoviesData } = useQuery<IMoviesData>(
    ["movies", "popular"],
    popularMovies
  );

  console.log("nowPlayingMoviesData", nowPlayingMoviesData);
  console.log("popularMoviesData", popularMoviesData);

  const offset = 6;

  return (
    <>
      <CommonSlider
        moviesData={nowPlayingMoviesData}
        offset={offset}
        text="떴다! 넷플릭스 신작"
      />

      <CommonSlider
        moviesData={popularMoviesData}
        offset={offset}
        text="넷플릭스 인기 컨텐츠"
      />
    </>
  );
}

export default Home;
