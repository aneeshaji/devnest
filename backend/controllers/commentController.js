const Comment = require('../models/Comment');
const Article = require('../models/Article');

// @desc    Get comments for an article
// @route   GET /api/articles/:articleId/comments
// @access  Public
exports.getComments = async (req, res) => {
	try {
		const comments = await Comment.find({
			articleId: req.params.articleId,
			parentComment: null
		})
			.populate('author', 'username displayName profilePicture')
			.sort({ createdAt: -1 });

		// Get replies for each comment
		const commentsWithReplies = await Promise.all(
			comments.map(async (comment) => {
				const replies = await Comment.find({ parentComment: comment._id })
					.populate('author', 'username displayName profilePicture')
					.sort({ createdAt: 1 });

				return {
					...comment.toObject(),
					replies
				};
			})
		);

		res.json(commentsWithReplies);
	} catch (error) {
		console.error('Get comments error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create comment
// @route   POST /api/articles/:articleId/comments
// @access  Private
exports.createComment = async (req, res) => {
	try {
		const { content, parentComment } = req.body;

		if (!content) {
			return res.status(400).json({ message: 'Comment content is required' });
		}

		const article = await Article.findById(req.params.articleId);
		if (!article) {
			return res.status(404).json({ message: 'Article not found' });
		}

		const comment = await Comment.create({
			articleId: req.params.articleId,
			author: req.user._id,
			content,
			parentComment: parentComment || null
		});

		article.commentsCount += 1;
		await article.save();

		const populatedComment = await Comment.findById(comment._id)
			.populate('author', 'username displayName profilePicture');

		res.status(201).json(populatedComment);
	} catch (error) {
		console.error('Create comment error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id);

		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		if (comment.author.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: 'Not authorized' });
		}

		comment.content = req.body.content;
		comment.edited = true;
		await comment.save();

		const updatedComment = await Comment.findById(comment._id)
			.populate('author', 'username displayName profilePicture');

		res.json(updatedComment);
	} catch (error) {
		console.error('Update comment error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id);

		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		if (comment.author.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: 'Not authorized' });
		}

		const article = await Article.findById(comment.articleId);
		if (article) {
			article.commentsCount = Math.max(0, article.commentsCount - 1);
			await article.save();
		}

		await comment.deleteOne();

		res.json({ message: 'Comment deleted successfully' });
	} catch (error) {
		console.error('Delete comment error:', error);
		res.status(500).json({ message: error.message });
	}
};