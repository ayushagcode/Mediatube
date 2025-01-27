import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId)=>
{
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();// custom methods call
        const refreshToken = user.generateRefreshToken();// custom methods call
        // user mei add kar diya
        user.refreshToken = refreshToken;
        // add karane ke baad save bhi to karenge
        // during save the mongoose models-> gets kicked in-> so we pass one method i.e. validateBeforeSave
        await user.save({ValidateBeforeSave:false}); // false means validate mat karo sidha save karo
        
        return {accessToken,refreshToken}
    }   
    catch(error)
    { 
        throw new ApiError(500,"Something went wrong while generating refresh and access token"); 
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    // res.status(200).json({
    //     message:"ok"
    // })
    // get user details from frontend
    // validation - not empty
    // check if user already exist: username,email
    // check for images, check for avatar
    // upload them to cloudinary, avatar uploaded properly
    // create user object - create entry in db
    // remove password and refresh token field from response
    // can remove the images from local 
    // check for user creation-
    // return res

    const {fullName, email, username, password} = req.body;

    // if(fullName==="")
    // {
    //     throw new ApiError(400, "All fields are required");
    // } you can check like this one-by-one or directly using .some()->

    if([fullName,email,username,password].some((field) => field?.trim()===""))
    {
        throw new ApiError(400,"All fields are required!!");
    }
    const exisitingUser = await User.findOne({
        $or: [{username}, {email}]
    })
    
    if(exisitingUser){
        console.log("Existing username",username,"\nemail", email);
        throw new ApiError(409,"User with email or username exist"); 
    }
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
    {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath)
    {
        throw new ApiError(400,"Avatar file is required");
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar file is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // check
        email,
        password, // Plaintext password passed; it will be hashed in the pre-save hook
        username: username.toLowerCase(),
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken "
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user!!")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User created Successfully!!")
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    // req body se details le aao
    // get their username or email id or both in same section
    // find the user
    // password check
    // access and refresh token generate
    // send cookie
    // if exists then redirect to home page
    // else redirect it to register or send incorrect details
    const {username, email, password} = req.body; 
    console.log(email);

    if(!username && !email) // or (!(username || email))
    {
        throw new ApiError(400,"Username or email is required");
    }
    
    // ye functions jo hai findOne etc ye mongoose ke through available hue hai to "User" aayega
    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(400,"User does not exist");
    }
    // idhar isPasswordCorrect wale jo function hai vo aapke through available hue hai
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid)
    {
        throw new ApiError(401,"Invalid User Credentials");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshtoken");

    // their are some options in cookies
    const options = {
        httpOnly: true,
        secure: true,
    }

    // send cookies
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,
                refreshToken
            },
            "User Logged in Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    //  now how to get the details to logout
    await User.findByIdAndUpdate(
        req.user._id,
        {   
            //operator->set
            $set: {
                refreshToken:1 
            }
        },
        {
            new:true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out"))
})
const refreshAccessToken = asyncHandler(async(req, _,next)=>{

    try {
        // ya to cookies se access kar lo ya kya pta body se bhej rha ho
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
        if(!incomingRefreshToken){
            throw new ApiError(401,"Unauthorized Request");
        }
        // now we have to verify also incoming token 
        const decodedToken = jwt.verify(
              incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(401,"Invalid refresh token");
        }
        // if not same 
        if(incomingRefreshToken !== user?.refreshToken)
        {
            throw new ApiError(401,"Refresh Token is expired of used");
        }
    
        const options = {
            httpOnly: true,
            secure: true,
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
    
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refresToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,{accessToken,refreshToken: newRefreshToken},
                "Access token refreshed successfully"
            )
        );
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token");
    }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body;
    // agar pass change ho rha hai to logged in hai 
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect)
    {
        throw new ApiError(400,"Invalid Password");
    }
    // pass update
    user.password = newPassword;
    // save pass
    await user.save({ValidateBeforeSave: false});
    return res.status(200)
              .json(new ApiResponse(200,{},"Password changed successfully"));
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(200,req.user,"current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullName,email} = req.body

    if(!fullName || !email){
        throw new ApiError(400,"All fields are required");
    }
    // updating the details
    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName: fullName,
                email:email
            }
        },
        {new: true}
    ).select("-password");
    
    return res
    .status(200)
    .json(new ApiResponse(200,user,"Account Details updated successfully"));
})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar");
    }
    const user = await User.findByIdAndUpdate(
        req.user?.id,
        {
            $set:{
                avatar: avatar.url,
            }
        },
        {new: true}
    ).select("-password") 

    return res.status(200).json(
        new ApiResponse(200,user,"Avatar Image updated Successfully")
    )
})
const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image file is missing");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading coverImage");
    }
    const user = await User.findByIdAndUpdate(
        req.user?.id,
        {
            $set:{
                coverImage: coverImage.url,
            }
        },
        {new: true}
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(200,user,"Cover Image updated Successfully")
    )
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar, 
    updateUserCoverImage
};
// export default registerUser;