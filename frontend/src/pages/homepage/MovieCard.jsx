import '../../cssFiles/MovieCard.css'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


function MovieCard({movie, user}) {

    const navigate = useNavigate();
    const [inWatchlist, setInWatchlist] = useState(false);

    useEffect(() => {
        setInWatchlist(() =>
            user?.user?.watchlist?.some(
                (watchlistMovie) => watchlistMovie.movieId === String(movie.id)
        ) || false)
    }, [user]);

    // Function to handle adding movie to watchlist
    const handleAddToWatchlist = async () => {

        if (!user) {
            alert('Please log in to add movies to your watchlist.');
            return;
        }

        console.log("passed in user ", user)
        const userId = user?.user._id; // Get user ID from localStorage

        console.log("Adding/removing movie to watchlist:", movie);

        // Make a POST request to add the movie to the user's watchlist
        const response = await fetch(`/api/users/${userId}/watchlist`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
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
                media_type: movie.media_type
            })
        });

        const data = await response.json();
        console.log("Response from server:", data);

        
        if (response.ok) {

            setInWatchlist(!inWatchlist) // set watchlist status to opposite

            alert(data.message);

        } else {
            alert(data.error);
        }
    }

    // Function to handle card click
    const handleCardClick = () => {
        navigate(`/${movie.media_type}/${movie.id}`);
    }


    return (
        <div className="movie-card">
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
                onClick={handleCardClick}
            />

            {inWatchlist ? (
                <button className="movie-title-watchlist in-watchlist" onClick={handleAddToWatchlist}>
                    Already in Watchlist
                </button>
            ) : (
                <button className="movie-title-watchlist" onClick={handleAddToWatchlist}>
                    Add to Watchlist
                </button>
            )}
        </div>
    );

}

export default MovieCard