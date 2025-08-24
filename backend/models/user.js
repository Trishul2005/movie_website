const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: [{
    movieId: { type: String, required: true },
    title: String,
    posterPath: String,
    air_date: String,
    overview: String,
    popularity: Number,
    vote_average: Number,
    vote_count: Number,
    media_type: String,
    status: { type: String, enum: ['want-to-watch', 'currently-watching', 'completed'], default: 'want-to-watch' },
  }],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
