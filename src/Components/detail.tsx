import styled from "styled-components";
import { useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useMatch, useNavigate, useLocation } from "react-router-dom";
import { IMoviesData } from "../Routes/api";
import { makeImagePath } from "../utilities";
import { FaPlay, FaRegThumbsUp, FaCheck } from "react-icons/fa";

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
  background-color: ${(prop) => prop.theme.black.veryDark};
  opacity: 0;
  height: 100vh;
  position: absolute;
  width: 600px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 9999;
`;

const DetailImg = styled.div`
  height: 400px;
  background-position: center;
  background-size: cover;
`;

const DetailTitle = styled.h2`
  color: ${(prop) => prop.theme.white.darker};
  text-align: center;
  font-size: ${(prop) => prop.theme.fontSize.nomalFont};
  font-weight: 600;
`;

const DetailInfoBox = styled.div`
  padding: 20px 50px;
`;

const USerPlayBox = styled.div`
  display: flex;
  margin: -50px 0 50px 0;
`;

const PlayBtn = styled.button`
  border-radius: 5px;
  background: ${(prop) => prop.theme.white.lighter};
  margin-right: 7px;
  padding: 0 15px;
  height: 35px;
  font-weight: 600;
  border: none;
  cursor: pointer;
`;

const UserIconBox = styled.div`
  display: flex;
  margin-top: 3px;
`;

const SvgBox = styled.div<{ active: boolean }>`
  svg {
    color: ${(props) => (props.active ? "skyblue" : props.theme.white.lighter)};
    border: thin solid
      ${(props) => (props.active ? "skyblue" : props.theme.white.lighter)};
    font-size: 20px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    padding: 6px;
    cursor: pointer;
  }
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30px;
`;

const ReleaseDate = styled.div`
  font-size: ${(prop) => prop.theme.fontSize.smallFont};
  color: ${(prop) => prop.theme.white.lighter};
  font-weight: 100;
`;
const Overview = styled.p`
  color: ${(prop) => prop.theme.white.lighter};
  font-size: ${(prop) => prop.theme.fontSize.nomalFont};
  line-height: 27px;
  word-break: keep-all;
`;

interface IMovieDetail {
  moviesData: IMoviesData | undefined;
}

function Detail({ moviesData }: IMovieDetail) {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const matchModalBox = useMatch("videos/:videoId");

  const overlayClicked = () => navigate("/");
  const clickedMovie =
    matchModalBox?.params.videoId &&
    moviesData?.results.find(
      (movie: any) => movie.id + "" === matchModalBox.params.videoId
    );

  const [userIconBtn, setUserIconBtn] = useState({
    checkIconActive: false,
    thumbsUpIconActive: false,
  });

  const userToggleBtn = (iconName: any) => {
    setUserIconBtn((prevState: any) => ({
      ...prevState,
      [iconName]: !prevState[iconName],
    }));
  };

  return (
    <>
      <AnimatePresence>
        {matchModalBox ? (
          <>
            <Overlay
              onClick={overlayClicked}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            {clickedMovie && (
              <>
                <DetailMovie
                  layoutId={matchModalBox.params.videoId}
                  style={{
                    top: scrollY.get() + 30,
                  }}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <DetailImg
                    style={{
                      backgroundImage: `linear-gradient(to top,#141414,transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path
                      )})`,
                    }}
                  />
                  <DetailInfoBox>
                    <USerPlayBox>
                      <PlayBtn>
                        <FaPlay style={{ marginRight: 5 }}></FaPlay>재생
                      </PlayBtn>
                      <UserIconBox>
                        <SvgBox active={userIconBtn.checkIconActive}>
                          <FaCheck
                            onClick={() => userToggleBtn("checkIconActive")}
                            style={{
                              marginRight: 7,
                            }}
                          />
                        </SvgBox>
                        <SvgBox active={userIconBtn.thumbsUpIconActive}>
                          <FaRegThumbsUp
                            onClick={() => userToggleBtn("thumbsUpIconActive")}
                          />
                        </SvgBox>
                      </UserIconBox>
                    </USerPlayBox>
                    <TitleBox>
                      <DetailTitle>
                        {clickedMovie?.title
                          ? clickedMovie?.title
                          : clickedMovie?.name}
                      </DetailTitle>
                      <ReleaseDate>{clickedMovie?.release_date}</ReleaseDate>
                    </TitleBox>
                    <Overview>{clickedMovie?.overview}</Overview>
                  </DetailInfoBox>
                </DetailMovie>
              </>
            )}
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Detail;
