const { model, Schema } = require('mongoose');

const JobSchema = new Schema({
	role: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	description: {
		type: String,
	},
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
	salary: {
		type: Number,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	remote: {
		type: Boolean,
		default: false
	},
	req_skills: [String],
	req_experience: {
		type: Number,
		required: true
	}
});

module.exports = model('Job', JobSchema);