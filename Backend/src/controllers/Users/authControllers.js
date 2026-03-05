import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { z } from 'zod';
import TaiKhoan from "../../models/auth/TaiKhoan.js"
import Session from "../../models/auth/Session.js";

const ACCESS_TOKEN_TTL= '15m';
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;
dotenv.config();

const accountSchema = z.object({
    TenTaiKhoan: z
        .string()
        .min(5, "Tài Khoản đăng nhập phải có ít nhất 5 ký tự")
        .max(50, "Tài khoản đăng nhập không quá 50 ký tự")
        .regex(/^[a-zA-Z0-9._]+$/, "Chỉ cho phép chữ, số, dấu chấm và gạch dưới"),
    MatKhau: z
        .string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .regex(/[A-Z]/, "Phải có ít nhất một chữ hoa")
        .regex(/[a-z]/, "Phải có ít nhất một chữ thường")
        .regex(/[0-9]/, "Phải có ít nhất một chữ số")
        .regex(/[@#$%!^&*]/, "Phải có ít nhất một ký tự đặc biệt"),
});

export const signIn = async (req, res) => {
    try {
        const parsed = accountSchema.safeParse({
            TenTaiKhoan: req.body.TenTaiKhoan,
            MatKhau: req.body.MatKhau,
        });
        
        //check Validate TenTaiKhoan và MatKhau
        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));
            return res.status(400).json({ errors: errorMessages });
        }

        //get data
        const { TenTaiKhoan, MatKhau } = req.body;
        if (!TenTaiKhoan || !MatKhau) { 
            return res.status(400).json({ message: "Thiếu tài khoản và mật khẩu đăng nhập" });
        }
        //Check account
        const account = await TaiKhoan.findOne({ where: { TenTaiKhoan } });
        if (!account) {
            return res.status(401).json({ message: "Tên Tài Khoản hoặc mật khẩu không đúng" });
        }

        //check password
        const dungMatKhau = await bcrypt.compare(MatKhau, account.MatKhau);
        if (!dungMatKhau) {
            return res.status(401).json({ message: "Tên Tài Khoản hoặc mật khẩu không đúng" });
        }

        //create accesstoken with JWT
        const accessToken = jwt.sign(
            {
                MaTK: account.MaTK,
                MaNV: account.MaNV,
                MaVT: account.MaVT
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: ACCESS_TOKEN_TTL
            }
        );

        //refresh
        const refreshToken = crypto.randomBytes(64).toString("hex");
        
        if (!refreshToken) {
            return res.status(500).json({ message: "Failed to generate refresh token." });
        }
        //create new session for save refreshtoken
        await Session.create({
            MaTK: account.MaTK,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
            createdAt: new Date(),
            updatedAt: new Date()
        })

        //refreshtoken in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL,
        })

        //respon accesssToken
        return res.status(200).json({ message: `Tai khoản ${account.TenTaiKhoan} đã đăng nhập`, accessToken });

    } catch (error) {
        console.error("Error signIn",error);
        return res.status(500).json({ message: "system error" });
    }
}
export const signOut = async (req, res) => {
    try {
        //get token from cookie
        const delToken = req.cookies?.refreshToken;
        
        //check token exists and clear token in cookie
        if (delToken) {
            await Session.destroy({ where: { refreshToken: delToken } });
            res.clearCookie(
                "refreshToken",
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                }
            );
        }
        //respon No content
        return res.sendStatus(204);
    } catch (error) {
        console.error("Lỗi khi gọi",error);
        return res.status(500).json({ message: "Lỗi hệ thống." });
    }
}