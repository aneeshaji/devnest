const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '7d' // Token expires in 7 days
	});
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Validation
		if (!username || !email || !password) {
			return res.status(400).json({
				message: 'Please provide all required fields'
			});
		}

		// Check if user already exists
		const userExists = await User.findOne({
			$or: [{ email }, { username }]
		});

		if (userExists) {
			return res.status(400).json({
				message: 'User already exists with this email or username'
			});
		}

		// Create user
		const user = await User.create({
			username,
			email,
			password // Will be hashed by the pre-save hook
		});

		// Return user data with token
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			displayName: user.displayName,
			profilePicture: user.profilePicture,
			token: generateToken(user._id)
		});
	} catch (error) {
		console.error('Register error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validation
		if (!email || !password) {
			return res.status(400).json({
				message: 'Please provide email and password'
			});
		}

		// Find user by email
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({
				message: 'Invalid email or password'
			});
		}

		// Check if password matches
		const isPasswordCorrect = await user.comparePassword(password);

		if (!isPasswordCorrect) {
			return res.status(401).json({
				message: 'Invalid email or password'
			});
		}

		// Return user data with token
		res.json({
			_id: user._id,
			username: user.username,
			email: user.email,
			displayName: user.displayName,
			profilePicture: user.profilePicture,
			token: generateToken(user._id)
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
	try {
		// req.user is set by the protect middleware
		const user = await User.findById(req.user._id).select('-password');
		res.json(user);
	} catch (error) {
		console.error('Get me error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Update fields
		const { displayName, bio, skills, location, socialLinks } = req.body;

		if (displayName) user.displayName = displayName;
		if (bio) user.bio = bio;
		if (skills) user.skills = skills;
		if (location) user.location = location;
		if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };

		await user.save();

		res.json(user);
	} catch (error) {
		console.error('Update profile error:', error);
		res.status(500).json({ message: error.message });
	}
};