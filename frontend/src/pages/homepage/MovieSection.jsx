import MovieCarousel from "./MovieCarousel.jsx";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function MovieSection(user) {
  

  console.log("Movie section User data:", user);

  return (
    <div>
      <MovieCarousel
        title="Trending"
        fetchURL={`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`}
        user={user}
      />

      <MovieCarousel
        title="Anime"
        fetchURL={`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`}
        genre="16"
        user={user}
      />
    </div>
  );
}

export default MovieSection;
