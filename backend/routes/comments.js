const express = require('express');
const router = express.Router();
const {
	getComments,
	createComment,
	updateComment,
	deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Article comments routes
router.get('/articles/:articleId/comments', getComments);
router.post('/articles/:articleId/comments', protect, createComment);

// Individual comment routes
router.put('/comments/:id', protect, updateComment);
router.delete('/comments/:id', protect, deleteComment);

module.exports = router;