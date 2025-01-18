import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        const connectionInstance = await mongoose.connect(`mongodb+srv://ayushag032:ayush123456@cluster0.hvt7s.mongodb.net/${DB_NAME}`);
        console.log(`\nMongoDB connected !! \nDB HOST: ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log("DB connection FAILED ",error);
        process.exit(1);
    }
}
export default connectDB;