import { useQuery } from "react-query";
import { getMovies } from "./api";
function Home() {

  // movies라는 데이터 이름의 nowPlaying이라는 식별자를 가진 데이터를 가져오고, 이를 캐싱하여 재사용
  // 현재 상영 중인(now playing) 영화에 대한 데이터임을 구분하기 위한 식별자
  const { isLoading, data } = useQuery(["movies", "nowPlaying"], getMovies);
  console.log(isLoading, data);
  return <div style={{ backgroundColor: "whitesmoke", height: "200vh" }}></div>;
}

export default Home;
