const {model,Schema}=require('mongoose');
const isEmail = require('validator/lib/isEmail');
const {sign}=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

const UserModel=new Schema({
	first_name:{
		type:String,
		required:true
	},
	last_name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		validate: {
			validator: isEmail,
			message: `{VALUE} is not a valid email`
		}
	},
	password:{
		type:String,
		required:true
	},
	username:{
		type:String,
		required:true
	},
	type:{
		type:String,
		default:'User'
	},
	company:{
		type:Schema.Types.ObjectId,
		ref:'Company',
		default:null
	},
	phone:{
		type:String,
		required:true
	},
	avatar:{
		type:String,
		default:null
	},
	cover_photo:{
		type:String,
		default:null
	},
	resume:{
		type:String,
		default:null
	},
	location:String,
	bio:String,
	skills:[String],
	work_experience:{
		type:Schema.Types.ObjectId,
		ref:'WorkExperience',
	},
	social_profiles:{
		type:Schema.Types.ObjectId,
		ref:'SocialProfile',
	},
	pref_role:{
		type:String,
		default:null
	},
	tokens:[{
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
	// delete userObject._id
	return userObject;
}

//compare password
UserSchema.methods.comparePassword=function(password){
	const user=this;
	return bcrypt.compare(password,user.password)
		.then(isMatch=>{
			if(!isMatch){
				return Promise.reject();
			}
			return user;
		}
	);
}

UserSchema.methods.generateToken = function () {
	const user = this;
	const access = user.type;
	const token = sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET,{expiresIn:'1d',algorithm:'RS256'}).toString();
	user.tokens.push({access,token});
	return user.save().then(()=>{
		return token;
	});
}

UserSchema.statics.findByToken = function (token) {
	let User = this;
	let decoded;
	try {
		decoded = verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject();
	}
	return User.findOne({ _id: decoded._id, 'tokens.token': token, 'tokens.access': decoded.access });
}

UserSchema.methods.removeToken=function(token){
	const user=this;
	return user.update({
		$pull:{
			tokens:{token}
		}
	});
}

UserSchema.pre('save', function (next) {
	let user = this;
	console.log(user);
	if (user.isModified('password')) {
		bcrypt.genSalt(10).then((salt, err) => {
			if (err) throw err;
			bcrypt.hash(user.password, salt, (er, hash) => {
				if (er) throw er;
				user.password = hash;
				next();
			});
		});
	} else
		next();
})

module.exports=model('User',UserModel);