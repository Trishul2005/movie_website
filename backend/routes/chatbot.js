const express = require("express");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { Pinecone } = require("@pinecone-database/pinecone");

const router = express.Router();

// setup pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// choose the index to use from pinecone
const index = pinecone.Index("movie-website");

// embedding model via LangChain
const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// route to embed movies into Pinecone
router.post("/embed-movies", async (req, res) => {

  try {
    const movies = req.body.movies; // expects an array of movie objects
    const media = req.body.media || "movie"; // default to movie, can be "tv" as well

    const upserts = await Promise.all(
        movies.map(async (movie) => {
            const vectorId = `${movie.id}_${media}`; // unique ID for each vector
            const movieText = `${movie.title}\n${movie.overview}`;
            const vector = await embeddings.embedQuery(movieText);

            // Convert any array fields in metadata to strings
            let metadata = {};

            if (media === "movie") {
                metadata = {
                    ...movie,
                    adult: movie.adult || false,
                    first_air_date: movie.first_air_date || "",
                    backdrop_path: movie.backdrop_path || "",
                    genre_ids: movie.genre_ids ? movie.genre_ids?.map(String) : [],
                    id: movie.id || 0,
                    media_type: "movie",
                    original_language: movie.original_language || "",
                    original_title: movie.original_title || "",
                    overview: movie.overview || "",
                    popularity: movie.popularity || 0,
                    poster_path: movie.poster_path || "",
                    release_date: movie.release_date || "",
                    title: movie.title || "",
                    video: movie.video || false,
                    vote_average: movie.vote_average || 0,
                    vote_count: movie.vote_count || 0,
                };
            }
            else {
              metadata = {
                  ...movie,
                  adult: movie.adult || false,
                  backdrop_path: movie.backdrop_path || "",
                  first_air_date: movie.first_air_date || "",
                  genre_ids: movie.genre_ids ? movie.genre_ids?.map(String) : [],
                  id: movie.id || 0,
                  media_type: "tv",
                  name: movie.name || "",
                  origin_country: movie.origin_country || [],
                  original_language: movie.original_language || "",
                  original_name: movie.original_name || "",
                  overview: movie.overview || "",
                  popularity: movie.popularity || 0,
                  poster_path: movie.poster_path || "",
                  vote_average: movie.vote_average || 0,
                  vote_count: movie.vote_count || 0,
              }
            }


        return {
            id: vectorId,
            values: vector,
            metadata,
        };
      })
    );

    await index.upsert(upserts); // upsert vectors into Pinecone index
    res.json({ message: "Movies embedded successfully", count: upserts.length });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to embed movies" });
  }

});


// query route to get similar movies from Pinecone
router.post("/query-movies", async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;

    // embed the user query
    const queryVector = await embeddings.embedQuery(query);

    // query Pinecone
    const searchResponse = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
    });

    // return the matches
    res.json(searchResponse.matches);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Query failed" });
  }
});

module.exports = router;
