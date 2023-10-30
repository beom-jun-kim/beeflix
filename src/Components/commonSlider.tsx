import styled from "styled-components";
import { makeImagePath } from "../utilities";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { IMoviesData } from "../Routes/api";
import Detail from "./detail";

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
  margin-bottom: 80px;
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

interface ISliderData {
  moviesData: IMoviesData | undefined;
  offset: number;
  text: string;
}

function CommonSlider({ moviesData, offset, text }: ISliderData) {
  const navigate = useNavigate();
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
  const onBoxClicked = (videoId: number) => {
    navigate(`/videos/${videoId}`);
  };

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
          <Slider>
            <SliderConent>
              <StateTitle>{text}</StateTitle>
              <ArrowBox>
                <PrevBtn onClick={prevSlideBtn} disabled={disabled}>
                  <FaAngleLeft color="white" />
                </PrevBtn>
                <SliderBtn onClick={nextSlideBtn} disabled={disabled}>
                  <FaAngleRight color="white" />
                </SliderBtn>
              </ArrowBox>
            </SliderConent>

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
                {moviesData?.results
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
                        <InfoTitle>
                          {movie.title ? movie.title : movie.name}
                        </InfoTitle>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <Detail moviesData={moviesData} />
        </>
      )}
    </Wrapper>
  );
}

export default CommonSlider;
