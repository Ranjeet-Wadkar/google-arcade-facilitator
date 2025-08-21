import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminUpload from "./pages/AdminUpload";
import Leaderboard from "./pages/Leaderboard";
import UserProgress from "./pages/UserProgress";

function App() {
  return (
    <Router>
      <nav style={{ margin: "10px" }}>
        <Link to="/">Leaderboard</Link> |{" "}
        <Link to="/progress">My Progress</Link> | <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Leaderboard />} />
        <Route path="/progress" element={<UserProgress />} />
        <Route path="/admin" element={<AdminUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
