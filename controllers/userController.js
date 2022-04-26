const { User, Job } = require("../models");
const nodemailer = require("nodemailer");

const mailServer = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "rookievesper@gmail.com",
		pass: "furrysimp",
	},
});

function login(req) {
	const { email, password, is_checked } = req.body;
	return User.findOne({ email })
		.then((user) => {
			if (!user) {
				throw new Error("User not found");
			}
			return user.comparePassword(password);
		})
		.then((user) => {
			if (user && user.type === 'user') {
				return user.generateToken().then((token) => {
					return token;
				});
			} else throw 'PASSWORD DOESNT MATCH';
		})
		.catch((err) => {
			throw 'Internal Server Error';
		});
}

function loginMan(req) {
	const { email, password, is_checked } = req.body;
	return User.findOne({ email })
		.then((user) => {
			if (!user) {
				throw new Error("User not found");
			}
			return user.comparePassword(password);
		})
		.then((user) => {
			console.log(user);
			if (user && user.type === 'manager') {
				return user.generateToken().then((token) => {
					return token;
				});
			} else throw 'Password doesnt match or Unauthorized';
		})
		.catch((err) => {
			throw 'Internal Server Error';
		});
}

async function signup(user, res) {
	const new_user = new User(user);
	return new_user
		.save()
		.then(async (user) => {
			res.status(200).json({ result: "Mail Sent" });
			await sendEmail(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json({ result: "User already exists" });
		});
}

async function updateUser(req, res, next) {
	try {
		let doc = await User.findOneAndUpdate({ _id: req.user.key }, req.body, { new: false });
		console.log(doc);
	} catch (err) {
		req.err = err;
		next();
	}
}

async function sendEmail(user) {
	await User.findOne({ email: user.email }).then(async (user) => {
		if (!user) {
			throw new Error("User not found");
		}
		const token = await user.generateToken();
		html =
			"<h2>Please click the link below to verify your email</h2>" +
			'<a href="http://localhost:3000/verify/' +
			token +
			'">Verify Here</a>';
		const mailOptions = {
			from: "rookievesper@gmail.com",
			to: user.email,
			subject: "Please confirm your Email account",
			html: html,
		};
		mailServer.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err);
			} else {
			}
		});
	});
}

async function verifyEmail(token) {
	return User.findByToken(token).then((user) => {
		if (!user) {
			throw new Error("User not found");
		}
		user.email_verified = true;
		return user
			.save()
			.then(async (user) => {
				return true;
			})
			.catch((err) => {
				console.log(err);
				return false;
			});
	});
}

async function applyJob(req, res, next) {
	try {
		const job = req.body;
		const user = req.user;
		Job.findOne({ job_id: job._id }, (err, docs) => {
			console.log(docs);
			User.updateOne({ _id: user.key.toString() }, { $push: { applied_jobs: docs } }, (err, docs) => {
				console.log(docs);
				res.status(200).json({ result: "Job Applied" });
			});
		});
		// console.log(new_user);
	} catch (err) {
		req.err = err;
		next();
	}
}
module.exports = { login, signup, verifyEmail, updateUser, applyJob, loginMan };
