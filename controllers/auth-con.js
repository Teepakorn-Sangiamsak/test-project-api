const createError = require("../utils/create-error")
const prisma = require("../configs/prisma")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req,res,next)=>{
    try{
        // Step 1 req.body
        const {email, firstname , lastname ,password, confirmPassword} = req.body

        // console.log(email, firstname , lastname ,password, confirmPassword)
        // Step 2 validate
        // if(!email){
        //     return createError(400,"Email is require!!!")
        // }
        // if(!firstname){
        //     return createError(400,"Firstname is require!!!")
        // }
        // Step 3 Check already
        const checkEmail = await prisma.profile.findFirst({
            where:{
                email:email
            }
        })
        console.log(checkEmail)
        if(checkEmail){
            return checkEmail(400,"Email is already exits!!!")
        }
        // Step 4 Encrypt bcrypt
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password,salt)
        // console.log(hashedPassword)
        // Step 5 Insert to DB
        const profile = await prisma.profile.create({
            data:{
                email: email,
                firstname: firstname,
                lastname: lastname,
                password: hashedPassword
            }
        })
        // Step 6 Response
        res.json({message:"Register Success",
            profile:profile
        })
    }catch(error){
        console.log("Step 2 Catch")
        next(error)
    }

}

exports.login = async (req,res,next)=>{
    try {
        // Step 1 req.body
        const {email, password} = req.body
        // Step 2 Check email and password
        const profile = await prisma.profile.findFirst({
            where:{
                email:email
            }
        })
        if(!profile){
            return createError(400,"Email, Password is invalid!!!")
        }

        const isMatch = bcrypt.compareSync(password,profile.password)

        if(!isMatch){
            return createError(400,"Email, Password is invalid!!!")
        }
        // Step 3 Generate token
        const payload = {
            id:profile.id,
            email:profile.email,
            firstname:profile.firstname,
            lastname:profile.lastname,
            role: profile.role
        }
        const token = jwt.sign(payload,process.env.SECRET,{
            expiresIn:"1d"
        })

        // console.log(token)
        // Step 4 Response
        res.json({message:"Login Success",
            payload: payload,
            token: token
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }    
}

exports.currentUser = async(req,res,next)=>{
    try {
        res.json({message:"Hello, current user"})
    } catch (error) {
        next(error)
    }
}
