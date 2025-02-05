exports.register = (req,res,next)=>{
    try{
        res.json({message:"hello register"})
    }catch(err){
        res.status(500).json({message:"Server Error!!!!!!!!!!!!!!!!!!!"})
        // next(err)
    }

}