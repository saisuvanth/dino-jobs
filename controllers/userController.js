const {User}=require('../models');

function login({username,password}){
	return User.findOne({username}).then(user=>{
		if(!user){
			throw new Error('User not found');
		}
		return user.comparePassword(password);
	}).then(user=>{
		return user.generateToken();
	});
}

function signup(user){
	const new_user=new User(user);
	return new_user.save()
		.then(user=> user)
		.catch(err=>console.log(err));
}