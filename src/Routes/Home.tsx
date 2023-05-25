import { useQuery } from "react-query";
import { getMovies, IMovieProps } from "./api";
import styled from "styled-components";
import { makeImagePath } from "../utilities";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
  height: 100vh;
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
  font-size: ${(props) => props.theme.fontSize.bigFont};
  margin-bottom: 20px;
  color: ${(prop) => prop.theme.white.lighter};
`;

const OverView = styled.p`
  font-size: ${(props) => props.theme.fontSize.nomalFont};
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
  background: green;
  height: 200px;
  line-height: 200px;
  text-align: center;
  font-size: 30px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
`;

function Home() {
  const { isLoading, data } = useQuery<IMovieProps>(
    // 현재 상영 중인(now playing) 영화에 대한 데이터임을 구분하기 위한 식별자
    ["movies", "nowPlaying"],
    getMovies
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const slideBtn = () => {
    // if문으로 감싸주지 않으면 data가 number || undefined이기 때문
    if (data) {
      if (leaving) return;
      toggleLeaving();

      // 메인 배너 영화 1개를 썼기 때문에 -1
      const totalMovie = data.results.length - 1;

      // ceil : 올림처리
      // page가 0에서 시작하기 때문에 -1
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
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
                animate="visibel"
                exit="exit"
                transition={{ type: "tween", duration: 0.5, delay: 0.3 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      bgPhoto={makeImagePath(movie.backdrop_path)}
                    />
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
