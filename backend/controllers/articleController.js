const Article = require('../models/Article');

// Helper: Generate URL-friendly slug
const generateSlug = (title) => {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove special chars
		.replace(/\s+/g, '-')     // Replace spaces with -
		.replace(/--+/g, '-')     // Replace multiple - with single -
		.trim();
};

// Helper: Calculate reading time
const calculateReadingTime = (content) => {
	const wordsPerMinute = 200;
	const wordCount = content.split(/\s+/).length;
	return Math.ceil(wordCount / wordsPerMinute);
};

// @desc    Get all published articles
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res) => {
	try {
		const { page = 1, limit = 10, tag, author, search } = req.query;

		// Build query
		const query = { published: true };

		if (tag) {
			query.tags = tag;
		}

		if (author) {
			query.author = author;
		}

		if (search) {
			query.$text = { $search: search };
		}

		// Execute query with pagination
		const articles = await Article.find(query)
			.populate('author', 'username displayName profilePicture')
			.sort({ publishedAt: -1 })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.select('-content'); // Don't send full content in list

		const total = await Article.countDocuments(query);

		res.json({
			articles,
			totalPages: Math.ceil(total / limit),
			currentPage: parseInt(page),
			total
		});
	} catch (error) {
		console.error('Get articles error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get single article by slug
// @route   GET /api/articles/:slug
// @access  Public
exports.getArticle = async (req, res) => {
	try {
		const article = await Article.findOne({ slug: req.params.slug })
			.populate('author', 'username displayName profilePicture bio socialLinks');

		if (!article) {
			return res.status(404).json({ message: 'Article not found' });
		}

		// Only count views for published articles
		if (article.published) {
			article.views += 1;
			await article.save();
		}

		res.json(article);
	} catch (error) {
		console.error('Get article error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private
exports.createArticle = async (req, res) => {
	try {
		const { title, content, excerpt, coverImage, tags, category, published } = req.body;

		// Validation
		if (!title || !content) {
			return res.status(400).json({
				message: 'Title and content are required'
			});
		}

		// Generate unique slug
		let slug = generateSlug(title);
		let slugExists = await Article.findOne({ slug });
		let counter = 1;

		while (slugExists) {
			slug = `${generateSlug(title)}-${counter}`;
			slugExists = await Article.findOne({ slug });
			counter++;
		}

		// Calculate reading time
		const readingTime = calculateReadingTime(content);

		// Create article
		const article = await Article.create({
			title,
			slug,
			content,
			excerpt: excerpt || content.substring(0, 150),
			coverImage,
			author: req.user._id,
			tags: tags || [],
			category,
			readingTime,
			published: published || false,
			publishedAt: published ? new Date() : null
		});

		const populatedArticle = await Article.findById(article._id)
			.populate('author', 'username displayName profilePicture');

		res.status(201).json(populatedArticle);
	} catch (error) {
		console.error('Create article error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private
exports.updateArticle = async (req, res) => {
	try {
		const article = await Article.findById(req.params.id);

		if (!article) {
			return res.status(404).json({ message: 'Article not found' });
		}

		// Check ownership
		if (article.author.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: 'Not authorized to update this article'
			});
		}

		const { title, content, excerpt, coverImage, tags, category, published } = req.body;

		// Update fields
		if (title) article.title = title;
		if (content) {
			article.content = content;
			article.readingTime = calculateReadingTime(content);
		}
		if (excerpt) article.excerpt = excerpt;
		if (coverImage !== undefined) article.coverImage = coverImage;
		if (tags) article.tags = tags;
		if (category) article.category = category;

		// Handle publishing
		if (published !== undefined) {
			article.published = published;
			if (published && !article.publishedAt) {
				article.publishedAt = new Date();
			}
		}

		await article.save();

		const updatedArticle = await Article.findById(article._id)
			.populate('author', 'username displayName profilePicture');

		res.json(updatedArticle);
	} catch (error) {
		console.error('Update article error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private
exports.deleteArticle = async (req, res) => {
	try {
		const article = await Article.findById(req.params.id);

		if (!article) {
			return res.status(404).json({ message: 'Article not found' });
		}

		// Check ownership
		if (article.author.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: 'Not authorized to delete this article'
			});
		}

		await article.deleteOne();

		res.json({ message: 'Article deleted successfully' });
	} catch (error) {
		console.error('Delete article error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get user's drafts
// @route   GET /api/articles/user/drafts
// @access  Private
exports.getUserDrafts = async (req, res) => {
	try {
		const drafts = await Article.find({
			author: req.user._id,
			published: false
		}).sort({ updatedAt: -1 });

		res.json(drafts);
	} catch (error) {
		console.error('Get drafts error:', error);
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get trending articles
// @route   GET /api/articles/trending
// @access  Public
exports.getTrendingArticles = async (req, res) => {
	try {
		const articles = await Article.find({ published: true })
			.populate('author', 'username displayName profilePicture')
			.sort({ views: -1, 'reactions.likes': -1 })
			.limit(10)
			.select('-content');

		res.json(articles);
	} catch (error) {
		console.error('Get trending error:', error);
		res.status(500).json({ message: error.message });
	}
};