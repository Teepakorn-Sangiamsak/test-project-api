# Server

## Step 1 create package
```bash
npm init -y
```

## Step 2 install package....
```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod
```
```bash
npx prisma init
```
## Step 3 Git
```bash
git init
git add .
git commit -m "message"
```

next Step
copy code from repo
only first time
```bash
git remote add origin https://github.com/Teepakorn-Sangiamsak/test-project-api.git
git branch -M main
git push -u origin main
```

when update code
```bash
git add .
git commit -m "message"
git push
```

## Step 4 update package.json
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js",
    "dev": "nodemon index.js"
  },
```

and code
index.js
```js
const express = require("express")
const app = express()

// Start Server
const PORT = 8000
app.listen(PORT,()=> console.log(`Server is runnig on port ${PORT}`))
```

## Step 5 use middlewares
```js
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()

// Middlewares
app.use(cors()) // Allows cross domain
app.use(morgan("dev")) // Show log terminal
app.use(express.json()) // For read json

// Routing

// Start Server
const PORT = 8000
app.listen(PORT,()=> console.log(`Server is runnig on port ${PORT}`))
```

## Step 6 create folder router & controllers [Register]
/controllers/auth-con.js
```js
exports.register = (req,res,next)=>{
    try{
        res.json({message:"hello register"})
    }catch(err){
        res.status(500).json({message:"Server Error!!!!!!!!!!!!!!!!!!!"})
        // next(err)
    }

}
```
/router/auth-router.js
```js
const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/auth-con")

// @ENDPOINT http://localhost:8000/api/register
authRouter.post('/register', authController.register )

// export
module.exports = authRouter
```

## Step 7 Create handle Error
/middlewares/error.js
```js
const handleErrors = (err,req,res,next) =>{
    res
    .status(err.statusCode || 500)
    .json({message: err.message || "Somting wrong!!"})

}

module.exports = handleErrors
```

and use in index.js
```js
const handleErrors = require("./middlewares/error")

// Handle errors อยู่รองสุดท้ายใน file index.js
app.use(handleErrors)
```

and change in try_catch
```js
exports.login = (req,res,next)=>{
    try {
        console.log(dsgdsgfs)
        res.json({message:"hello login"})
    } catch (error) {
        console.log(error.message)
        next(error)
    }    
}
```

when update code in Github
```bash
git add .
git commit -m "msg"
git push
```
## Step 8 Validate with zod
/middlewares/validators.js
```js
const {z} =require("zod")
// TEST validator
exports.registerSchema = z.object({
    email: z.string().email("Email ไม่ถูกต้อง"),
    firstname: z.string().min(3,"Firstname ต้องมากกว่า 3 อักขระ"),
    lastname: z.string().min(3,"Lastname ต้องมากกว่า 3 อักขระ"),
    password: z.string().min(6,"Password ต้องมากกว่า 6 อักขระ"),
    confirmPassword: z.string().min(6,"Confirm Password ต้องมากกว่า 6 อักขระ")
}).refine((data)=>data.password === data.confirmPassword,{
    message:"Confirm Password ไม่ตรงกัน",
    path:['confirmPassword']
})

exports.loginSchema = z.object({
    email: z.string().email("Email ไม่ถูกต้อง"),
    password: z.string().min(6,"Password ต้องมากกว่า 6 อักขระ"),
})

exports.validatorWithZod = (schema) => (req,res,next) =>{
    try {
        console.log('Hello middlewares')
        schema.parse(req.body)
        next()
    } catch (error) {
        const errMsg = error.errors.map((item)=>item.message)
        const errText = errMsg.join(",")
        const mergeError = new Error(errText)
        next(mergeError)
    }
}
```
and then update code
/routes/auth-router.js
```js
const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/auth-con")
const { validatorWithZod, loginSchema, registerSchema } = require("../middlewares/validator")

// @ENDPOINT http://localhost:8000/api/register
authRouter.post('/register',validatorWithZod(registerSchema) ,authController.register )
authRouter.post('/login',validatorWithZod(loginSchema), authController.login )

// export
module.exports = authRouter
```

## Step 9 Prisma

```bash
npx prisma db push
```
# or
```bash
npx prisma migrate dev --name init
```

### Config prisma
/config/prisma.js
```js
const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

module.exports = prisma
```
update code
Register
/controllers/auth-con.js
```js
const createError = require("../utils/create-error")
const prisma = require("../configs/prisma")
const bcrypt = require("bcryptjs")

exports.register = async (req,res,next)=>{
    try{
        // Step 1 req.body
        const {email, firstname , lastname ,password, confirmPassword} = req.body
        // Step 2 validate}
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
        res.json({message:"Register Success"})
    }catch(error){
        console.log("Step 2 Catch")
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
```