import { useQuery } from "react-query";
import { getMovies } from "./api";
function Home() {
  
  // query키는 배열이 될 수도 있다
  const { isLoading, data } = useQuery(["movies", "nowPlaying"], getMovies);
  console.log(isLoading, data);
  return <div style={{ backgroundColor: "whitesmoke", height: "200vh" }}></div>;
}

export default Home;
