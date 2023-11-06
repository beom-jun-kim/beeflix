import { useQuery } from "react-query";
import { nowPlayingMovies, IMoviesData, popularTv, popularMovie , toBeUpload} from "./api";
import CommonSlider from "../Components/commonSlider";
import MainBanner from "../Components/mainBanner";
import { useState, useEffect } from "react";

function Home() {

  const [moviesLender , setMoviesLender] = useState<IMoviesData | undefined>()

  const { data: popularMovieData } = useQuery<IMoviesData>(
    ["popularMovie"],
    popularMovie
  );

  const { data: nowPlayingMoviesData } = useQuery<IMoviesData>(
    ["nowPlaying"],
    nowPlayingMovies
  );

  const { data: popularTvData } = useQuery<IMoviesData>(
    ["popularTv"],
    popularTv
  );

  const { data: toBoUploadData } = useQuery<IMoviesData>(
    ["upcoming"],
    toBeUpload
  );

  const data = popularMovieData && nowPlayingMoviesData && popularTvData && toBoUploadData

  useEffect(() => {
    if(data){
      setMoviesLender(data);
    }
  },[data])


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
        moviesData={toBoUploadData}
        offset={offset}
        text="넷플릭스 인기 컨텐츠"
      />

      <CommonSlider
        moviesData={popularTvData}
        offset={offset}
        text="출시 예정작"
      />
    </>
  );
}

export default Home;
