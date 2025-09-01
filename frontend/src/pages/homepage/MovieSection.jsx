import MovieCarousel from "./MovieCarousel.jsx";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function MovieSection(user) {
  const [loading, setLoading] = useState(false);

  console.log("Movie section User data:", user);

  // Temporary function to embed movies
  // const embedMovies = async () => {
  //   setLoading(true);
  //   try {
  //     for (let i = 0; i < 10; i++) {
  //       console.log("Embedding movies... ", i);

  //       // 1️⃣ Fetch trending movies from TMDB
  //       const res = await fetch(
  //         `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${i + 1}`
  //       );
  //       const data = await res.json();

  //       // 2️⃣ Send them to your backend to embed in Pinecone
  //       const embedRes = await fetch("/api/chatbot/embed-movies", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ movies: data.results, media: "movie" }), // data.results is array of movie objects
  //       });

  //       const result = await embedRes.json();
  //       console.log("Embed response:", result);
  //     }

  //     alert(`✅ Embedded movies successfully!`);
  //   } catch (err) {
  //     console.error(err);
  //     alert("❌ Failed to embed movies");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // tempory function to query pinecone
  // const queryMovies = async () => {
  //   setLoading(true);
  //   try {
  //     const query = "anime about pirates going on an adventure to find treasure";
  //     const res = await fetch("/api/chatbot/query-movies", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ query, topK: 5 }),
  //     });

  //     const data = await res.json();
  //     console.log("Query results:", data);

  //     const res2 = await fetch("/api/chatbot/rag-response", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ query, movies_json: data }),
  //     });
  //     const data2 = await res2.json();
  //     console.log("RAG response:", data2.recommendations);
  //     return data2.recommendations;
  //   } catch (err) {
  //     console.error(err);
  //     alert("❌ Failed to query movies");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div>
      <MovieCarousel
        title="Trending Movies"
        subtitle="See what everyone's watching this week"
        fetchURL={`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Trending TV"
        subtitle="Binge the hottest shows out right now"
        fetchURL={`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`}
        user={user}
        category="tv"
      />

      <MovieCarousel
        title="Top Rated Movies"
        subtitle="Critically acclaimed hits loved by fans worldwide"
        fetchURL={`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Top Rated TV"
        subtitle="Award-winning shows that stand the test of time"
        fetchURL={`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`}
        user={user}
        category="tv"
      />

      <MovieCarousel
        title="Anime"
        subtitle="Explore popular anime series and movies"
        fetchURL={`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`}
        genre="16"
        user={user}
        category="tv"
      />

      <MovieCarousel
        title="Action"
        subtitle="Explosive adventures and high-octane thrills"
        fetchURL={`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Adventure"
        subtitle="Epic journeys and daring quests across worlds"
        fetchURL={`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=12`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Thriller"
        subtitle="Edge-of-your-seat suspense and gripping mysteries"
        fetchURL={`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=53`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Sci-Fi"
        subtitle="Explore futuristic worlds and mind-bending tech"
        fetchURL={`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=878`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Fantasy"
        subtitle="Magical worlds and mystical adventures"
        fetchURL={`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=14`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Horror"
        subtitle="Spine-chilling scares and terrifying tales"
        fetchURL={`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Comedy"
        subtitle="Feel-good laughs and timeless comedies"
        fetchURL={`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Romance"
        subtitle="Heartfelt love stories and unforgettable moments"
        fetchURL={`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Now Playing"
        subtitle="Catch the latest films currently in theaters"
        fetchURL={`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Popular Movies"
        subtitle="Blockbusters dominating the big screen"
        fetchURL={`${BASE_URL}/movie/popular?api_key=${API_KEY}`}
        user={user}
        category="movie"
      />

      <MovieCarousel
        title="Popular TV"
        subtitle="Fan-favorite shows trending across the globe"
        fetchURL={`${BASE_URL}/tv/popular?api_key=${API_KEY}`}
        user={user}
        category="tv"
      />
    </div>
  );
}

export default MovieSection;
