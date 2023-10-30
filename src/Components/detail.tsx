import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { IMoviesData } from "../Routes/api";
import { makeImagePath } from "../utilities";

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
  background-color: ${(prop) => prop.theme.black.lighter};
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
                      backgroundImage: `linear-gradient(to top,black,transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path
                      )})`,
                    }}
                  />
                  <DetailTitle>{clickedMovie?.title ? clickedMovie?.title : clickedMovie?.name}</DetailTitle>
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
