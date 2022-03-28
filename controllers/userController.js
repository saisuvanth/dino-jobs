const {User}=require('../models');
const nodemailer=require('nodemailer');

const mailServer=nodemailer.createTransport({
	service:'yahoo',
	auth:{
		user:'rookievesper@yahoo.com',
		pass:'furrySimp'
	}
});


function login({username,password}){
	return User.findOne({username}).then(user=>{
		if(!user){
			throw new Error('User not found');
		}
		return user.comparePassword(password);
	}).then(user=>{
		return {...user,token:user.generateToken()};
	}).catch(err=>{
		console.log(err);
		return false;
	});
}

function signup(user){
	const new_user=new User(user);
	return new_user.save()
		.then(user=>{
			console.log(user);
			sendEmail(user);
		})
		.catch(err=>console.log(err));
}


function sendEmail(req,res){
	html='<h2>Please click the link below to verify your email</h2>'+'<a href="http://localhost:3000/verify/'+req.body.token+'">Verify Here</a>';
	User.findOne({username:req.body.email}).then(user=>{
		if(!user){
			throw new Error('User not found');
		}
		const token=user.generateToken();
		const mailOptions = {
			from: 'rookievesper@yahoo.com',
			to : req.body.email,
			subject:'Please confirm your Email account',
			html:html
		}
		mailServer.sendMail(mailOptions,(err,info)=>{
			if(err){
				console.log(err);
			}else{
				console.log(info);
			}
		})
	})
}

function verifyEmail(req){
	User.findByToken(req.query.token).then(user=>{
		if(!user){
			throw new Error('User not found');
		}
		user.email_verified=true;
		user.save();
		return true;
	}).catch(err=>{
		return false;
	})
}

module.exports={login,signup,verifyEmail};