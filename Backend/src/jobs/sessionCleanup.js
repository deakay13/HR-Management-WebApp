import cron from 'node-cron';
import { Op } from 'sequelize';
import Session from '../models/auth/Session.js';
import TaiKhoan from '../models/auth/TaiKhoan.js';

cron.schedule('0 0 * * *', async () => {
    try {
        // Tìm các session hết hạn
        const expiredSessions = await Session.findAll({
            where: {
                expiresAt: { [Op.lt]: new Date() }
            }
        });

        if (expiredSessions.length > 0) {
            // Lấy ra danh sách MaTK của các session bị quá hạn
            const accountIds = expiredSessions.map(session => session.MaTK);
            
            // Cập nhật trạng thái các tài khoản này về Offline
            await TaiKhoan.update(
                { TrangThai: 'Offline' },
                { where: { MaTK: { [Op.in]: accountIds } } }
            );

            // Xoá toàn bộ
            await Session.destroy({
                where: {
                    expiresAt: { [Op.lt]: new Date() }
                }
            });
            console.log(`Đã cập nhật Offline cho ${accountIds.length} tài khoản và xoá các session hết hạn.`);
        } else {
            console.log("Cronjob: Không có session nào hết hạn ngày hôm nay.");
        }
    } catch (error) {
        console.error("Cron job error:", error);
    }
});