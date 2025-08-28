import React, { useState } from "react";
import "../../cssFiles/aiRec.css";

function AiRec() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [ragData, setRagData] = useState(null);
  const [error, setError] = useState(null);

const handleQuery = async () => {
  if (!query.trim()) return;

  setLoading(true);
  setError(null);
  setRagData(null);

  try {
    // 1️⃣ Get top movies from your query endpoint
    const queryRes = await fetch("/api/chatbot/query-movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, topK: 10 }), // topK can be whatever you want
    });

    const movies_json = await queryRes.json();

    // 2️⃣ Call RAG with those movies
    const res = await fetch("/api/chatbot/rag-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, movies_json }),
    });

    if (!res.ok) throw new Error(`RAG request failed: ${res.status}`);

    const data = await res.json();

    // let parsed;
    // try {
    //   parsed = JSON.parse(data.recommendations);
    // } catch (err) {
    //   console.error("Failed to parse RAG JSON:", err);
    //   setError("Failed to parse AI response.");
    //   return;
    // }

    setRagData(data.recommendations);
  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="airec-container">
      <h2>🎬 AI Movie Recommender</h2>
      <div className="airec-input">
        <input
          type="text"
          placeholder="Type a query like 'shows similar to Breaking Bad'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleQuery} disabled={loading}>
          {loading ? <span className="spinner"></span> : "Search"}
        </button>
      </div>

      {error && <div className="airec-error">{error}</div>}

      {ragData && (
        <div className="airec-results">
          {ragData.intro && <p className="airec-intro">{ragData.intro}</p>}
          {ragData.recommendations.map((rec, idx) => (
            <div key={idx} className="airec-card-row">
              <div className="airec-card">
                <img
                  src={`https://image.tmdb.org/t/p/w300${rec.movie.poster_path}`}
                  alt={rec.movie.title || rec.movie.name}
                />
                <div className="airec-card-info">
                  <h3>{rec.movie.title || rec.movie.name}</h3>
                  <p>{(rec.movie.release_date || rec.movie.first_air_date || "").split("-")[0]}</p>
                </div>
              </div>
              <div className="airec-reason">
                {rec.reason}
              </div>
            </div>
          ))}
          {ragData.conclusion && <p className="airec-conclusion">{ragData.conclusion}</p>}
        </div>
      )}
    </div>
  );
}

export default AiRec;
