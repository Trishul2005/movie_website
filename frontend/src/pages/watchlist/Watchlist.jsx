import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Navbar from "../homepage/navbar";

import "../../cssFiles/Watchlist.css";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [wantToWatch, setWantToWatch] = useState(0);
  const [currWatching, setCurrWatching] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [btnFilter, setBtnFilter] = useState("all-movies");

  const navigate = useNavigate();

  // get watchlist from user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          credentials: "include", // Required to send the cookie
        });

        if (!res.ok) throw new Error("Not logged in");

        const user = await res.json();
        console.log(user);
        setUser(user); // Your React state
        setWatchlist(user.watchlist || []);
      } catch (err) {
        console.error(err);
        setUser(null); // Not logged in
      }
    };

    fetchUser();
  }, []);

  // update watchlist metadata
  useEffect(() => {
    const updateMetadataAndSave = async () => {
      // reset counters
      let want = 0,
        curr = 0,
        comp = 0;

      for (const movie of watchlist) {
        if (movie.status === "want-to-watch") want++;
        else if (movie.status === "currently-watching") curr++;
        else if (movie.status === "completed") comp++;
      }

      setWantToWatch(want);
      setCurrWatching(curr);
      setCompleted(comp);

      // save to backend
      try {
        const res = await fetch(
          "http://localhost:5000/api/users/me/updateWatchlist",
          {
            method: "PUT",
            credentials: "include", // send cookie with JWT
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatedList: watchlist }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to update watchlist");
        }

        const updatedUser = await res.json();
        console.log("Updated user:", updatedUser);
      } catch (err) {
        console.error("Error updating watchlist:", err);
      }
    };

    if (watchlist && watchlist.length > 0) {
      updateMetadataAndSave();
    }
  }, [watchlist]);

  // helper to update watchlist on server for status change
  const handleStatusChange = async (movieId, newStatus) => {
    const updatedList = watchlist.map((m) =>
      m.movieId === movieId ? { ...m, status: newStatus } : m
    );

    setWatchlist(updatedList); // updates UI immediately
    //await updateWatchlistOnServer(updatedList); // persist to backend
  };

  // function to handle movie removal
  const handleRemoveMovie = (movieId) => {
    const updatedList = watchlist.filter((m) => m.movieId !== movieId);
    setWatchlist(updatedList);
  };

  // filter watchlist based on search term
  const filteredWatchlist = watchlist.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (movie.status === btnFilter || btnFilter === "all-movies")
  );

  // Function to back button click
  const handleBackClick = () => {
    navigate(`/homepage`);
  };

  return (
    <>
      <Navbar user={user} />
      <div className="wl-container">
        <div className="wl-header">
          <button className="wl-back-btn" onClick={handleBackClick}>← Back</button>
          <h2 className="wl-title">My Watchlist</h2>
          <div className="wl-right-placeholder"></div>
        </div>

        <p className="wl-subtitle">
          Keep track of movies you want to watch, are currently watching, and
          have completed
        </p>

        <section className="wl-metadata-container" aria-label="Watchlist stats">
          <div className="wl-data-container">
            <h2 className="wl-want-to-watch-num">{wantToWatch}</h2>
            <p className="wl-want-to-watch">Want to Watch</p>
          </div>

          <div className="wl-data-container">
            <h2 className="wl-cur-watching-num">{currWatching}</h2>
            <p className="wl-cur-watching">Currently Watching</p>
          </div>

          <div className="wl-data-container">
            <h2 className="wl-completed-num">{completed}</h2>
            <p className="wl-completed">Completed</p>
          </div>
        </section>

        <form
          className="wl-search-container"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            className="wl-search-input"
            placeholder="Search your watchlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <nav className="wl-filter-container" aria-label="Watchlist filters">
          <button
            className={`wl-filter-btn ${
              btnFilter === "all-movies" ? "active" : ""
            }`}
            onClick={() => setBtnFilter("all-movies")}
          >
            All Movies
          </button>
          <button
            className={`wl-filter-btn ${
              btnFilter === "want-to-watch" ? "active" : ""
            }`}
            onClick={() => setBtnFilter("want-to-watch")}
          >
            Want to Watch
          </button>
          <button
            className={`wl-filter-btn ${
              btnFilter === "currently-watching" ? "active" : ""
            }`}
            onClick={() => setBtnFilter("currently-watching")}
          >
            Currently Watching
          </button>
          <button
            className={`wl-filter-btn ${
              btnFilter === "completed" ? "active" : ""
            }`}
            onClick={() => setBtnFilter("completed")}
          >
            Completed
          </button>
        </nav>

        <div className="wl-movie-cards-container">
          {filteredWatchlist.length > 0 ? (
            filteredWatchlist.map((movie) => (
              <article
                key={`${movie.id}-${movie.posterPath}`}
                className="wl-movie-card"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  className="wl-movie-poster"
                />
                <h3 className="wl-movie-title">{movie.title}</h3>

                <div className="wl-movie-info">
                  <p className="wl-movie-release">{movie.air_date}</p>
                  <p className="wl-movie-rating">
                    {Math.round(movie.vote_average * 10) / 10}
                  </p>
                </div>

                <div className="wl-movie-actions">
                  <select
                    className="wl-movie-watch-status"
                    value={movie.status}
                    onChange={(e) =>
                      handleStatusChange(movie.movieId, e.target.value)
                    }
                  >
                    <option value="want-to-watch">Want to Watch</option>
                    <option value="currently-watching">
                      Currently Watching
                    </option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    className="wl-movie-remove"
                    onClick={() => handleRemoveMovie(movie.movieId)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="wl-no-movies">No movies in your watchlist yet!</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Watchlist;
