import { useQuery } from "react-query";
import { getMovies, IMovieProps } from "./api";
import styled from "styled-components";
import { makeImagePath } from "../utilities";

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

function Home() {
  const { isLoading, data } = useQuery<IMovieProps>(
    // movies라는 데이터 이름의 nowPlaying이라는 식별자를 가진 데이터를 가져오고, 이를 캐싱하여 재사용
    // 현재 상영 중인(now playing) 영화에 대한 데이터임을 구분하기 위한 식별자
    ["movies", "nowPlaying"],
    getMovies
  );

  // <></> : fragment 많은 요소를 공통된 부모없이 연이어서 리턴하는법
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <MainBanner
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </MainBanner>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
