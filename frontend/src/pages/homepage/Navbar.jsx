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
      <div className="navbar-logo" onClick={() => navigate("/homepage")}>
        🎬 Movie<span className="logo-black">Rankrr</span>
      </div>

      <div className="navbar-menu">
        <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
          <li onClick={() => navigate("/homepage")}>Home</li>
          <li onClick={() => navigate("/airecommendation")}>AI</li>
          <li onClick={() => navigate("/watchlist")}>Watchlist</li>
          <li>{username}</li>
        </ul>

        {/* Hamburger Icon outside the ul */}
        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
