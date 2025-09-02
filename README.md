# MovieRankrr

Deployment URL: https://movierankrr.onrender.com/

MovieRankrr is a full-stack web application for movie and TV show recommendations. Users can browse media, get AI-generated recommendations, and manage their personal watchlist. The app features a retrieval-augmented generation (RAG) model with LangChain and Pinecone, using 10,000+ OpenAI embeddings to deliver highly accurate AI recommendations.

---

## Features

  
- **Browse Movies & TV Shows:** Search and explore content with media details.  
- **Watchlist:** Add, remove, and update media in a personal watchlist.  
- **AI Recommendations:** Personalized suggestions using a RAG model powered by LangChain, OpenAI embeddings, and Pinecone database.
- **User Authentication:** Register and login securely with JWT tokens.  
- **Responsive Design:** Works on desktop and mobile devices.  

---

## Tech Stack

**Frontend:** React.js, HTML, CSS, JavaScript  

**Backend:** Node.js, Express.js, MongoDB, JWT

**RAG Model:** OpenAI embeddings, LangChain, Pinecone

**APIs:** TMDB API, OpenAI API, YouTube API

---

## Getting Started

### 1. Clone the repository
``` bash
git clone https://github.com/Trishul2005/movie_website.git
cd movie_website
```

### 2. Backend Setup
``` bash
cd backend
npm install
```

Create a .env file in backend/:
``` js
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_env
```

Start the backend server:
``` bash
npm start
```
The backend will run on http://localhost:5000 by default.

### 3. Frontend Setup
``` bash
cd ../frontend
npm install
```

Create a .env file in frontend/:
``` js
VITE_API_URL=http://localhost:5000
VITE_TMDB_API_KEY=your_tmdb_api_key
```

Start the frontend server:
``` bash
npm run dev
```
The frontend will run on http://localhost:5173 by default.

## Deployment

**Frontend (Static Site):**

- Deploy the `frontend` directory as a static site on platforms like Render, Vercel, or Netlify.

**Backend (Web Service):**

- Deploy the `backend` directory as a Node.js web service.
- Ensure environment variables are set in the hosting platform.

**CORS:**  
Update `server.js` to include your deployed frontend URL:

```js
app.use(cors({
  origin: ['https://yourfrontend.onrender.com'],
  credentials: true
}));
```

## Usage

1. Visit the login page and create an account. All pages are protected under sign in.
2. Browse movies and TV shows.
3. Click on a movie or show to see detailed information.
4. Add favorites to your watchlist.
5. Use the AI recommendation page for personalized suggestions.


---

## Folder Structure
```bash
movie_website/
├─ backend/                   # Express server & API routes
│  ├─ routes/                 # API route definitions
│  ├─ models/                 # Mongoose schemas
│  ├─ middleware/             # Auth and other middleware
│  ├─ server.js               # Main server file
│  └─ .env                    # Environment variables (not committed)
├─ frontend/                  # React app
│  ├─ src/
│  │  ├─ pages/               # Page components
│  │  ├─ cssFiles/            # CSS files
│  │  ├─ assets/              # Images, icons, etc.
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ package.json
│  └─ .env                    # Environment variables
├─ .gitignore                 # Ignored files for Git
├─ README.md                  # Project documentation
```

---

## Environment Variables

**Backend:**

- `MONGO_URI` = MongoDB connection string
- `JWT_SECRET` = Secret key for JWT
- `TMDB_API_KEY` = TMDB API key
- `OPENAI_API_KEY` = OpenAI API key
- `PINECONE_API_KEY` = Pinecone API key
- `PINECONE_ENVIRONMENT` = Pinecone environment

**Frontend:**

- `VITE_API_URL` = URL to backend API
- `VITE_TMDB_API_KEY` = TMDB API key

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT License © Trishul Sharma
