import mongoose from "mongoose"

export const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI!)
        console.log("Connected to DB successfuly")
    } catch (error) {
        console.log("Error when connecting to DB ",error)
    }
}