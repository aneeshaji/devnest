const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Username is required'],
		unique: true,
		trim: true,
		minlength: [3, 'Username must be at least 3 characters'],
		maxlength: [30, 'Username cannot exceed 30 characters']
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		lowercase: true,
		trim: true,
		match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: [6, 'Password must be at least 6 characters']
	},
	displayName: {
		type: String,
		default: function () {
			return this.username;
		}
	},
	bio: {
		type: String,
		maxlength: [200, 'Bio cannot exceed 200 characters'],
		default: ''
	},
	profilePicture: {
		type: String,
		default: 'https://via.placeholder.com/150'
	},
	coverImage: {
		type: String,
		default: ''
	},
	socialLinks: {
		github: { type: String, default: '' },
		linkedin: { type: String, default: '' },
		twitter: { type: String, default: '' },
		website: { type: String, default: '' }
	},
	skills: [{
		type: String
	}],
	location: {
		type: String,
		default: ''
	},
	followers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	following: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	followingTags: [{
		type: String
	}],
	emailVerified: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

// Hash password before saving - FIXED VERSION
userSchema.pre('save', async function () {
	if (!this.isModified('password')) {
		return;
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

module.exports = mongoose.model('User', userSchema);