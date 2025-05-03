import { Router } from "express";
import { 
    loginUser,
    logoutUser, 
    registerUser,
    refreshAccessToken, 
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserImages,
    deleteUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateUserInput, sanitizeInput } from "../middlewares/validation.middleware.js";
import { errorHandler } from "../middlewares/error.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(
    sanitizeInput,
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    validateUserInput,
    registerUser
);

router.route("/login").post(
    sanitizeInput,
    validateUserInput,
    loginUser
);

router.route("/refresh-token").post(refreshAccessToken);

// Protected routes (require authentication)
// User Profile Management
router.route("/get-current-user")
    .get(verifyJWT, getCurrentUser);

router.route("/update-account")
    .patch(
        verifyJWT,
        sanitizeInput,
        validateUserInput,
        updateAccountDetails
    );

router.route("/update-user-images")
    .patch(
        verifyJWT,
        upload.fields([
            {
                name: "avatar",
                maxCount: 1
            },
            {
                name: "coverImage",
                maxCount: 1
            }
        ]),
        validateUserInput,
        updateUserImages
    );

router.route("/change-password")
    .post(
        verifyJWT,
        sanitizeInput,
        validateUserInput,
        changeCurrentPassword
    );

router.route("/delete-account")
    .delete(verifyJWT, deleteUser);

router.route("/logout")
    .post(verifyJWT, logoutUser);

// Apply error handling middleware
router.use(errorHandler);

export default router;