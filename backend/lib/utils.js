import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (userId, res) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie('token', token, {
        httpOnly: true,//prevent XSS attacks by not allowing client-side scripts to access the cookie
        secure: process.env.NODE_ENV !== 'development', // ensures the cookie is sent over HTTPS in production
        sameSite: 'Strict',// helps prevent CSRF attacks by ensuring the cookie is sent only in first-party contexts
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return token;
}