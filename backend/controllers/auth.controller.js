import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
    const { email, fullName, password, profilePic } = req.body;

    try {
        // Validate required fields
        const missingFields = [];
        if (!email) missingFields.push("email");
        if (!fullName) missingFields.push("fullName");
        if (!password) missingFields.push("password");

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "All fields are required",
                    details: { missingFields },
                },
            });
        }
        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Password must be at least 8 characters long",
                    details: { field: "password" },
                },
            });
        }

        // Validate email format using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Please provide a valid email address",
                    details: { field: "email" },
                },
            });
        }

        // Validate fullName
        if (!fullName.trim() || fullName.trim().length < 3) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Full name must be at least 3 characters",
                    details: { field: "fullName" },
                },
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.trim().toLowerCase(),
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "USER_EXISTS",
                    message: "User with this email already exists",
                    details: { email: email.trim().toLowerCase() },
                },
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await User.create({
            email: email.trim().toLowerCase(),
            fullName,
            password: hashedPassword,
            profilePic: profilePic ?? "",
        });
        if (!newUser) {
            return res.status(500).json({
                success: false,
                error: {
                    code: "USER_CREATION_FAILED",
                    message: "Failed to create user. Please try again later.",
                },
            });
        }
        else {
            generateToken(newUser._id, res);
            await newUser.save();
        }

        // Return success response
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            },
        });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred during the signup process. Please try again later.",
                details: { error: error.message },
            },
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Email and password are required",
                },
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.trim().toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User not found",
                },
            });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "INVALID_CREDENTIALS",
                    message: "Invalid email or password",
                },
            });
        }

        // Generate token and set cookie
        generateToken(user._id, res);

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred during the login process. Please try again later.",
                details: { error: error.message },
            },
        });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("token", "", {
            maxAge: 0, // Set cookie to expire immediately
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });

    }
    catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred during the logout process. Please try again later.",
                details: { error: error.message },
            },
        });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        // Validate profilePic
        if (!profilePic || typeof profilePic !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Profile picture URL is required and must be a string",
                    details: { field: "profilePic" },
                },
            });
        }
        const userId = req.user._id;
        //validate userId
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "User not authenticated",
                },
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        // Find the user by ID and update the profile picture
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        },
            { new: true }//By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
        );
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User not found",
                },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                profilePic: updatedUser.profilePic,
            },
        });

    } catch (error) {
        console.error("Error during profile update:", error);
        return res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred during the profile update process. Please try again later.",
                details: { error: error.message },
            },
        });
    }
};

export const checkAuth = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "User not authenticated",
                },
            });
        }

        return res.status(200).json({
            success: true,
            message: "User is authenticated",
        });
    } catch (error) {
        console.error("Error during authentication check:", error);
        return res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred during the authentication check process. Please try again later.",
                details: { error: error.message },
            },
        });
    }
};