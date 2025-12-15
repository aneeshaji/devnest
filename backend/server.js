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

/* ================================
	CORS CONFIG (ENV BASED)
================================ */
const allowedOrigins = process.env.CORS_ORIGINS
	? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
	: [];

const corsOptions = {
	origin: (origin, callback) => {
		// Allow requests with no origin (Postman, curl, server-to-server)
		if (!origin) return callback(null, true);

		if (allowedOrigins.includes(origin)) {
			return callback(null, true);
		}

		return callback(new Error(`CORS blocked for origin: ${origin}`));
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));
// NOTE: No app.options('*') — breaks in Node 24+

/* ================================
	BODY PARSERS
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
	ROOT HEALTH CHECK
================================ */
app.get('/', (req, res) => {
	res.json({
		message: 'DevNest API is running! 🚀',
		version: '1.0.0',
		environment: process.env.NODE_ENV,
		endpoints: {
			auth: '/api/auth',
			articles: '/api/articles',
			comments: '/api/comments',
			users: '/api/users'
		}
	});
});

/* ================================
	API ROUTES
================================ */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api', require('./routes/comments'));
app.use('/api/users', require('./routes/users'));

/* ================================
	404 HANDLER
================================ */
app.use((req, res) => {
	res.status(404).json({
		message: 'Route not found',
		path: req.originalUrl
	});
});

/* ================================
	GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
	console.error('🔥 Error:', err.message);

	res.status(err.status || 500).json({
		message: err.message || 'Something went wrong',
		...(process.env.NODE_ENV === 'development' && { stack: err.stack })
	});
});

/* ================================
	START SERVER
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(
		`🚀 DevNest API running on port ${PORT} (${process.env.NODE_ENV})`
	);
});
