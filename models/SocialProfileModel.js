const {model,Schema}=require('mongoose');

const SocialProfile=new Schema({
	website:{
		type:String,
		default:null
	},
	github:{
		type:String,
		default:null
	},
	linkedin:{
		type:String,
		default:null
	},
	twitter:{
		type:String,
		default:null
	}
});

module.exports=model('SocialProfile',SocialProfile);