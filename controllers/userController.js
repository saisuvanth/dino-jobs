const {User}=require('../models');
const nodemailer=require('nodemailer');

const mailServer=nodemailer.createTransport({
	service:'gmail',
	auth:{
		user:'rookievesper@gmail.com',
		pass:'furrySimp'
	}
});


function login(req){
	const {email,password,is_checked}=req.body;
	console.log(req.body);
	return User.findOne({email}).then(user=>{
		if(!user){
			throw new Error('User not found');
		}
		return user.comparePassword(password);
	}).then(user=>{
		console.log(user);
		if(user){
			return user.generateToken().then(token=>{
				console.log('25'+token);
				return token;
			});
		}
		else return false;
	}).catch(err=>{
		console.log('31'+err);
		return false;
	});
}

async function signup(user,res){
	const new_user=new User(user);
	return new_user.save()
		.then(async user=>{
			console.log(user);
			await sendEmail(user);
		}).catch(err=>{
			console.log(err);
			res.send(false);
		});
}


async function sendEmail(user){
	console.log(user.email);
	await User.findOne({email:user.email}).then(async user=>{
		if(!user){
			throw new Error('User not found');
		}
		const token= await user.generateToken();
		console.log(token)
		html='<h2>Please click the link below to verify your email</h2>'+'<a href="http://localhost:3000/verify/'+token+'">Verify Here</a>';
		const mailOptions = {
			from: 'rookievesper@gmail.com',
			to : user.email,
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

async function verifyEmail(token){
	return User.findByToken(token).then(user=>{
		if(!user){
			throw new Error('User not found');
		}
		console.log(user);
		user.email_verified=true;
		user.save()
		.then(async user=>{
			console.log(user);
			return true;
		})
		.catch(err=>{
			console.log(err);
			return false;
		});
	});
}

module.exports={login,signup,verifyEmail};