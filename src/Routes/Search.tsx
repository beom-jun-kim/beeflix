import { useQuery } from "react-query";
import { IMoviesData, search } from "./api";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utilities";
import Detail from "../Components/detail";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  padding: 150px 100px;
`;

const MovieListBox = styled.ul`
  display: flex;
  /* justify-content: center; */
  flex-wrap: wrap;
`;

const PosterBox = styled.div`
  overflow: hidden;
  height: 100%;
`;

const Poster = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 100%;
  background: url(${(prop) => prop.bgPhoto}) no-repeat center/cover;
  transition: 0.2s;
`;

const MovieList = styled(motion.li)`
  width: 20%;
  height: 200px;
  color: ${(prop) => prop.theme.white.lighter};
  padding: 10px;
  margin-bottom: 100px;
  cursor: pointer;
  &:hover ${Poster} {
    transform: scale(1.03);
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  padding: 15px;
  background-color: ${(prop) => prop.theme.black.lighter};
  white-space: wrap;
  word-break: keep-all;
  h4 {
    font-size: ${(prop) => prop.theme.fontSize.smallFont};
    color: ${(prop) => prop.theme.white.lighter};
    line-height: 20px;
  }
`;

const Title = styled.h4``;

function Search() {
  const navigate = useNavigate();
  const loaction = useLocation();
  const keyword = new URLSearchParams(loaction.search).get("keyword") || "";
  const { data: searchData } = useQuery<IMoviesData>(["search", keyword], () =>
    search(keyword)
  );
  const [moviesLender, setMoviesLender] = useState<IMoviesData | undefined>();

  const onBoxClicked = (videoId: any) => {
    const currentPath = window.location.pathname;
    const query = `?keyword=${keyword}`;
    const path = `${currentPath}/videos/${videoId}${query}`;
    navigate(path);
  };

  useEffect(() => {
    if (searchData) {
      setMoviesLender(searchData);
    }
  }, [searchData]);

  return (
    <Wrapper>
      <MovieListBox>
        {searchData?.results.map((movie) => (
          <MovieList
            key={movie.id}
            onClick={() => onBoxClicked(movie.id)}
            layoutId={movie.id + ""}
          >
            <PosterBox>
              <Poster
                bgPhoto={makeImagePath(
                  movie.backdrop_path || movie.poster_path
                )}
              ></Poster>
            </PosterBox>
            <Info>
              <Title>{movie.title ? movie.title : movie.name}</Title>
            </Info>
          </MovieList>
        ))}
        <Detail moviesData={searchData} />
      </MovieListBox>
    </Wrapper>
  );
}

export default Search;
