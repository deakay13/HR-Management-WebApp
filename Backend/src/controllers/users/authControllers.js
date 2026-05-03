import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { z } from "zod";
import TaiKhoan from "../../models/auth/TaiKhoan.js";
import Session from "../../models/auth/Session.js";
import { setCache } from "../../utils/redisClient.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;
// Only use secure cookies in production (HTTPS). In local dev (HTTP), secure must be false.
const isProduction = process.env.NODE_ENV === "production";

const signInSchema = z.object({
  TenTaiKhoan: z.string().min(1, "Thiếu tài khoản"),
  MatKhau: z.string().min(1, "Thiếu mật khẩu"),
});

export const signIn = async (req, res) => {
  try {
    const parsed = signInSchema.safeParse({
      TenTaiKhoan: req.body.TenTaiKhoan,
      MatKhau: req.body.MatKhau,
    });

    if (!parsed.success) {
      return res.status(400).json({ message: "Thiếu tài khoản hoặc mật khẩu" });
    }

    const { TenTaiKhoan, MatKhau } = parsed.data;

    //Check account
    const account = await TaiKhoan.findOne({ where: { TenTaiKhoan } });
    if (!account) {
      return res
        .status(401)
        .json({ message: "Tên Tài Khoản hoặc mật khẩu không đúng" });
    }

    //check password
    const dungMatKhau = await bcrypt.compare(MatKhau, account.MatKhau);
    if (!dungMatKhau) {
      return res
        .status(401)
        .json({ message: "Tên Tài Khoản hoặc mật khẩu không đúng" });
    }

    //create accesstoken with JWT
    const accessToken = jwt.sign(
      {
        MaTK: account.MaTK,
        MaNV: account.MaNV,
        MaVT: account.MaVT,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );
    //refresh
    const refreshToken = crypto.randomBytes(64).toString("hex");

    if (!refreshToken) {
      return res
        .status(500)
        .json({ message: "Failed to generate refresh token." });
    }
    //create new session for save refreshtoken
    await Session.create({
      MaTK: account.MaTK,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    //refreshtoken in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: REFRESH_TOKEN_TTL,
    });

    //respon accesssToken
    // Cập nhật trạng thái Online
    await TaiKhoan.update(
      { TrangThai: "Online" },
      { where: { MaTK: account.MaTK } },
    );

    return res.status(200).json({
      message: `Tai khoản ${account.TenTaiKhoan} đã đăng nhập`,
      accessToken,
    });
  } catch (error) {
    console.error("Error signIn", error);
    return res.status(500).json({ message: "system error" });
  }
};
export const signOut = async (req, res) => {
  try {
    // Lấy AccessToken từ Header để đưa vào Blacklist
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    if (accessToken) {
      const decoded = jwt.decode(accessToken);
      if (decoded && decoded.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          // Lưu vào Redis blacklist
          await setCache(`bl_${accessToken}`, "blacklisted", ttl);
        }
      }
    }

    //get token from cookie
    const delToken = req.cookies?.refreshToken;

    //check token exists and clear token in cookie
    if (delToken) {
      const session = await Session.findOne({
        where: { refreshToken: delToken },
      });
      if (session) {
        await TaiKhoan.update(
          { TrangThai: "Offline" },
          { where: { MaTK: session.MaTK } },
        );
        await session.destroy();
      }
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });
    }
    //respon No content
    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};
export const refreshToken = async (req, res) => {
  try {
    //get refreshToken from cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại" });
    }

    //compare refreshToken with DB
    const session = await Session.findOne({ where: { refreshToken: token } });

    if (!session) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc hết hạn" });
    }

    //check account by MaTK from Session
    const account = await TaiKhoan.findOne({ where: { MaTK: session.MaTK } });
    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    //check expires
    if (new Date(session.expiresAt) < new Date()) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc hết hạn" });
    }
    //create new accesssToken
    const accessToken = jwt.sign(
      {
        MaTK: account.MaTK,
        MaNV: account.MaNV,
        MaVT: account.MaVT,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );
    //return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};
