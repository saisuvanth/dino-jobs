const {Router}=require('express')
const { uuid } = require('uuidv4');
const router=Router();

router.get('/interview',(req,res)=>{
    res.redirect(`/interview/${uuid()}`)
})

router.get('/interview/:roomId', (req, res) => {
    res.render('pages/room', { roomId: req.params.roomId });
})

module.exports=router;
