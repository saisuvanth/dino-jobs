const {Router}=require('express');
const {login,signup,verifyEmail}=require('../controllers/userController');
const router=Router();

router.post('/login',(req,res,next)=>{
	login(req.body).then(user=>{
		
	})
})

router.post('/register',(req,res,next)=>{
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