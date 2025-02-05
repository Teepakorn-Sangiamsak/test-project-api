const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const app = express()

app.use(cors())
app.use(morgan())

const PORT = 8000
app.listen(PORT,()=>console.log(`server is run port ${PORT}`))