const {User}=require('./models');


const getLogin=(req,res,next)=>{
	const cookie=req.cookies.login;
	if(cookie){
		User.findByToken(cookie).then(user=>{
			if(user){
				req.user=user;
				next();
			}else{
				throw new Error('User not found');
			}
		}).catch(err=>{
			err.removeToken(token);
			res.redirect('/');
		});
	}else{
		next();
		res.redirect('/');
	}
}