const {connect}=require('mongoose');

connect(process.env.MONGO_URI,{
	useNewUrlParser:true,
	useUnifiedTopology:true,
}).then(()=>{
	console.log('Database connected');
});

module.exports={
	User:require('./UserModel'),
	Job:require('./JobModel'),
	Company:require('./CompanyModel'),
	WorkExperience:require('./WorkExperienceModel'),
	SocialProfile:require('./SocialProfileModel'),
	Message:require('./MessageModel'),
}	