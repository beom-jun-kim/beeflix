

import { useQuery } from "react-query";
import {
  nowPlayingMovies,
  IMoviesData,
  popularTv,
  popularMovie,
  toBeUpload,
} from "./api";
import CommonSlider from "../Components/commonSlider";
import { useState, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 100px;
`;

function Weekend() {
  const [moviesLender, setMoviesLender] = useState<IMoviesData | undefined>();

  const { data: popularMovieData } = useQuery<IMoviesData>(
    ["popularMovie"],
    popularMovie
  );

  console.log(popularMovieData);

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

  const data =
    popularMovieData && nowPlayingMoviesData && popularTvData && toBoUploadData;

  useEffect(() => {
    if (data) {
      setMoviesLender(data);
    }
  }, [data]);

  const offset = 6;

  return (
    <Wrapper>
      <CommonSlider
        moviesData={popularTvData}
        offset={offset}
        text="추리소설 원작"
      />

      <CommonSlider
        moviesData={toBoUploadData}
        offset={offset}
        text="옛 추억에 젖고 싶다면"
      />

      <CommonSlider
        moviesData={nowPlayingMoviesData}
        offset={offset}
        text="밤새 시간가는 줄 모르는"
      />
    </Wrapper>
  );
}

export default Weekend;
