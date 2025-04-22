import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import userRouter from "../Routers/user.routes.js"
import employeeRouter from "../Routers/employee.routes.js"
import connectDB from "../Database/db.js"


const app = express()
dotenv.config({
    path: './env'
})

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(cors())


app.use('/auth',userRouter)
app.use('/employee',employeeRouter)

connectDB()
.then(() => {
    
    app.listen(PORT, () => {
        console.log(`Running on port ${PORT}`)
    })
}).catch((err) => {
    console.log("MongoDB connection failed")
})
