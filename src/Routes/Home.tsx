import { useQuery } from "react-query";
import { getMovies, IMovieProps } from "./api";
import styled from "styled-components";
import { makeImagePath } from "../utilities";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

interface StylesProps {
  prop: any;
}

const Wrapper = styled.div`
  /* height: 100vh; */
  background-color: black;
`;
const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainBanner = styled.div<{ bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9)),
    url(${(prop) => prop.bgPhoto});
  background-size: cover;
  padding: 60px;
`;

const Title = styled.h2`
  font-size: ${(prop) => prop.theme.fontSize.bigFont};
  margin-bottom: 20px;
  color: ${(prop) => prop.theme.white.lighter};
`;

const OverView = styled.p`
  font-size: ${(prop) => prop.theme.fontSize.nomalFont};
  width: 45%;
  height: 80px;
  line-height: 28px;
  color: ${(prop) => prop.theme.white.lighter};
  overflow: hidden;
  word-break: keep-all;
`;

const Slider = styled.div`
  position: relative;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  height: 200px;
  font-size: 30px;
  background-image: url(${(prop) => prop.bgPhoto});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  width: 100%;
  opacity: 0;
  padding: 10px;
  background-color: ${(prop) => prop.theme.black.lighter};
  position: absolute;
  bottom: 0;
  white-space: nowrap;
  h4 {
    font-size: 15px;
    color: ${(prop) => prop.theme.white.darker};
    text-align: center;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const DetailMovie = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 100vh;
  background-color: ${(prop) => prop.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const DetailImg = styled.div`
  height: 400px;
  background-position: center;
  background-size: cover;
`;
const DetailTitle = styled.h2`
  color: ${(prop) => prop.theme.white.darker};
  text-align: center;
`;

const InfoTitle = styled.h4``;

function Home() {
  const navigate = useNavigate();
  const matchModalBox = useMatch("movies/:movieId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IMovieProps>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const slideBtn = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const overlayClicked = () => navigate("/");
  const clickedMovie = matchModalBox?.params.movieId && data?.results.find( (movie) => movie.id + "" === matchModalBox.params.movieId);

  // window.outerWidth : 브라우저 전체의 너비
  //window.innerWidth : 브라우저 화면의 너비
  const slideVars = {
    hidden: {
      x: window.outerWidth,
    },
    visible: {
      x: 0,
    },
    exit: {
      x: -window.outerWidth,
    },
  };

  const videoVars = {
    start: {
      scale: 1,
    },
    hover: {
      scale: 1.3,
      y: -50,
      transition: {
        delay: 0.3,
        type: "tween",
      },
    },
  };

  const infoVars = {
    hover: {
      opacity: 1,
      transition: {
        delay: 0.3,
        type: "tween",
      },
    },
  };

  const offset = 6;

  // <></> : fragment 많은 요소를 공통된 부모없이 연이어서 리턴하는법
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <MainBanner
            onClick={slideBtn}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </MainBanner>

          <Slider>
            {/* onExitComplete : exit이 끝났을 때 실행 */}
            {/* initial={false} : 컴포넌트가 처음 Mount될 때 오른쪽에서 들어오지X */}
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={slideVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.5, delay: 0.3 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      // 베리언트는 자식 컴포넌트에도 상속된다
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={videoVars}
                      initial="start"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      key={movie.id}
                      bgPhoto={makeImagePath(
                        movie.backdrop_path || movie.poster_path
                      )}
                    >
                      <Info variants={infoVars}>
                        <InfoTitle>{movie.title}</InfoTitle>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {matchModalBox ? (
              <>
                <Overlay
                  onClick={overlayClicked}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <DetailMovie
                  layoutId={matchModalBox.params.movieId}
                  style={{
                    top: scrollY.get() + 30,
                  }}
                >
                  {clickedMovie && (
                    <>
                      <DetailImg
                        style={{
                          backgroundImage: `linear-gradient(to top,black,transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path
                          )})`,
                        }}
                      />
                      <DetailTitle>{clickedMovie.title}</DetailTitle>
                    </>
                  )}
                </DetailMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
