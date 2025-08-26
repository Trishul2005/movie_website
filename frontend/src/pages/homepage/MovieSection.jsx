import MovieCarousel from "./MovieCarousel.jsx";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function MovieSection(user) {
  const [loading, setLoading] = useState(false);

  console.log("Movie section User data:", user);

  // Temporary function to embed movies
  const embedMovies = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < 10; i++) {
        console.log("Embedding movies... ", i);

        // 1️⃣ Fetch trending movies from TMDB
        const res = await fetch(
          `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${i + 1}`
        );
        const data = await res.json();

        // 2️⃣ Send them to your backend to embed in Pinecone
        const embedRes = await fetch("/api/chatbot/embed-movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movies: data.results, media: "movie" }), // data.results is array of movie objects
        });

        const result = await embedRes.json();
        console.log("Embed response:", result);
      }

      alert(`✅ Embedded movies successfully!`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to embed movies");
    } finally {
      setLoading(false);
    }
  };

  // tempory function to query pinecone
  const queryMovies = async () => {
    setLoading(true);
    try {
      const query = "anime about pirates going on an adventure to find treasure";
      const res = await fetch("/api/chatbot/query-movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, topK: 5 }),
      });

      const data = await res.json();
      console.log("Query results:", data);

      const res2 = await fetch("/api/chatbot/rag-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, movies_json: data }),
      });
      const data2 = await res2.json();
      console.log("RAG response:", data2.recommendations);
      return data2.recommendations;
    } catch (err) {
      console.error(err);
      alert("❌ Failed to query movies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <button
        onClick={embedMovies}
        disabled={loading}
        style={{ marginBottom: "20px", padding: "10px 20px" }}
      >
        {loading ? "Embedding..." : "Embed Trending Movies"}
      </button> */}

      <button
        onClick={queryMovies}
        style={{ marginBottom: "20px", padding: "10px 20px" }}
      >
        {loading ? "Querying..." : "Query Movies"}
      </button>

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
