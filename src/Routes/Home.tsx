import { useQuery } from "react-query";
import { nowPlayingMovies, IMoviesData, popularTv, popularMovie } from "./api";
import CommonSlider from "../Components/commonSlider";
import MainBanner from "../Components/mainBanner";

function Home() {
  const { data: popularMovieData } = useQuery<IMoviesData>(
    ["movies", "popular"],
    popularMovie
  );

  const { data: nowPlayingMoviesData } = useQuery<IMoviesData>(
    ["movies", "nowPlaying"],
    nowPlayingMovies
  );

  const { data: popularTvData } = useQuery<IMoviesData>(
    ["tv", "popular"],
    popularTv
  );

  const offset = 6;

  return (
    <>
      <MainBanner moviesData={popularMovieData} />

      <CommonSlider
        moviesData={nowPlayingMoviesData}
        offset={offset}
        text="떴다! 넷플릭스 신작"
      />

      <CommonSlider
        moviesData={popularTvData}
        offset={offset}
        text="넷플릭스 인기 컨텐츠"
      />
    </>
  );
}

export default Home;
