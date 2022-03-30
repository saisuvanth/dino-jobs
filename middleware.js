const {User}=require('./models');


const getLogin=(req,res,next)=>{
	const cookie=req.cookies.login;
	if(cookie){
		User.findByToken(cookie).then(user=>{
			console.log(user);
			if(user){
				req.user=user;
				next();
			}else{
				throw new Error('User not found');
			}
		}).catch(err=>{
			err.removeToken(token).then(()=>{
				res.clearCookie('login');
				res.redirect('/');
			}).catch(err=>console.log(err));
		});
	}else{
		res.redirect('/');
	}
}
const loginFlag=(req,res,next)=>{
	const cookie=req.cookies.login;
	if(cookie){
		res.redirect('/home');
	}else{
		next();
	}
}

module.exports={getLogin,loginFlag}