import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import TaiKhoan from '../models/auth/TaiKhoan.js';

export const jsonParser = express.json();
export const cookieParserMiddleware = cookieParser();

//verify Account
export const protectedRoute = async (req, res, next) => {
    try {
        //get token header Authorization: Bearer <token>
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy accesssToken." });
        }

        // Verify token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
            async (error, decodedAccount) => {
                if (error) {
                    console.error(error);
                    return res.status(403).json({ message: "accesssToken hết hạn hoặc không đúng" })
                }
                
                //Find Account and exclude Password
                const account = await TaiKhoan.findOne({
                    where: { MaTK: decodedAccount.MaTK },
                    attributes: { exclude: ["MatKhau"] }
                });
                
                if (!account) {
                    return res.status(404).json({ message: "người dùng không tồn tại" });
                }
                //respon account
                req.account = account
                next();
            }
        );
    } catch (error) {
        console.error("Lỗi khi gọi", error);
        return res.status(500).json({ message: "Lỗi hệ thống." });
    }
};