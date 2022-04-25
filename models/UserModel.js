const { model, Schema } = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const { sign, verify } = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
	full_name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: isEmail,
			message: `{VALUE} is not a valid email`
		}
	},
	email_verified: {
		type: Boolean,
	},
	password: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		default: 'User'
	},
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		default: null
	},
	phone: {
		type: String,
	},
	avatar: {
		type: String,
		default: null
	},
	cover_photo: {
		type: String,
		default: null
	},
	resume: {
		type: String,
		default: null
	},
	location: String,
	bio: String,
	skills: [String],
	work_experience: [{
		type: Schema.Types.ObjectId,
		ref: 'WorkExperience',
	}],
	social_profiles: [{
		type: Schema.Types.ObjectId,
		ref: 'SocialProfile',
	}],
	pref_role: {
		type: String,
		default: null
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.tokens;
	userObject.key = userObject._id;
	console.log(userObject);
	return userObject;
}

//compare password
UserSchema.methods.comparePassword = function (password) {
	const user = this;
	return bcrypt.compare(password, user.password).then(isMatch => {
		console.log(isMatch);
		if (!isMatch) {
			return Promise.reject();
		}
		return user;
	}
	);
}

UserSchema.methods.generateToken = function () {
	const user = this;
	const access = user.type;
	const token = sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET, { expiresIn: '1d' }).toString();
	user.tokens.push({ access, token });
	return user.save().then((us) => {
		return token;
	});
}

UserSchema.statics.findByToken = function (token) {
	let User = this;
	let decoded;
	try {
		decoded = verify(token, process.env.JWT_SECRET);
	} catch (e) {
		if (e.name === 'TokenExpiredError') {
			throw User.findOne({ 'tokens.token': token });
		}
		return Promise.reject();
	}
	return User.findOne({ _id: decoded._id, 'tokens.token': token, 'tokens.access': decoded.access });
}

UserSchema.methods.removeToken = function (token) {
	const user = this;
	return user.update({
		$pull: {
			tokens: { token }
		}
	});
}

UserSchema.pre('save', function (next) {
	let user = this;
	console.log(user.isModified('password'));
	if (user.isModified('password')) {
		bcrypt.genSalt(10).then((salt, err) => {
			if (err) throw err;
			bcrypt.hash(user.password, salt, (er, hash) => {
				if (er) throw er;
				user.password = hash;
				console.log(next);
				return next();
			});
		});
	} else
		return next();
})

module.exports = model('User', UserSchema);