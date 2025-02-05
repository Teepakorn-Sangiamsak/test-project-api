const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/auth-con")

// @ENDPOINT http://localhost:8000/api/register
authRouter.post('/register', authController.register )

// export
module.exports = authRouter