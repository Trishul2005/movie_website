import MovieSection from "./MovieSection.jsx";
import Navbar from "./Navbar.jsx";
import Register from "../login/Register.jsx";
import Login from "../login/Login.jsx";
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import "../../cssFiles/Homepage.css";

function Homepage() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          credentials: "include", // Required to send the cookie
        });

        if (!res.ok) {
          navigate("/");
          throw new Error("Not logged in");
        }

        const user = await res.json();
        setUser(user); // Your React state
      } catch (err) {
        console.error(err);
        setUser(null); // Not logged in
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="all-background">
      <Navbar user={user}/>
      <div className="homepage-container">
        
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">Discover Movies Smarter</h1>
          <p className="hero-subtitle">
            AI recommendations tailored just for you.  
          </p>
          <div className="hero-buttons">
            <button className="secondary-button" onClick={() => navigate("/airecommendation")}>AI Recommendations</button>
            <button className="secondary-button" onClick={() => navigate("/watchlist")}>My Watchlist</button>
          </div>
        </section>

        <MovieSection user={user}/>
      </div>
    </div>
  );
}

export default Homepage;
