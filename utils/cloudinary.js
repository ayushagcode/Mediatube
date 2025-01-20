import { v2 as cloudinary } from "cloudinary"
import fs from "fs";

cloudinary.config({
     cloud_name: process.env.CLOUDINARY_API_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
})

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
        return response;
    }
    catch(error){
        // agar file upload nhi hua to file lo hum unlink kar denge
        fs.unlink(localFilePath); // remove the locally temp file as the 
        //upload operation get failed
    }
}
const uploadResult = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
    {
       public_id: 'shoes'
    },
    function(error,result){console.log(result);});
