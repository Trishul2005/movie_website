import { useNavigate } from 'react-router-dom';

import "../../cssFiles/Navbar.css";

function Navbar(user) {

  const navigate = useNavigate();

  let username = "Login"
  
  if (user) {
    username = user?.user?.username;
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">🎬 MovieRankrr</div>
      <ul className="navbar-links">
        <li>Home</li>
        <li onClick={() => navigate("/aiRec")}>AI Recommendations</li>
        <li onClick={() => navigate("/watchlist")}>Watchlist</li>
        <li>{username}</li>
      </ul>
    </nav>
  );
}

export default Navbar;
