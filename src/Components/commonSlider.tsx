import styled from "styled-components";
import { makeImagePath } from "../utilities";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

const MainBanner = styled.div<{ bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(prop) => prop.bgPhoto});
  background-size: cover;
  background-position: center;
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
  position: relative;
  &:after {
    content: "...";
    position: absolute;
    font-size: ${(prop) => prop.theme.fontSize.nomalFont};
    letter-spacing: 1px;
  }
`;

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  position: relative;
  &:nth-child(n + 3) {
    margin-top: 70px;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
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

const SliderBtn = styled.button`
  width: 35px;
  height: 35px;
  border: 3px solid white;
  cursor: pointer;
  outline: none;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PrevBtn = styled(SliderBtn)`
  right: 50px;
  margin-right: 5px;
`;

const StateTitle = styled.h1`
  color: ${(prop) => prop.theme.white.lighter};
  font-weight: 400;
  font-size: ${(prop) => prop.theme.fontSize.nomalFont};
`;

const SliderConent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px 15px 30px;
`;

const ArrowBox = styled.div`
  display: flex;
`;

function CommonSlider(moviesData: any, offset: number, text: string) {
  console.log("moviesData:", moviesData);
  const navigate = useNavigate();
  const matchModalBox = useMatch("movies/:movieId");
  const { scrollY } = useScroll();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const nextSlideBtn = () => {
    if (moviesData) {
      setLeaving(true);
      const totalMovies = moviesData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      toggleDisabled();
    }
  };

  const prevSlideBtn = () => {
    if (moviesData) {
      setLeaving(false);
      const totalMovies = moviesData.results.length - 1;
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
    moviesData?.results.find(
      (movie: any) => movie.id + "" === matchModalBox.params.movieId
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

  // <></> : fragment 많은 요소를 공통된 부모없이 연이어서 리턴하는법
  return (
    <Wrapper>
      {!moviesData ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {moviesData.results && moviesData.results.length > 0 && (
            <MainBanner
              bgPhoto={makeImagePath(
                moviesData?.results[0].backdrop_path || ""
              )}
            >
              <Title>{moviesData?.results[0].title}</Title>
              <OverView>{moviesData?.results[0].overview}</OverView>
            </MainBanner>
          )}

          <Slider>
            {/* <SliderConent>
              <StateTitle>{text}</StateTitle>
              <ArrowBox>
                <PrevBtn onClick={prevSlideBtn} disabled={disabled}>
                  <FaAngleLeft color="white" />
                </PrevBtn>
                <SliderBtn onClick={nextSlideBtn} disabled={disabled}>
                  <FaAngleRight color="white" />
                </SliderBtn>
              </ArrowBox>
            </SliderConent> */}

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
                {moviesData?.results &&
                  moviesData.results.length > 1 &&
                  moviesData.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie: any) => (
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

export default CommonSlider;
