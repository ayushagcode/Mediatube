// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js";
dotenv.config({path: '/env'});

connectDB()
.then(()=>{
    const port = process.env.PORT || 8000;
    app.listen(port,()=>{
    `Server Listening at port ${port}`;
    });
})
.catch((error)=>{
    console.log("MONGODB connection failed !!!", error);
})
/*
import express from "express";
const app = express();

;(async ()=>{
    try{
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}` )

        app.on("error",()=>{
            console.log("ERROR:",error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    }
    catch(error){

    }
})()
*/