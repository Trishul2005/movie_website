import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../homepage/Navbar";
import "../../cssFiles/MovieDetails.css";

import TrailerCarousel from "./TrailerCarousel";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function MovieDetails() {
  const { mediaType, id } = useParams();
  const [user, setUser] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [trailers, setTrailers] = useState([]);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndMovie = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`
        );
        const data = await res.json();
        setMovie(data);

        const videoRes = await fetch(
          `${BASE_URL}/${mediaType}/${id}/videos?api_key=${API_KEY}`
        );
        const videoData = await videoRes.json();

        const youtubeTrailers = videoData.results.filter(
          (vid) =>
            vid.site === "YouTube" &&
            (vid.type === "Trailer" || vid.type === "Opening Credits")
        );

        setTrailers(youtubeTrailers);

        // Fetch cast and crew
        const creditsRes = await fetch(
          `${BASE_URL}/${mediaType}/${id}/credits?api_key=${API_KEY}`
        );
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast || []);
        setCrew(creditsData.crew || []);

        // Fetch user data
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          method: "GET",
          credentials: "include", // Required to send the cookie
        });

        if (!userRes.ok) {
          navigate("/");
          throw new Error("Not logged in");
        }
        const userData = await userRes.json();
        setUser(userData);

        console.log("User data:", userData);

        // Check if movie is in watchlist
        setInWatchlist(
          userData?.watchlist?.some(
            (watchlistMovie) => watchlistMovie.movieId === id
          ) || false
        );

        console.log("Watchlist status:", inWatchlist);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movie data.");
      }
    };

    fetchUserAndMovie();
  }, [id, mediaType]);

  if (error) return <p className="error-message">{error}</p>;
  if (!movie) return <p className="loading-message">Loading...</p>;

  const director = crew.find((person) => person.job === "Director");
  const mainCast = cast.slice(0, 2);

  const truncateOverview = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const shouldShowReadMore = movie?.overview && movie.overview.length > 150;

  // Function to handle card click
  const handleBackClick = () => {
    navigate(`/homepage`);
  };

  // Function to handle adding movie to watchlist
  const handleAddToWatchlist = async () => {

    if (!user) {
      alert("Please log in to add movies to your watchlist.");
      return;
    }

    console.log("passed in user ", user);
    const userId = user?._id;

    console.log("Adding/removing movie to watchlist:", movie);

    // Make a POST request to add the movie to the user's watchlist
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/watchlist`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieId: movie.id,
        title: movie.title || movie.name,
        posterPath: movie.poster_path,
        air_date: movie.release_date || movie.first_air_date,
        overview: movie.overview,
        popularity: movie.popularity,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        media_type: mediaType,
      }),
    });

    const data = await response.json();
    console.log("Response from server:", data);

    if (response.ok) {
      setInWatchlist(!inWatchlist); // set watchlist status to opposite

      
    } else {
      alert(data.error);
    }
  };

  // Function to handle watchlist button click

  return (
    <>
      <Navbar user={user} />
      <div className="movie-details-container">
      {/* Background with blur effect */}
      <div
        className="movie-backdrop"
        style={{
          backgroundImage: movie.poster_path
            ? `url(https://image.tmdb.org/t/p/original${movie.poster_path})`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      />

      <div className="movie-content-wrapper">
        {/* Header */}
        <div className="movie-header">
          <button className="back-button" onClick={handleBackClick}>
            <span className="back-arrow">←</span>
            Back to Movies
          </button>
        </div>

        {/* Movie Info Section */}

        <div className="movie-info-section">
          <div className="poster-container">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="movie-details-poster"
            />
          </div>

          <div className="movie-text-info">
            <h1 className="movie-title">{movie.title || movie.name}</h1>

            <div className="movie-meta">
              <div className="meta-bubble">
                <span className="meta-icon">📅</span>
                <span className="meta-text">
                  {(movie.release_date || movie.first_air_date || "").slice(
                    0,
                    4
                  )}
                </span>
              </div>
              <div className="meta-bubble">
                <span className="meta-icon">⏱️</span>
                <span className="meta-text">
                  {movie.runtime
                    ? `${Math.floor(movie.runtime / 60)}h ${
                        movie.runtime % 60
                      }m`
                    : "N/A"}
                </span>
              </div>
              <div className="meta-bubble">
                <span className="meta-icon">🏆</span>
                <span className="meta-text">
                  IMDb {movie.vote_average?.toFixed(1) || "N/A"}
                </span>
              </div>
            </div>

            <div className="rating-section">
              <div className="rating-badge">
                <span className="star-icon">★</span>
                <span className="rating-number">
                  {movie.vote_average?.toFixed(1) || "N/A"}
                </span>
                <span className="rating-total">/10</span>
              </div>

              {inWatchlist ? (
                <button className="add-to-watchlist-btn" onClick={handleAddToWatchlist}>
                <span className="plus-icon">✔️</span>
                Already in Watchlist
              </button>
              ) : (
                <button className="add-to-watchlist-btn" onClick={handleAddToWatchlist}>
                <span className="plus-icon">+</span>
                Add to Watchlist
              </button>
              )}


              


            </div>

            <div className="genre-tags">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="movie-overview-container">
              <p className="movie-overview">
                {showFullOverview || !shouldShowReadMore ? (
                  movie.overview
                ) : (
                  <>
                    {truncateOverview(movie.overview)}
                    <span className="read-more-inline">
                      <button
                        className="read-more-btn"
                        onClick={() => setShowFullOverview(!showFullOverview)}
                      >
                        {showFullOverview ? "Read Less" : "Read More"}
                      </button>
                    </span>
                  </>
                )}
              </p>

              {showFullOverview && shouldShowReadMore && (
                <button
                  className="read-more-btn"
                  onClick={() => setShowFullOverview(false)}
                >
                  Read Less
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="additional-info">
        {/* Trailer Carousel */}
        {trailers.length > 0 && (
          <div className="movie-carousel">
            <div
              style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "0 2rem",
              }}
            >
              <h2 className="movie-carousel-title">Trailers</h2>
              <TrailerCarousel trailers={trailers} />
            </div>
          </div>
        )}

        {/* Director and Cast Section */}

        <div className="additional-info-content">
          <div className="director-info">
            <div className="info-header">
              <div className="info-icon director-icon">👤</div>
              <h3>Director</h3>
            </div>
            <p className="director-name">{director?.name || "Unknown"}</p>
          </div>

          <div className="cast-info">
            <div className="info-header">
              <div className="info-icon cast-icon">⭐</div>
              <h3>Starring</h3>
            </div>
            <div className="cast-list">
              {mainCast.map((actor, index) => (
                <div key={index} className="cast-member">
                  <div className="cast-avatar">
                    {actor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="cast-details">
                    <p className="cast-name">{actor.name}</p>
                    <p className="cast-character">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
}

export default MovieDetails;
