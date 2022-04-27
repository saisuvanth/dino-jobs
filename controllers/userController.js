const { User, Job, Company } = require("../models");
const nodemailer = require("nodemailer");
const multer = require("multer");
const { uuid } = require("uuidv4");
const path = require('path');
const { Console } = require("console");

const multerStorage = multer.diskStorage({
	destination: './public/uploads',
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
})
//allows us to check if user only uploads images and nothing else
const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(
			new Error("The file is not an image. Please upload a image", 400),
			false
		);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

const resizeUserPhoto = async (req, res, next) => {
	try {
		if (!req.file) return next();
		req.file.filename = `${uuid()}.jpeg`;
		console.log(req.file);

		await sharp(req.file.buffer)
			.resize(500, 500)
			.toFormat("jpeg")
			.jpeg({ quality: 90 })
			.toFile(`./public/uploads/${req.file.filename}`);
		next();
	} catch (err) { }
};

const uploadUserPhoto = upload.single("avatar");


const mailServer = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "rookievesper@gmail.com",
		pass: "furrysimp",
	},
});

function login(req, flag, res) {
	const { email, password, is_checked } = req.body;
	return User.findOne({ email })
		.then((user) => {
			if (!user) {
				res.status(400).send({ message: 'User not found' })
			}
			return user.comparePassword(password);
		})
		.then((user) => {
			if (user && user.type === flag) {
				return user.generateToken().then((token) => {
					return token;
				});
			} else res.status(400).send('PASSWORD DOESNT MATCH');
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
	req.body.avatar = req.file.filename;
	console.log(req.body)
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
		Job.findOne({ _id: job._id }, (err, docs) => {
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

const createJob = async (req, res, next) => {
	const job = req.body;
	const user_id = req.user;
	try {
		job.remote = job.remote === 'True' ? true : false;
		const user = await User.findOne({ _id: user_id.key }).populate('company');
		const new_job = new Job(job);
		if (user.company) {
			new_job.company = user.company;
			await new_job.save((err, docs) => {
				if (err) next('Internal Server Error');
				res.status(200).json({ result: 'Job Created' });
			});
		} else {
			next('User doesnt have a company');
		}
	} catch (err) {
		next(err);
	}
}

const logout = async (req, res, next) => {
	console.log(req.user);
	try {
		const user = await User.findOne({ _id: req.user.key });
		user.removeToken(req.cookies.login);
		res.clearCookie('login').redirect('/');
	} catch (err) {
		req.err = err;
		next();
	}
}

const deleteUser = async (req, res, next) => {
	const { type, user } = req.params;
	try {
		if (type === 'user') {
			await User.findOneAndDelete({ _id: user });
			res.status(200).redirect('/admin');
		} else if (type === 'job') {
			await Job.findOneAndDelete({ _id: user });
			res.status(200).redirect('/admin');
		}
		else if (type === 'company') {
			await Company.findOneAndDelete({ _id: user });
			res.status(200).redirect('/admin');
		} else {
			res.status(400).json({ result: 'Unauthorized' });
		}
	} catch (err) {

	}
}

const getJobApplicants = async (req, res, next) => {
	const { job_id } = req.params;
	try {
		const user = await User.find({ 'applied_jobs.$oid': job_id });
	} catch (err) {
		req.err = err;
		next();
	}
}
const managerProfile = async (req, res, next) => {
	try {
		if (req.body.website) {
			delete req.body.nam;
			delete req.body.avatar;
			delete req.body.phone;
			delete req.body.bio;
			req.body.logo = '';
		}
		const comp = new Company(req.body);
		const user = await User.updateOne({ _id: req.user.key }, { company: comp });
		comp.save((err, docs) => {
			if (err) console.log(err);
			console.log(docs)
		});
	} catch (err) {
		req.err = err;
		next();
	}
}
module.exports = { login, signup, verifyEmail, updateUser, applyJob, createJob, resizeUserPhoto, uploadUserPhoto, logout, deleteUser, getJobApplicants, managerProfile };
