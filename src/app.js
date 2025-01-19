import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,// to whom origin allowed
    credentifals: true,
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}));// to decode the url
app.use(express.static("public"));
app.use(cookieParser());

export default app;