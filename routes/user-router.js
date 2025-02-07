const express = require('express')
const userRouter = express.Router()
// import controller
const userController = require("../controllers/user-con")
// import middleware
const { authCheck } = require("../middlewares/auth-middleware")
// @ENDPOINT http://localhost:8000/api/user
userRouter.get('/user',authCheck , userController.listUsers)
userRouter.patch('/user/update-role', userController.updateRole)
userRouter.delete('/user/:id', userController.deleteUser)

module.exports = userRouter