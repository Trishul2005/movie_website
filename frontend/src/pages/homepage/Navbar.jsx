import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../cssFiles/Navbar.css";

function Navbar({ user }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  let username = "Login";
  if (user) {
    username = user?.username;
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/homepage")}>🎬 MovieRankrr</div>

      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li onClick={() => navigate("/homepage")}>Home</li>
        <li onClick={() => navigate("/airecommendation")}>AI</li>
        <li onClick={() => navigate("/watchlist")}>Watchlist</li>
        <li>{username}</li>
      </ul>

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Overlay for blur effect */}
      {isOpen && (
        <div className="navbar-overlay" onClick={() => setIsOpen(false)}></div>
      )}
    </nav>
  );
}

export default Navbar;
