import mongoose from "mongoose"

const mongoUrl =  process.env.MONGODB

const connectDB = async () => {
    try {
       const Connection = await mongoose.connect(mongoUrl)
       console.log("Database Connected")
    } catch (error) {
        console.log("Database connection error: ", error)
        process.exit(1)
    }
}


export default connectDB