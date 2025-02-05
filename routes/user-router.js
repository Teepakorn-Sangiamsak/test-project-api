const express = require('express')
const userRouter = express.Router()
const userController = require("../controllers/user-con")

// @ENDPOINT http://localhost:8000/api/user
userRouter.get('/user', userController.listUsers)
userRouter.patch('/user/update-role', userController.updateRole)
userRouter.delete('/user/:id', userController.deleteUser)

module.exports = userRouter