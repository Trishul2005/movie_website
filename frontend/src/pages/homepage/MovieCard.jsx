import '../../cssFiles/MovieCard.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaHeart } from "react-icons/fa";

function MovieCard({ movie, user }) {
  const navigate = useNavigate();
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    setInWatchlist(() =>
      user?.user?.watchlist?.some(
        (watchlistMovie) => watchlistMovie.movieId === String(movie.id)
      ) || false
    );
  }, [user]);

  const handleAddToWatchlist = async (e) => {
    e.stopPropagation();

    if (!user) {
      alert('Please log in to add movies to your watchlist.');
      return;
    }

    const userId = user?.user._id;

    const response = await fetch(`/api/users/${userId}/watchlist`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
        media_type: movie.media_type,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setInWatchlist(!inWatchlist);
    } else {
      alert(data.error);
    }
  };

  const handleCardClick = () => {
    navigate(`/${movie.media_type}/${movie.id}`);
  };

  return (
    <div className="mc-card" onClick={handleCardClick}>
      <div className="mc-poster-container">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="mc-poster"
        />
        <button
          className={`mc-watchlist-heart ${inWatchlist ? 'active' : ''}`}
          onClick={handleAddToWatchlist}
        >
          <FaHeart />
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
