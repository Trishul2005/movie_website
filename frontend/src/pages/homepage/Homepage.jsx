import MovieSection from "./MovieSection.jsx";
import Navbar from "./Navbar.jsx";
import Register from "../login/Register.jsx";
import Login from "../login/Login.jsx";
import { useState, useEffect } from 'react'

import "../../cssFiles/Homepage.css";

function Homepage() {
  // HOW TO STYLE HOMEPAGE

  // ----- Navbar ----- (always at the top) [home, watchlist, login/signup or profile]
  //
  // movies
  // tv shows
  // anime

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          credentials: "include", // Required to send the cookie
        });

        if (!res.ok) throw new Error("Not logged in");

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
    <>
      <Navbar user={user}/>
      <div className="homepage-container">
        <Login />
        <MovieSection user={user}/>
      </div>
    </>
  );
}

export default Homepage;

// Genre ID codes
// https://www.themoviedb.org/talk/5daf6eb0ae36680011d7e6ee

// MOVIE
// Action          28
// Adventure       12
// Animation       16
// Comedy          35
// Crime           80
// Documentary     99
// Drama           18
// Family          10751
// Fantasy         14
// History         36
// Horror          27
// Music           10402
// Mystery         9648
// Romance         10749
// Science Fiction 878
// TV Movie        10770
// Thriller        53
// War             10752
// Western         37

// TV SHOW
// Action & Adventure  10759
// Animation           16
// Comedy              35
// Crime               80
// Documentary         99
// Drama               18
// Family              10751
// Kids                10762
// Mystery             9648
// News                10763
// Reality             10764
// Sci-Fi & Fantasy    10765
// Soap                10766
// Talk                10767
// War & Politics      10768
// Western             37
