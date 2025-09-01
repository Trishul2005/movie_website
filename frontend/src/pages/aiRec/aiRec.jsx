import React, { useState, useEffect, useRef } from "react";
import Navbar from "../homepage/Navbar";
import "../../cssFiles/aiRec.css";
import { useNavigate } from "react-router-dom";

function AiRec() {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [ragData, setRagData] = useState(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]); // chat history
  const messagesEndRef = useRef(null); // ref for auto-scroll
  const navigate = useNavigate();

  const handleQuery = async () => {
    if (!query.trim()) return;

    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);
    setRagData(null);

    try {
      // 1️⃣ Get top movies from your query endpoint
      const queryRes = await fetch(`${import.meta.env.VITE_API_URL}/api/chatbot/query-movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, topK: 10 }),
      });

      const movies_json = await queryRes.json();
      let user_watchlist = user ? user.watchlist || [] : [];

      // 2️⃣ Call RAG with those movies
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chatbot/rag-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, movies_json, user_watchlist }),
      });

      if (!res.ok) throw new Error(`RAG request failed: ${res.status}`);

      const data = await res.json();
      setRagData(data.recommendations);

      // Save AI response to chat history
      const aiMessage = { sender: "ai", data: data.recommendations };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  // get user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          navigate("/");  
          throw new Error("Not logged in");
        }

        const user = await res.json();
        console.log(user);
        setUser(user); // Your React state
      } catch (err) {
        console.error(err);
        setUser(null); // Not logged in
      }
    };

    fetchUser();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleQuery();
    }
  };

  // 🔽 Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="all-background">
      <Navbar user={user} />
      <div className="airec-container">
        {messages.length === 0 ? (
          // Landing Page (just input centered)
          <div className="airec-landing">
            <h1 className="airec-title">AI Movie Recommender</h1>
            <input
              type="text"
              className="airec-input-box"
              placeholder="Type a query like 'shows similar to Breaking Bad'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <button
              className="airec-button"
              onClick={handleQuery}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : "Search"}
            </button>
            <p className="airec-subtitle">Note: For the best results add at least 5 movies to your watchlist</p>
          </div>
        ) : (
          // Chat Interface
          <div className="airec-chat">
            <div className="airec-messages">
              {messages.map((msg, idx) =>
                msg.sender === "user" ? (
                  <div key={idx} className="airec-message user-message">
                    {msg.text}
                  </div>
                ) : (
                  <div key={idx} className="airec-message ai-message">
                    {msg.data?.intro && <p>{msg.data.intro}</p>}
                    {msg.data?.recommendations?.map((rec, i) => (
                      <div key={i} className="airec-card">
                        <img
                          className="airec-poster"
                          src={`https://image.tmdb.org/t/p/w300${rec.movie.poster_path}`}
                          alt={rec.movie.title || rec.movie.name}
                        />
                        <div className="airec-card-details">
                          <h3>{rec.movie.title || rec.movie.name}</h3>
                          <p className="airec-year">
                            {
                              (
                                rec.movie.release_date ||
                                rec.movie.first_air_date ||
                                ""
                              ).split("-")[0]
                            }
                          </p>
                          <p className="airec-reason">{rec.reason}</p>
                        </div>
                      </div>
                    ))}
                    {msg.data?.conclusion && <p>{msg.data.conclusion}</p>}
                  </div>
                )
              )}

              {/* Typing indicator bubble */}
              {loading && (
                <div className="airec-message ai-message typing-bubble">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}

              {/* 🔽 Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom input bar like ChatGPT */}
            <div className="airec-input-bar">
              <input
                type="text"
                placeholder="Type your message..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
              />
              <button onClick={handleQuery} disabled={loading || !query.trim()}>
                {loading ? <span className="spinner"></span> : "Send"}
              </button>
            </div>
          </div>
        )}

        {error && <div className="airec-error">{error}</div>}
      </div>
    </div>
  );
}

export default AiRec;
