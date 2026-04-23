import cron from "node-cron";
import { Op } from "sequelize";
import Session from "../models/auth/Session.js";
import TaiKhoan from "../models/auth/TaiKhoan.js";

cron.schedule("0 0 * * *", async () => {
  try {
    /* Find expired sessions */
    const expiredSessions = await Session.findAll({
      where: {
        expiresAt: { [Op.lt]: new Date() },
      },
    });

    if (expiredSessions.length > 0) {
      /* Get list of account IDs of expired sessions */
      const accountIds = expiredSessions.map((session) => session.MaTK);

      /* Update status of these accounts to Offline */
      await TaiKhoan.update(
        { TrangThai: "Offline" },
        { where: { MaTK: { [Op.in]: accountIds } } },
      );

      /* Delete all expired sessions */
      await Session.destroy({
        where: {
          expiresAt: { [Op.lt]: new Date() },
        },
      });
      console.log(
        `Đã cập nhật Offline cho ${accountIds.length} tài khoản và xoá các session hết hạn.`,
      );
    } else {
      console.log("Cronjob: Không có session nào hết hạn ngày hôm nay.");
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
});
