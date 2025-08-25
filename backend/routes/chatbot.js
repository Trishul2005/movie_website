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

    const upserts = await Promise.all(
        movies.map(async (movie) => {
            const vectorId = `${movie.id}_${movie.media_type}`;
            const movieText = `${movie.title}\n${movie.overview}`;
            const vector = await embeddings.embedQuery(movieText);

            // Convert any array fields in metadata to strings
            const metadata = {
                ...movie,
                genre_ids: movie.genre_ids?.map(String), // convert numbers to strings
            };

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

module.exports = router;
