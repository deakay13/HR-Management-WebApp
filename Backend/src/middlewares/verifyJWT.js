import jwt from 'jsonwebtoken';
import TaiKhoan from '../models/auth/TaiKhoan.js';
import VaiTro from '../models/auth/VaiTro.js';
import Quyen from '../models/auth/Quyen.js';

//verify Account
export const protectedRoute = async (req, res, next) => {
    try {
        //get token header Authorization: Bearer <token>
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy accesssToken." });
        }

        // Verify token (Promise thay vì callback)
        const decodedAccount = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
                if (error) return reject(error);
                resolve(decoded);
            });
        });

        // 1 query duy nhất: Account + VaiTro + Quyen (thay vì 3 queries)
        const account = await TaiKhoan.findOne({
            where: { MaTK: decodedAccount.MaTK },
            attributes: { exclude: ["MatKhau"] },
            include: [{
                model: VaiTro,
                as: 'VaiTro',
                attributes: ['TenVaiTro'],
                include: [{
                    model: Quyen,
                    attributes: ['TenQuyen'],
                    through: { attributes: [] }
                }]
            }]
        });

        if (!account) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const accountData = account.toJSON();
        accountData.permissions = accountData.VaiTro?.Quyens?.map((p) => p.TenQuyen) || [];

        req.account = accountData;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: "accessToken hết hạn hoặc không đúng" });
        }
        console.error("Lỗi khi gọi", error);
        return res.status(500).json({ message: "Lỗi hệ thống." });
    }
};