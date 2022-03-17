const {model,Schema}=require('mongoose');

const WorkExperienceModel=new Schema({
	company_name:{
		type:String,
		required:true
	},
	position:{
		type:String,
		required:true
	},
	start_date:{
		type:Date,
		required:true
	},
	end_date:{
		type:Date,
	},
	current:{
		type:Boolean,
		default:false
	},
	description:{
		type:String,
	},
});

module.exports=model('WorkExperience',WorkExperienceModel);