const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For token generation

const JWT_SECRET = process.env.JWT_SECRET; // Use a secure key in production
const authMiddleware = require('../middleware/authMiddleware');

// route for register or login
router.post('/register', async (req, res) => {

  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  try {

    // Check if user with this email or username already exists
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    if (existingUsername) {
      return res.status(400).json({ message: "User with this username already exists" });
    }

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json(
        { message: 'User registered successfully!', 
            userId: newUser._id,
            username: newUser.username,
        });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// route for login
router.post('/login', async (req, res) => {

    const { username, email, password } = req.body;

    try {

        // Check if user with this email OR username exists
        const existingUser = await User.findOne({ $or: [ { email }, { username } ] });
        
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password); // Compare hashed password
            
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // ✅ Generate JWT
        const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, { expiresIn: '2h' });

        // ✅ Send token in HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,               // use true in production (HTTPS)
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000  // 24 hours
        });

        res.status(200).json({
            message: 'Login successful',
            userId: existingUser._id,
            username: existingUser.username,
            watchlist: existingUser.watchlist,
        });

        
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

});


// Get current logged-in user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// route for watchlist
router.post('/:userId/watchlist', async (req, res) => {
    console.log("📩 Incoming request:");
    console.log("Params:", req.params);
    console.log("Body:", req.body);

    const { movieId, title, posterPath, air_date, overview, popularity,
            vote_average, vote_count, media_type } = req.body;

    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            console.log("❌ User not found");
            return res.status(200).json({ error: 'User not found' });
        }

        const index = user.watchlist.findIndex(item => 
            item.movieId === movieId.toString() && item.media_type === media_type);
        
        if (index !== -1) {
            user.watchlist.splice(index, 1); // movie exists so remove it
            await user.save();
            console.log("🗑️ Movie removed from watchlist");
            return res.status(200).json({ message: '🗑️ Movie removed from watchlist', watchlist: user.watchlist });
        }

        user.watchlist.push({ movieId, title, posterPath, air_date, overview, popularity, vote_average, vote_count, media_type, status: 'want-to-watch' });
        await user.save();

        console.log("✅ Movie added");
        res.status(200).json({ message: 'Movie added to watchlist', watchlist: user.watchlist });

    } catch (error) {
        console.error("🔥 Server error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

// route for getting watchlist
router.get('/me/getWatchlist', authMiddleware, async (req, res) => {

  const user = await User.findById(req.user.id).select("-password");
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.watchlist);

});

// route for updating watchlist
router.put('/me/updateWatchlist', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newWatchlist = req.body.updatedList; // 👈 expect { watchlist: [...] }

    if (!Array.isArray(newWatchlist)) {
      return res.status(400).json({ message: "Invalid watchlist format" });
    }

    user.watchlist = newWatchlist;
    await user.save();

    res.json(user); // return updated user so frontend has fresh data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
