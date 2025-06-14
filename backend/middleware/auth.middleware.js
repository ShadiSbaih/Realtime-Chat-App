import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import 'dotenv/config';

export  const  protectRoute = async (req, res, next) => {
    try {
        // Check if the token is present in cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "Authentication token is missing.",
                },
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "Invalid authentication token.",
                },
            });
        }
        // Find the user by ID from the decoded token
        const user = await User.findById(decoded.userId).select('-password -__v');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User not found.",
                },
            });
        }
        
        // Attach user information to the request object
        req.user = user;
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            success: false,
            error: {
                code: "UNAUTHORIZED",
                message: "Invalid or expired authentication token.",
            },
        });
    }
}