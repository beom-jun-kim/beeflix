import styled from "styled-components";
import { makeImagePath } from "../utilities";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IMoviesData } from "../Routes/api";
import Detail from "./detail";

const MainCard = styled.div<{ bgPhoto: string }>`
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

const DetailBtn = styled(motion.button)`
  width: 150px;
  padding: 10px 0;
  background: none;
  border: 3px solid ${(prop) => prop.theme.white.lighter};
  color: ${(prop) => prop.theme.white.lighter};
  font-size: ${(prop) => prop.theme.fontSize.nomalFont};
  margin-top: 20px;
  cursor: pointer;
`;

interface IMainBanner {
  moviesData: IMoviesData | undefined;
}

function MainBanner({ moviesData }: IMainBanner) {
  const navigate = useNavigate();
  const onBoxClicked = () => {
    if (moviesData?.results) {
      const videoId = moviesData.results[0].id;
      navigate(`/videos/${videoId}`);
    }
  };

  // <></> : fragment 많은 요소를 공통된 부모없이 연이어서 리턴하는법
  return (
    <Wrapper>
      {!moviesData ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {moviesData?.results && (
            <MainCard
              bgPhoto={makeImagePath(
                moviesData?.results[0].backdrop_path || ""
              )}
            >
              <Title>{moviesData?.results[0].title}</Title>
              <OverView>{moviesData?.results[0].overview}</OverView>
              <DetailBtn onClick={onBoxClicked}>상세보기</DetailBtn>
            </MainCard>
          )}

          <Detail moviesData={moviesData} />
        </>
      )}
    </Wrapper>
  );
}

export default MainBanner;
