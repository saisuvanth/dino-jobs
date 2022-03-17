const {model,Schema}=require('mongoose');

const MessageModel=new Schema({
	sender:{
		type:Schema.Types.ObjectId,
		ref:'User',
		required:true
	},
	receiver:{
		type:Schema.Types.ObjectId,
		ref:'User',
		required:true
	},
	message:{
		type:String,
		required:true
	},
	created_at:{
		type:Date,
		default:Date.now
	},
});


module.exports=model('Message',MessageModel);