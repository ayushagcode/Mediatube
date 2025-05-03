import { ApiError } from "../utils/ApiError.js";

const sanitizeInput = (req, res, next) => {
    try {
        // Sanitize request body
        if (req.body) {
            Object.keys(req.body).forEach(key => {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = req.body[key].trim();
                }
            });
        }
        next();
    } catch (error) {
        throw new ApiError(400, "Error in input sanitization");
    }
};

const validateUserInput = (req, res, next) => {
    try {
        const { path } = req.route;
        
        switch (path) {
            case '/register':
                validateRegistration(req.body);
                break;
            case '/login':
                validateLogin(req.body);
                break;
            case '/update-account':
                validateAccountUpdate(req.body);
                break;
            case '/change-password':
                validatePasswordChange(req.body);
                break;
            case '/update-user-images':
                validateFileUpload(req.files);
                break;
        }
        next();
    } catch (error) {
        throw new ApiError(400, error.message || "Validation failed");
    }
};

const validateRegistration = (body) => {
    const { fullName, email, username, password } = body;
    
    if (!fullName || !email || !username || !password) {
        throw new ApiError(400, "All fields are required");
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new ApiError(400, "Invalid email format");
    }
    
    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }
};

const validateLogin = (body) => {
    const { username, email, password } = body;
    
    if ((!username && !email) || !password) {
        throw new ApiError(400, "Email/Username and password are required");
    }
};

const validateAccountUpdate = (body) => {
    const { fullName, email } = body;
    
    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new ApiError(400, "Invalid email format");
    }
};

const validatePasswordChange = (body) => {
    const { oldPassword, newPassword } = body;
    
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both old and new passwords are required");
    }
    
    if (newPassword.length < 8) {
        throw new ApiError(400, "New password must be at least 8 characters long");
    }
};

const validateFileUpload = (files) => {
    if (!files) {
        throw new ApiError(400, "No files uploaded");
    }

    // Validate file types if needed
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (files.avatar) {
        const avatar = files.avatar[0];
        if (!allowedTypes.includes(avatar.mimetype)) {
            throw new ApiError(400, "Invalid avatar file type");
        }
    }
    
    if (files.coverImage) {
        const coverImage = files.coverImage[0];
        if (!allowedTypes.includes(coverImage.mimetype)) {
            throw new ApiError(400, "Invalid cover image file type");
        }
    }
};

export {
    sanitizeInput,
    validateUserInput
}; 