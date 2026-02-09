import cron from 'node-cron';
import { Op } from 'sequelize';
import Session from '../models/auth/Session.js';

cron.schedule('0 0 * * *', async () => {
    try {
        await Session.destroy({
        where: {
            expiresAt: { [Op.lt]: new Date() }
        }
        });
        console.log("Đã xoá session hết hạn");
    } catch (error) {
        console.error("Cron job error:", error);
    }
});