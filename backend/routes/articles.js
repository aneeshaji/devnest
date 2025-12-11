const express = require('express');
const router = express.Router();
const {
	getArticles,
	getArticle,
	createArticle,
	updateArticle,
	deleteArticle,
	getUserDrafts,
	getTrendingArticles
} = require('../controllers/articleController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getArticles);
router.get('/trending', getTrendingArticles);
router.get('/:slug', getArticle);

// Protected routes
router.post('/', protect, createArticle);
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);
router.get('/user/drafts', protect, getUserDrafts);

module.exports = router;