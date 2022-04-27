const { model, Schema } = require("mongoose");
const isEmail = require("validator/lib/isEmail");
const { sign, verify } = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
      message: `{VALUE} is not a valid email`,
    },
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "user",
    enum: ["user", "manager", "admin"],
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  },
  phone: {
    type: String,
  },
  avatar: {
    type: String,
    default: null,
  },
  address: String,
  bio: String,
  skills: [String],
  secondarySchool: {
    name: String,
    location: String,
    startDate: String,
    endDate: String,
    cgpa: String,
  },
  underGraduate: {
    name: String,
    location: String,
    startDate: String,
    endDate: String,
    cgpa: String,
  },
  workExperience: {
    companyName: {
      type: String,
    },
    position: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    }
  },
  website: {
    type: String,
    default: null
  },
  github: {
    type: String,
    default: null
  },
  linkedin: {
    type: String,
    default: null
  },
  twitter: {
    type: String,
    default: null
  },
  applied_jobs: [{
    type: Schema.Types.ObjectId,
    ref: "Job",
    unique: true,
  }
  ],
  prefRole: {
    type: String,
    default: null,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  userObject.key = userObject._id;
  delete userObject._id;
  return userObject;
};

//compare password
UserSchema.methods.comparePassword = function (password) {
  const user = this;
  return bcrypt.compare(password, user.password).then((isMatch) => {
    if (!isMatch) {
      return Promise.reject();
    }
    return user;
  });
};

UserSchema.methods.generateToken = function () {
  const user = this;
  const access = user.type;
  const token = sign(
    { _id: user._id.toHexString(), access },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  ).toString();
  user.tokens.push({ access, token });
  return user.save().then((us) => {
    return token;
  });
};

UserSchema.statics.findByToken = async function (token) {
  let User = this;
  let decoded;
  try {
    decoded = verify(token, process.env.JWT_SECRET);
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      throw await User.findOne({ "tokens.token": token });
    }
    return Promise.reject();
  }
  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": decoded.access,
  });
};

UserSchema.methods.removeToken = function (token) {
  const user = this;
  console.log(user.token);
  return user.update({
    $pull: {
      tokens: { token },
    },
  });
};

UserSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10).then((salt, err) => {
      if (err) throw err;
      bcrypt.hash(user.password, salt, (er, hash) => {
        if (er) throw er;
        user.password = hash;
        return next();
      });
    });
  } else return next();
});

module.exports = model("User", UserSchema);
