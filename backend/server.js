require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://movierankrr.onrender.com'], // Adjust this to your frontend URL
  credentials: true // Allow cookies to be sent
}));
app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// chatbot routes
const chatbotRoutes = require('./routes/chatbot');
app.use('/api/chatbot', chatbotRoutes);
