import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Genres from "./Routes/Genres";
import Header from "./Components/header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="videos/:videoId" element={<Home />} /> {/* 두개의 path에서 같은 컴포넌트 렌더링 */}
        <Route path="/genres" element={<Genres />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
