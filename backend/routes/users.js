const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');

// @desc    Get user profile by username
// @route   GET /api/users/:username
// @access  Public
router.get('/:username', async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username })
			.select('-password');

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const articles = await Article.find({
			author: user._id,
			published: true
		})
			.select('title slug excerpt publishedAt views reactions tags readingTime')
			.sort({ publishedAt: -1 });

		res.json({ user, articles });
	} catch (error) {
		console.error('Get user error:', error);
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;