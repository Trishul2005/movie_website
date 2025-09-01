import MovieCard from './MovieCard';
import { useState, useEffect, useRef } from 'react';

import '../../cssFiles/MovieCarousel.css';
import arrowLeft from '../../assets/arrow-left-s-line.svg';
import arrowRight from '../../assets/arrow-right-s-line.svg';

function MovieCarousel({ title, subtitle, fetchURL, genre, user, category }) {
  const [movies, setMovies] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (genre) {
        let page = 1;
        const filtered = [];
        while (filtered.length !== 20) {
          const response = await fetch(fetchURL + `&page=${page}`);
          const data = await response.json();
          for (const show of data.results) {
            if (show.genre_ids.includes(parseInt(genre))) {
              filtered.push(show);
              if (filtered.length === 20) break;
            }
          }
          page++;
        }
        setMovies(filtered);
      } else {
        const response = await fetch(fetchURL);
        const data = await response.json();
        setMovies(data.results);
      }
    };
    fetchData();
  }, [fetchURL, genre]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmt = 600;
    if (!container) return;
    container.scrollLeft += direction === 'left' ? -scrollAmt : scrollAmt;
  };

  return (
    <div className="mc-movie-carousel">
      <h2 className="mc-movie-carousel-title">| {title}</h2>
      <p className="mc-movie-carousel-subtitle">{subtitle}</p>

      <div className="mc-carousel-wrapper">
        <button
          type="button"
          className="mc-scroll-button left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <img src={arrowLeft} alt="" />
        </button>

        <div className="mc-movie-row" ref={scrollRef}>
          {movies.map((movie) => (
            <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} user={user} category={category} />
          ))}
        </div>

        <button
          type="button"
          className="mc-scroll-button right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <img src={arrowRight} alt="" />
        </button>
      </div>
    </div>
  );
}

export default MovieCarousel;
