const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
	res.json({
		message: 'DevNest API is running! 🚀',
		version: '1.0.0',
		endpoints: {
			auth: '/api/auth',
			articles: '/api/articles',
			comments: '/api/comments',
			users: '/api/users'
		}
	});
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api', require('./routes/comments'));
app.use('/api/users', require('./routes/users'));

// 404 handler
app.use((req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		message: 'Something went wrong!',
		error: process.env.NODE_ENV === 'development' ? err.message : undefined
	});
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});