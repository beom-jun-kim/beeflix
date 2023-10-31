import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Genres from "./Routes/Genres";
import Header from "./Components/header";
import New from "./Routes/New";
import Weekend from "./Routes/Weekend";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="videos/:videoId" element={<Home />} /> {/* 두개의 path에서 같은 컴포넌트 렌더링 */}
        <Route path="genres/:genresId" element={<Genres />} />
        <Route path="new" element={<New />} />
        <Route path="new/videos/:videoId" element={<New />} />
        <Route path="weekend" element={<Weekend />} />
        <Route path="weekend/videos/:videoId" element={<Weekend />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
