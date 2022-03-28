const {Router}=require('express');
const {login,signup,verifyEmail}=require('../controllers/userController');
const router=Router();

router.post('/login',(req,res,next)=>{
	login(req.body).then(user=>{
		if(user){
			res.cookie('login',user.token,{
				maxAge:1000*60*60*24,
				httpOnly:true,
				secure:true
			});
			res.redirect('/home');
		}else{
			res.redirect('/login');
		}
	})
})

router.post('/register',(req,res,next)=>{
	console.log(req.body);
	const {email,password,full_name}=req.body;
	signup({email,password,full_name,email_verified:false});
})

router.post('/verify/',(req,res,next)=>{
	const token=req.query.token;
	if(verifyEmail(token)){
		res.send('Email verified');
	}else{
		res.send('No page exists');
	}
})













module.exports=router;