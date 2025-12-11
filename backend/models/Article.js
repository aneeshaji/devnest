const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Title is required'],
		trim: true,
		maxlength: [200, 'Title cannot exceed 200 characters']
	},
	slug: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	content: {
		type: String,
		required: [true, 'Content is required']
	},
	excerpt: {
		type: String,
		maxlength: [300, 'Excerpt cannot exceed 300 characters']
	},
	coverImage: {
		type: String,
		default: ''
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	tags: [{
		type: String,
		trim: true,
		lowercase: true
	}],
	category: {
		type: String,
		default: 'General'
	},
	published: {
		type: Boolean,
		default: false
	},
	publishedAt: {
		type: Date
	},
	views: {
		type: Number,
		default: 0
	},
	readingTime: {
		type: Number, // in minutes
		default: 0
	},
	reactions: {
		likes: { type: Number, default: 0 },
		hearts: { type: Number, default: 0 },
		unicorns: { type: Number, default: 0 },
		bookmarks: { type: Number, default: 0 }
	},
	commentsCount: {
		type: Number,
		default: 0
	}
}, {
	timestamps: true
});

// Create indexes for better performance
articleSchema.index({ slug: 1 });
articleSchema.index({ author: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ published: 1, publishedAt: -1 });
articleSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Article', articleSchema);