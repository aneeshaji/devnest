const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	articleId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Article',
		required: true
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	content: {
		type: String,
		required: [true, 'Comment content is required'],
		maxlength: [1000, 'Comment cannot exceed 1000 characters']
	},
	parentComment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
		default: null
	},
	likes: {
		type: Number,
		default: 0
	},
	edited: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

commentSchema.index({ articleId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);