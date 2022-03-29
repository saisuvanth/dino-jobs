const {Router}=require('express');
const {login,signup,verifyEmail}=require('../controllers/userController');
const router=Router();

router.post('/login',(req,res,next)=>{
	login(req).then(token=>{
		if(token){
			res.cookie('login',token).redirect('/home');
		}else{
			res.redirect('/');
		}
	})
})

router.post('/register',async (req,res,next)=>{
	console.log(req.body);
	const {email,password,full_name}=req.body;
	await signup({email,password,full_name,email_verified:false},res);
})

router.get('/verify/:token',(req,res,next)=>{
	const token=req.params.token;
	if(verifyEmail(token)){
		res.redirect('/login');
	}else{
		res.send('No page exists');
	}
})













module.exports=router;