import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import User from '../models/NhanVien.js';

export const jsonParser = express.json();
export const cookieParserMiddleware = cookieParser();

//check who?
export const protectedRoute = async (req, res, next) => {
    try {
        // Lấy token từ header Authorization: Bearer <token>
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No access token provided." });
        }

        const token = authHeader.split(" ")[1];

        // Verify token bằng dạng Promise (dễ bắt lỗi hơn)
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Tìm user từ userId trong token
        const user = await User.findById(decoded.userId).select("-hashedPassword");

        if (!user) {
            return res.status(401).json({ message: "User not found or token invalid." });
        }

        req.user = user;
        next();

    } catch (error) {
        // Xử lý lỗi JWT cụ thể
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid access token." });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token has expired." });
        }

        console.error("Error in protectedRoute:", error);
        return res.status(500).json({ message: "System error." });
    }
};