import { useQuery } from "react-query";
import {
  getMovies,
  INowPlayingMovieProps,
  IMovieList,
  popularMovies,
} from "./api";
import styled from "styled-components";
import { makeImagePath } from "../utilities";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import {FaAccusoft} from "react-icons/fa";

const Wrapper = styled.div`
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
  background-position:center;
  padding: 60px;
  margin-bottom: 50px;
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

const NextBtn = styled.button`
  width: 30px;
  height: 30px;
  background: white;
  cursor: pointer;
  position: absolute;
  top: -50px;
  right: 0;
  z-index: 10;
  outline: none;
  border: none;
`;

const PrevBtn = styled(NextBtn)`
  right: 35px;
  background: red;
`;

function Home() {
  const navigate = useNavigate();
  const matchModalBox = useMatch("movies/:movieId");
  const { scrollY } = useScroll();
  const { data: nowPlayingMoviesData, isLoading: nowPlayingMoviesLoading } =
    useQuery<INowPlayingMovieProps>(["movies", "nowPlaying"], getMovies);

  const { data: popularMoviesData, isLoading: popularMoviesLoading } =
    useQuery<IMovieList>(["movies", "popular"], popularMovies);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const nextSlideBtn = () => {
    if (nowPlayingMoviesData) {
      setLeaving(true);
      const totalMovies = nowPlayingMoviesData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      toggleDisabled();
    }
  };

  const prevSlideBtn = () => {
    if (nowPlayingMoviesData) {
      setLeaving(false);
      const totalMovies = nowPlayingMoviesData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      toggleDisabled();
    }
  };

  const toggleDisabled = () => setDisabled((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const overlayClicked = () => navigate("/");
  const clickedMovie =
    matchModalBox?.params.movieId &&
    nowPlayingMoviesData?.results.find(
      (movie) => movie.id + "" === matchModalBox.params.movieId
    );

  // window.outerWidth : 브라우저 전체의 너비
  //window.innerWidth : 브라우저 화면의 너비
  const slideVars = {
    hidden: (leaving: boolean) => {
      return {
        x: leaving ? window.outerWidth : -window.outerWidth,
      };
    },
    visible: {
      x: 0,
    },
    exit: (leaving: boolean) => {
      return {
        x: leaving ? -window.outerWidth : window.outerWidth,
      };
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
      <FaAccusoft size="500" color="white"/>
      {nowPlayingMoviesLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <MainBanner
            bgPhoto={makeImagePath(
              nowPlayingMoviesData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingMoviesData?.results[0].title}</Title>
            <OverView>{nowPlayingMoviesData?.results[0].overview}</OverView>
          </MainBanner>

          {/* now playing */}
          <Slider>
            <NextBtn onClick={nextSlideBtn} disabled={disabled} />
            <PrevBtn onClick={prevSlideBtn} disabled={disabled} />
            <AnimatePresence
              initial={false}
              onExitComplete={toggleDisabled}
              custom={leaving}
            >
              <Row
                variants={slideVars}
                custom={leaving}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.5, delay: 0.3 }}
                key={index}
              >
                {nowPlayingMoviesData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
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

          {/* popular
          <Slider className={styles.slider__box}>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={slideVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.5, delay: 0.3 }}
                key={index}
              >
                {popularMoviesData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
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
          </Slider> */}

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
