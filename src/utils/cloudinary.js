import { v2 as cloudinary } from "cloudinary"
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({path: './.env'});

cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("Cloudinary Config:", {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });
  

const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload
        (localFilePath,{
            resource_type: "auto",
        })
        // file has been uploaded successfully
        console.log("File is uploaded successfully ",response);

        // agar file upload nhi hua to file lo hum unlink kar denge
        // await fs.unlink(localFilePath); // remove the locally temp file as the 
        //upload operation get failed
        fs.unlink(localFilePath, (err)=>{
            if (err) {
                console.error("Error removing local file:", err);
            } else {
                console.log("Local file deleted successfully.");
            }
        })
        return response;
    }
    catch(error){
        console.error("Error during upload:",error);
    }
}

export {uploadOnCloudinary};