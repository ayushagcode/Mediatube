import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true
    },
    coverImage: {
        type: String,
    },
    watchHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",

    },
    password: {
        type: String,
        required: [true, 'Password is required'],

    },
    refreshToken: {
        type: String,
    }
}, { timeStamps: true }
)
// hooks
userSchema.pre("save", async function (next) {
    // agar modified nhi hua
    if (!this.isModified("password")) return next();
    // else encrypt password
    try{
        this.password = await bcrypt.hash(this.password,10);
        next();
    }
    catch(error){
        next(error);
    }
})

// Custom method to verify a password
userSchema.methods.isPasswordCorrect = async function
    (password) {
    return await bcrypt.compare(password, this.password);
}

// Custom method to generate a JWT
userSchema.methods.generateAccessToken = function () {
    
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username,
        // payload: from database
        fullName: this.fullName,
    }
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const expiryTime = process.env.ACCESS_TOKEN_EXPIRY;
    return jwt.sign(payload, secretKey, {expiresIn:expiryTime});

}
// custom method to generate the refresh token
userSchema.methods.generateRefreshToken = function () {
    const payload = {
        _id: this._id,// users unique identifier
    }
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const expiryTime = process.env.ACCESS_TOKEN_EXPIRY || "7d";
    return jwt.sign(payload, secretKey, {expiresIn:expiryTime});
 }
export const User = mongoose.model("User", userSchema);

