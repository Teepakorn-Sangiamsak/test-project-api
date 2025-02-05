exports.register = (req,res,next)=>{
    try{
        res.json({message:"hello register"})
    }catch(error){
        next(error)
    }

}

exports.login = (req,res,next)=>{
    try {
        console.log(dsgdsgfs)
        res.json({message:"hello login"})
    } catch (error) {
        console.log(error.message)
        next(error)
    }    
}