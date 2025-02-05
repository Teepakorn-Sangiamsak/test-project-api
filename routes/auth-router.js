const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/auth-con")
const { validatorWithZod, loginSchema, registerSchema } = require("../middlewares/validator")



// @ENDPOINT http://localhost:8000/api/register
authRouter.post('/register',validatorWithZod(registerSchema) ,authController.register )
authRouter.post('/login',validatorWithZod(loginSchema), authController.login )

// export
module.exports = authRouter