import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,// to whom origin allowed
    credentifals: true,
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}));// to decode the url
app.use(express.static("public"));
app.use(cookieParser());

// routes import -> like this only
import userRouter from "./routes/user.routes.js";

// routes declaration-> we define router on other folder
// so we have to use middleware through app.use 

// http://localhost:8000/api/v1/users/registerUser
// http://localhost:8000/api/v1/users/loginUser

app.use("/api/v1/users",userRouter)



export default app;